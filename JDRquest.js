import { playerJSON, mapsJSON, pnjJSON, persosJSON, enemyJSON } from "./JDRstore.js";
import { createElement, setCookie, toastNotification } from "./utils.js";

// const apiKey = "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";
const apiUrl = "https://api.openai.com/v1/chat/completions";

const responseElement = document.querySelector("#response");

let rarity, indexPerso, indexPlayer, pnjEnemy, mapID;

// Load perso if URL parameter
window.addEventListener("load", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has("perso")) {
    responseElement.innerText =
      "Erreur : vous devez saisir dans l'URL un numéro de personnage (jdr_quest?perso=4) par exemple.";
    stop();
    document.querySelector(".loading").remove();
    return;
  }

  indexPerso = urlParams.get("perso");
  indexPlayer = Object.entries(playerJSON)
    .map((player) => {
      if (player[1].persos.includes(parseInt(indexPerso))) {
        return player[0];
      }
    })
    .filter((e) => e != undefined)[0];
  const joueurData = playerJSON[indexPlayer];
  console.log(joueurData, indexPerso);

  if (!joueurData || joueurData.entries[joueurData.persos.indexOf(parseInt(indexPerso))] <= 0) {
    responseElement.innerText = "Erreur : Le personnage a déjà fait ses 3 entrées, veuillez en choisir un autre !";
    console.log("Erreur : Le personnage a déjà fait ses 3 entrées, veuillez en choisir un autre !");
    stop();
    document.querySelector(".loading").remove();
    return;
  }

  const persoData = persosJSON[(parseInt(indexPerso) - 1).toString()];
  const enemyData = chooseEnemy(urlParams.get("map"));

  if (!enemyData) {
    toastNotification("Erreur : aucun ennemi n'existe sur cette map", 6000, true);
    return;
  }
  initializeEnemy(enemyData, rarity);

  const randomPNJ = Math.floor(Math.random() * Object.entries(pnjJSON).length + 1);
  console.log("randomPNJ :", randomPNJ);
  const pnjData = pnjJSON[randomPNJ];

  pnjEnemy = Object.values(enemyJSON).find((e) => e.visuel3D.toLowerCase() == pnjData["id"].toLowerCase());

  // 10 pour le moment en desc
  mapID = urlParams.get("map") || Math.round(Math.random() * 7 + 3);
  const mapData = mapsJSON[mapID.toString()];

  document.querySelector(".game").style.backgroundImage = "url('./images/loadingframe/Loading_" + mapID + "B.jpg')";

  document.querySelector("#mapName").innerText = mapData["name"];

  initializeActions(enemyData, pnjEnemy, mapID);

  document.querySelector("#pnj").src = "./images/PNJ/" + pnjData["id"] + ".png";
  document.querySelector("#persoName").innerText = persoData["nom"];
  document.querySelector("#perso").src = persoData["pp"].replace("http://voldre.free.fr/Eden", ".");

  // CHAT GPT PROMPT

  const instruction =
    "Consignes à respecter : Tu dois parler pour demander de l'aide à " +
    persoData["nom"] +
    ". Ton discours contient 120 mots (soit 6 phrases) avec des paragraphes et saute des lignes à chaque phrase. Enfin : " +
    pnjData["lang"];

  const message = writeMessage(persoData, pnjData, mapData, enemyData);
  const apiKey = await getChatGPTKey();

  // Update 20/03/24 : Trigger Chat GPT request only on click
  document.querySelector("#fetch_gpt").addEventListener("click", () => {
    responseElement.innerText = "Chargement...";
    document.querySelector(".game").classList.add("loading");
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: instruction },
          { role: "user", content: message },
        ],
        max_tokens: 350,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          throw new Error("ChatGPT code : " + data.error.code);
          // responseElement.innerHTML = "Erreur ChatGPT. Motif : " + data.error.code;
        }
        const response = data.choices[0].message.content;
        responseElement.innerHTML = response.replaceAll("\n", "<br/>");
        document.querySelector(".game").classList.remove("loading");
      })
      .catch((error) => {
        responseElement.innerText = "Erreur lors de la requête à l'API. " + error.toString();
        console.error("Erreur lors de la requête à l'API. ", error);
        document.querySelector(".game").classList.remove("loading");
      });
  });
});

async function getChatGPTKey() {
  try {
    const result = await fetch("jdr_backend.php", {
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      method: "POST",
      body: new URLSearchParams({ action: "chatGpt" }),
    });
    return result;
  } catch (error) {
    console.log(error);
    responseElement.innerHTML = "Echec de la récupération de la clé de l'API ChatGPT :" + JSON.stringify(error);
    document.querySelector(".game").classList.remove("loading");
  }
}

function writeMessage(persoData, pnjData, mapData, enemyData) {
  const pnjDesc = "Ton personnage est " + pnjData["nom"] + ". Tu es : " + pnjData["desc"];
  const mapDesc = "Tu vies au (à la) " + mapData["name"] + ", description : " + mapData["desc"];
  const enemyDesc =
    "Là où tu vies, vous avez des problèmes avec : " + enemyData["nom"] + ", cette personne est : " + enemyData["desc"];
  const persoDesc =
    "La personne a qui tu parles, et à qui tu vas demander de l'aide s'appelle " +
    persoData["nom"] +
    ", voici sa personnalité : " +
    persoData["personnalite"];
  // ". Et voici son histoire : " +persoData["background"];

  return `Tu incarnes un personnage dans l'univers de Eden Eternal.  ${pnjDesc}.\n ${mapDesc}.\n ${enemyDesc}.\n ${persoDesc}.\n`;
}

function chooseEnemy(mapId = null, category = null) {
  // prettier-ignore
  const forbidden = ["82","101","104","109"];

  let enemyListId = Object.keys(enemyJSON).filter((eID) => !forbidden.includes(eID));

  // prettier-ignore
  const boss = ["24","29","45","46","50","54","56","57","59","61","62","67","70","71","74","75","76","77","80","82","84","85","86","89","90","101","106","109","111","113","114","118","119"];

  if (category === "boss") {
    enemyListId = enemyListId.filter((eID) => boss.includes(eID));
  } else if (category === "mob") {
    enemyListId = enemyListId.filter((eID) => !boss.includes(eID));
  }

  if (mapId) {
    if (!mapsJSON[mapId].mobs) {
      responseElement.innerText = "Erreur : Aucun n'ennemi n'existe pour le moment sur cette carte, désolé !";
      return;
    }
    enemyListId = enemyListId.filter((eID) => mapsJSON[mapId].mobs.includes(parseInt(eID)));

    // If map choosed for fight, filter by rarity !
    rarity = Math.floor(Math.random() * 3) + 1;

    if (rarity <= 2) {
      // Handle ennemy rarity 1 & 2 (Common & Rare)
      enemyListId = enemyListId.filter((eID) => enemyJSON[eID].pvmax < 200);
    } else {
      if (enemyListId.filter((eID) => enemyJSON[eID].pvmax >= 200).length === 0) {
        rarity = 2;
      } else {
        enemyListId = enemyListId.filter((eID) => enemyJSON[eID].pvmax >= 200);
      }
    }
  }

  const randomId = Math.floor(Math.random() * enemyListId.length);
  const enemyData = enemyJSON[enemyListId[randomId]];
  return enemyData;
}

function initializeEnemy(enemyData, rarity) {
  if (rarity === 1) {
    document.querySelector("#rarity").src = "images/uiiconPNG/combat_mob.png";
    document.querySelector("#rarity").alt = "Monstre Commun";
  }
  if (rarity === 2 || (enemyData.pvmax > 120 && enemyData.pvmax < 200)) {
    document.querySelector("#rarity").src = "images/uiiconPNG/combat_elite.png";
    document.querySelector("#rarity").alt = "Elite";
  }
  if (rarity === 3) {
    document.querySelector("#rarity").src = "images/uiiconPNG/combat_boss.png";
    document.querySelector("#rarity").alt = "Boss";
  }

  document.querySelector("#enemy").src = "./images/monsters/" + enemyData.visuel3D + ".png";
  document.querySelector("#enemy").alt = enemyData.visuel3D;
  document.querySelector("#enemy").title = enemyData.nom;
}

function initializeActions(enemyData, pnjEnemy = { nom: null }, mapID) {
  document.querySelector("#actions").innerHTML = "";

  // Upgrade enemy to Elite if the rarity selected randomly is "2" and the enemy is "common"
  const isElite = rarity === 2 && enemyData.pvmax <= 120;

  const actions = pnjEnemy.nom
    ? ["Accepter la Quête", "Refuser la Quête", "Refuser et combattre"]
    : ["Accepter la Quête", "Refuser la Quête"];

  Object.entries(actions).forEach(([id, action]) => {
    id = parseInt(id);
    let enemy;
    let actionURL;
    if (id === 0) {
      enemy = enemyData["nom"];
      actionURL =
        "jdr_combat.html?perso=" + indexPerso + "&enemy=" + enemy + "&map=" + mapID + (isElite ? "&isElite" : "");
    } else if (id === 1) {
      actionURL = "jdr_profil.html?joueur=" + indexPlayer;
    } else if (id === 2) {
      // Change enemy
      enemy = pnjEnemy["nom"];
      actionURL =
        "jdr_combat.html?perso=" + indexPerso + "&enemy=" + enemy + "&map=" + mapID + (isElite ? "&isElite" : "");
    }

    const liElem = createElement("li", action, {
      onClick: () => {
        if (id !== 1) setCookie("loadJDRcombat", true);
        window.location.href = actionURL;
      },
    });

    document.querySelector("#actions").append(liElem);
  });
}

document.querySelector(".enemy-wrapper").addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const enemyData = chooseEnemy(urlParams.get("map"));

  initializeEnemy(enemyData, rarity);
  initializeActions(enemyData, pnjEnemy, mapID);
});
