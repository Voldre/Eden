import { cardJSON, persosJSON, enemyJSON, mapsJSON, playerJSON } from "./JDRstore";
import { Perso, callPHP, dateToString, initDialog, sameDay, stringToDate, toastNotification } from "./utils";

const charactersList = document.querySelector(".charactersList");
const persosE = [...charactersList.children];

// Table Initialisation

// prettier-ignore
const classes = [ "Guerrier", "Chevalier", "Templier", "Chev Dragon", "Voleur", "Assassin", "Danselame", "Samouraï", "Chasseur", "Ingénieur", "Corsaire", "Juge", "Clerc", "Barde", "Shaman", "Sage", "Magicien", "Illusionniste", "Démoniste", "Luminary",];
// prettier-ignore
const iconsClasses = [ "01", "02", "03", "18", "04", "05", "06", "16", "07", "08", "09", "59", "10", "11", "12", "17", "13", "14", "15", "19",];

//  LOADING
const selectPerso = document.querySelector("#selectPlayer");
var selectedPerso = selectPerso.value;
var indexPerso;
// var selectedID = selectPerso.selectedIndex;

window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("joueur")) {
    selectPerso.value = urlParams.get("joueur");
    selectedPerso = selectPerso.value;
    // selectedID = selectPerso.selectedIndex;
    loadPlayer(selectedPerso);
  } else {
    // Default page with all players information
    document.querySelector("#allCards").classList.add("hide");
    const playersE = document.createElement("div");
    playersE.classList.add("flexContainer");
    playersE.classList.add("charactersList");
    playersE.id = "playersE";

    Object.entries(playerJSON).forEach((player) => {
      const playerE = document.createElement("div");
      playerE.addEventListener("click", () => {
        window.location.href = "jdr_profil.html?joueur=" + player[0];
      });

      const playerNameE = document.createElement("h3");
      playerNameE.innerText = player[0];

      const playerData = player[1];

      const playerConnectedE = document.createElement("div");
      playerConnectedE.className = "connectionPoint";

      const joueurDate = stringToDate(playerData.date);
      const today = stringToDate(dateToString(new Date()));

      if (sameDay(joueurDate, today)) {
        playerConnectedE.style.backgroundColor = "green";
      } else {
        playerConnectedE.style.backgroundColor = "grey";
      }

      const playerCoinE = document.createElement("p");
      playerCoinE.innerText = playerData["alpagaCoin"] + " (" + playerData["alpagaCoinSpent"] + ") ";

      const playerCoinPicE = document.createElement("img");
      playerCoinPicE.src = "images/alpagaCoin.png";
      playerCoinPicE.className = "alpagaCoinPic";
      playerCoinPicE.alt = " pièces";
      playerCoinE.append(playerCoinPicE);

      const playerCardsE = document.createElement("p");
      playerCardsE.innerText = "Nombre de cartes : " + playerData["cards"].length;
      playerCardsE.style.fontSize = "13.5px";

      const playerCardsEP = document.createElement("p");
      playerCardsEP.style.fontSize = "13.5px";
      const playerCards = playerData.cards
        .map((pC) => cardJSON.find((c) => c.id === parseInt(pC)))
        .filter((p) => p != undefined);
      // console.log(playerCards);

      const pBossP = Math.round(
        (100 * playerCards?.filter((p) => p.kind === "boss").length) / cardJSON.filter((p) => p.kind === "boss").length
      );
      const pMapsP = Math.round(
        (100 * playerCards?.filter((p) => p.kind === "map").length) / cardJSON.filter((p) => p.kind === "map").length
      );
      const pAnecdoteP = Math.round(
        (100 * playerCards?.filter((p) => p.kind === "anecdote").length) /
          cardJSON.filter((p) => p.kind === "anecdote").length
      );
      const pTotalP = Math.round((100 * playerCards?.length) / cardJSON.length);

      playerCardsEP.innerHTML =
        "Boss " + pBossP + "%, Anecdotes " + pAnecdoteP + "%<br/>Maps " + pMapsP + "%, Total " + pTotalP + "%";

      const playerEntriesE = document.createElement("p");

      // New day = not today and in future
      console.log(joueurDate, today, sameDay(joueurDate, today));
      const entriesToday =
        joueurDate >= today || sameDay(joueurDate, today)
          ? Math.round(
              (playerData["entries"].reduce((acc, cur) => acc + cur / 3, 0) / playerData["entries"].length) * 100
            )
          : 100;
      playerEntriesE.innerText = "Entrées restantes : " + entriesToday + "%";
      playerEntriesE.style.fontSize = "13px";

      playerE.append(playerConnectedE, playerNameE, playerCoinE, playerCardsE, playerCardsEP, playerEntriesE);
      playersE.append(playerE);
      document.querySelector("body").append(playersE);
    });

    // Display all persos stats in combat
    Object.values(persosJSON).forEach((p) => {
      const persoP = new Perso(p, false);
      persoP.degat != "-" && console.log(persoP);
    });

    // Display all persos by classes (if perso really exist)
    const rawClassLists = Object.values(persosJSON)
      .filter((p) => parseInt(p.niv) < 15)
      .map((p) => [p.classeP, p.classeS]);
    const allClassLists = [].concat(...rawClassLists);
    const counter = {};

    allClassLists.forEach((ele) => {
      if (counter[ele]) {
        counter[ele] += 1;
      } else {
        counter[ele] = 1;
      }
    });
    console.log("Persos par classes :", counter);

    const newCounter = {};
    // prettier-ignore
    const classes = [ "Guerrier", "Chevalier", "Templier", "Chev Dragon", "Voleur", "Assassin", "Danselame", "Samouraï", "Chasseur", "Ingénieur", "Corsaire", "Juge", "Clerc", "Barde", "Shaman", "Sage", "Magicien", "Illusionniste", "Démoniste", "Luminary",];
    classes.forEach((c) => {
      const persosC = Object.values(persosJSON)
        .filter((p) => parseInt(p.niv) < 15)
        .filter((p) => p.classeP === c || p.classeS === c);
      persosC.forEach((pC) => {
        if (!newCounter[c]) newCounter[c] = [];
        newCounter[c].push(pC.nom);
      });
    });
    console.log(newCounter);

    // Display nb anecdote by map
    const anecdoteByMap = Object.entries(mapsJSON).map((m) => [
      m[1].name,
      cardJSON.filter((c) => c.kind === "anecdote" && c.maps.includes(parseInt(m[0]))).length,
    ]);
    console.log("Anecdotes par map (FAIRE INDEX+1 car Aven === 1 pas 0)", anecdoteByMap);

    // Display nb anecdote by map
    const enemiesOnMap = Object.entries(mapsJSON)
      .filter((m) => m[1].mobs !== undefined)
      .map((m) => [
        m[1].name,
        m[1].mobs.map((e) => [Object.values(enemyJSON[e.toString()])[1], Object.values(enemyJSON[e.toString()])[2]]),
      ]);
    console.log("Ennemis par map", enemiesOnMap);

    const bossByMap = enemiesOnMap.map((map_e) => [map_e[0], map_e[1].filter((e) => e[1] >= 200).length]);
    console.log("Nb boss par map", bossByMap);

    console.log(
      "Formule pour calculer le nb d'anecdotes d'un joueur sur une map :",
      "playerJSON['Victorine'].cards.map(c => cardJSON.find(cj => cj.id==c)).filter(cf => cf.kind == 'anecdote' && cf.maps.includes(XXX))"
    );
  }
});

Object.keys(playerJSON).forEach((player) => {
  // console.log(player);
  var option = document.createElement("option");
  option.value = player;
  option.innerText = player;
  document.querySelector("#selectPlayer").append(option);
});

document.querySelector("#selectPlayer").addEventListener("change", (e) => {
  document.querySelector("#allCards").classList.remove("hide");
  document.querySelector("#playersE")?.remove();
  loadPlayer(e.target.value);
});

function loadPlayer(player) {
  charactersList.id = player;

  if (!playerJSON[player]) return;

  const joueurData = updateDay(playerJSON[player], player);

  console.log(joueurData);

  document.querySelector(".alpagaCoin").innerText = joueurData.alpagaCoin;
  document.querySelector(".alpagaCoinSpent").innerText = " (" + joueurData.alpagaCoinSpent + ")";

  const persosData = joueurData.persos.map((idPerso) => {
    return persosJSON[idPerso - 1]; // Error, index -1
  });

  if (!persosData) return;

  persosE.forEach((e) => e.classList.add("hide"));

  persosData.forEach((perso, index) => {
    loadPerso(perso, index, joueurData);
  });

  loadCards(joueurData);
  countCards(joueurData);

  toastNotification("Chargement réussi de " + player);
}

function updateDay(joueurData, indexPlayer) {
  const joueurDate = stringToDate(joueurData.date);
  const today = stringToDate(dateToString(new Date()));

  // Bug Fix 29/11/23, different UTC (local time) can generate date in future
  // In this case, UTC+X can go on page, and put date to Day+1, and UTC+0 can go back and put date to Day
  // This switch always trigger the updateDay. Thank you Hugo and Rachel !
  // Bug Fix 14/05/24 : Check date by string, and locale string format make error ! Thank you again Rachel !
  if (sameDay(joueurDate, today)) return joueurData;

  joueurData.date = dateToString(today);
  joueurData.entries = joueurData.entries.map(() => 3);

  // Exception Hugo qui n'a qu'un/deux personnage(s) (26/11/23)
  if (joueurData.entries.length === 1) joueurData.entries = joueurData.entries.map(() => 6);
  if (joueurData.entries.length === 2) joueurData.entries = joueurData.entries.map(() => 4);

  joueurData.alpagaCoin += 5;

  var newPlayer = {};
  newPlayer[indexPlayer] = joueurData;
  // console.log(joueurData);

  const newPersoEncoded = JSON.stringify(newPlayer).replaceAll("+", "%2B").replaceAll(";", "%3B");
  const cookiePerso = "playerJSON=" + newPersoEncoded + "; SameSite=Strict";
  document.cookie = cookiePerso;

  // eslint-disable-next-line no-undef
  callPHP({ action: "saveFile", name: "player" });

  toastNotification("Cadeau de Connexion Quotidienne : 5 Pièces Alpaga !", 6000);

  return joueurData;
}

function loadPerso(perso, index, joueurData) {
  // console.log(perso, index);
  const persoE = persosE[index];

  // Entrées du perso
  persoE.querySelector(".entries").innerText = joueurData.entries[index] + "/3 ";

  persoE.querySelector("#nom").value = perso.nom;

  const persoCombat = new Perso(perso, false);
  persoE.querySelector("#degat").value = persoCombat.degat;
  persoE.querySelector("#armure").value = persoCombat.armure;

  persoE.querySelector(".persoPic").src = perso.pp;
  persoE.addEventListener("click", () => {
    if (joueurData.entries[index] <= 0) {
      toastNotification("Erreur : Le personnage ne peut plus aller combattre, revenez demain !");
    } else {
      document.querySelector("#worldmap").classList.remove("hide");
      document.querySelector(".continent").classList.add("active");
      [...document.querySelectorAll(".mapMenu")][1].classList.add("activate");
      indexPerso = Object.entries(persosJSON).find((p) => p[1] === perso)[0];
    }
  });

  // Classes du perso
  var classePID = classes.indexOf(perso.classeP);
  var classeSID = classes.indexOf(perso.classeS);

  persoE.querySelector(".iconClasses").children[0].src =
    "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[classePID] + ".png";
  persoE.querySelector(".iconClasses").children[1].src =
    "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[classeSID] + ".png";

  persoE.classList.remove("hide");
}

// Update worldmap displayed (add 2 continents 23/12/2023)
[...document.querySelectorAll(".mapMenu")].map((eMapMenu) => {
  eMapMenu.addEventListener("click", (e) => {
    // On new click, remove all activated menu
    [...document.querySelectorAll(".mapMenu")].forEach((eMap) => eMap.classList.remove("activate"));
    e.target.classList.add("activate");

    // Detect which continent is displayed
    [...document.querySelectorAll(".continent")].forEach((eContinent) => {
      if (eContinent.dataset.worldmap === e.target.dataset.worldmap) {
        eContinent.classList.add("active");
      } else {
        eContinent.classList.remove("active");
      }
    });
  });
});

document.addEventListener("click", (e) => {
  if (e.target.dataset.map || (e.target.parentElement && e.target.parentElement.dataset.map)) {
    const map = e.target.dataset.map || e.target.parentElement.dataset.map;
    window.location.href = "jdr_quest.html?perso=" + (parseInt(indexPerso) + 1) + "&map=" + map;
    return;
  }
  if (
    e.target.className !== "point" &&
    e.target.className !== "worldmap-img" &&
    e.target.className !== "persoPic" &&
    !e.target.className.includes("mapMenu")
  ) {
    [...document.querySelectorAll(".continent")].forEach((eContinent) => {
      if ([...eContinent.classList].includes("active")) eContinent.classList.remove("active");
    });
    document.querySelector("#worldmap").classList.add("hide");
    [...document.querySelectorAll(".mapMenu")].forEach((eMap) => eMap.classList.remove("activate"));
  }
});

function loadCards(joueurData) {
  const kinds = ["map", "boss", "composant", "anecdote"];

  // Reset
  kinds.forEach((kind) => {
    if (kind === "anecdote") {
      [...document.querySelector("#" + kind).querySelectorAll("div")].forEach((e) => (e.innerText = ""));
    } else document.querySelector("#" + kind).innerText = "";
  });

  const rarityClass = ["common", "rare", "epic"];

  cardJSON.forEach((card) => {
    const cardE = document.createElement("div");
    cardE.className = "card";
    cardE.classList.add(rarityClass[card.value - 1]);
    const nameCardE = document.createElement("h4");
    nameCardE.innerText = card.name;
    const descCardE = document.createElement("p");
    descCardE.innerText = card.description;

    const imgCardE = document.createElement("img");

    const imgEndPoint = "images/";

    switch (card.kind) {
      case "map": {
        imgCardE.src = imgEndPoint + "loadingframe/Loading_" + card.kindId + ".png";
        break;
      }
      case "boss": {
        imgCardE.src = imgEndPoint + "monsters/" + card.kindId + ".png";
        break;
      }
      case "composant": {
        imgCardE.src = imgEndPoint + "items/" + card.kindId + ".png";
        break;
      }
      case "anecdote": {
        imgCardE.src = imgEndPoint + card.kindId + ".png";
        break;
      }
      default:
        console.log("Erreur, type non reconnu : " + card.kind);
    }

    cardE.appendChild(imgCardE);
    if (joueurData.cards.includes(card.id)) {
      cardE.appendChild(nameCardE);
      cardE.appendChild(descCardE);
    } else {
      // Card to hide if not obtained
      if (card.id === 1055) return;
    }
    if (card.kind === "anecdote") {
      document.querySelector("#g" + card.group)?.append(cardE);
    } else {
      document.querySelector("#" + card.kind)?.append(cardE);
    }
  });
}

function countCards(joueurData) {
  const kinds = ["map", "boss", "composant", "anecdote"];

  kinds.forEach((kind) => {
    const countJoueurCardsByKind = joueurData.cards
      .map((cardId) => cardJSON.filter((c) => c.id === cardId && c.kind === kind).length)
      .reduce((partialSum, a) => partialSum + a, 0);

    const countCardsByKind = cardJSON.filter((c) => c.kind === kind).length;

    document.querySelector("#" + kind + "Count").innerText =
      "(" + countJoueurCardsByKind + "/" + countCardsByKind + ")";
  });
}

// Modal (Dialog) des informations de bases des labels

const labelsDescription = {
  alpagaCoin:
    "Les pièces d'Alpaga peuvent être échangées contre de l'expérience ou de l'or.<br/>1 XP (1 perso) = 4 à 10+ Pièces Alpaga<br/>1 Or (1 perso) = 2 à 4+ Pièces Alpaga.<br/> > Ce taux varie selon le nombre de persos, leur niveau, leur sort (soin/armure).<br/><br/>Attention : Pour échanger les pièces, il faut que la situation soit cohérente (roleplay), exemple : une interlude, le personnage a quitté le groupe pendant un moment, etc... Et même dans ces conditions, la quantité d'XP/Or donné est limité (ex : on ne peut pas obtenir 3 niveaux d'un coup), voici des exemples :<br/>- Sans aucun délai, les limites sont de 20 XP et 30 pièces (l'un ou l'autre, sinon moins).<br/>- Selon les séances loupées : 10 + 30 * (nombre de séances) en XP / pièces. Maximum : 200 / 300 (idem nouveau perso).",
  map: "Les cartes de maps & donjons peuvent être obtenues sur leurs zones spécifiques. Elles donnent des informations sur la zone en question.",
  boss: "Les cartes de Boss peuvent être obtenues n'importe où mais que sur des ennemis de niveau Boss (>= 200 PV). Elles donnent quelques informations sur eux et représentent une belle collection à avoir.",
  composant:
    "Les cartes composants peuvent être obtenues n'importe où. Elles représentent un composant de mine, de ferme ou d'invocation (créatures).",
  anecdote:
    "Les cartes anecdotes peuvent être obtenues dans des endroits et face à des ennemis étant en lien avec l'anecdote. Elles font références à des moments cultes vécus pendant le JDR !",
};

initDialog(labelsDescription);
