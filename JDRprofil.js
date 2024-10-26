import { cardJSON, persosJSON, enemyJSON, mapsJSON, playerJSON, classes, iconsClasses } from "./JDRstore.js";
import {
  Perso,
  callPHP,
  createElement,
  dateToString,
  initDialog,
  sameDay,
  setCookie,
  stringToDate,
  toastNotification,
} from "./utils.js";

const charactersList = document.querySelector(".charactersList");
const persosE = [...charactersList.children];

// Table Initialisation

const cardKinds = ["map", "boss", "composant", "anecdote"];

//  LOADING
let indexPerso;
// var selectedID = selectPerso.selectedIndex;

window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("joueur")) {
    // selectedID = selectPerso.selectedIndex;
    loadPlayer(urlParams.get("joueur"));
  } else {
    // Default page with all players information
    document.querySelector("#allCards").classList.add("hide");

    Object.entries(playerJSON).forEach((player) => {
      const playerNameE = createElement("h3", player[0]);

      const playerData = player[1];
      const joueurDate = stringToDate(playerData.date);
      const today = stringToDate(dateToString(new Date()));

      const playerConnectedE = createElement("div", undefined, {
        class: "connectionPoint",
        style: { backgroundColor: sameDay(joueurDate, today) ? "green" : "grey" },
      });

      const playerCoinE = createElement("p", playerData["alpagaCoin"] + " (" + playerData["alpagaCoinSpent"] + ") ");

      const playerCoinPicE = createElement("img", undefined, {
        src: "images/alpagaCoin.png",
        class: "alpagaCoinPic",
        alt: " pièces",
      });

      playerCoinE.append(playerCoinPicE);

      const playerCardsE = createElement("p", "Nombre de cartes : " + playerData["cards"].length, {
        style: { fontSize: "13.5px" },
      });

      const playerCardsEP = createElement(
        "p",
        "Boss " + pBossP + "%, Anecdotes " + pAnecdoteP + "%<br/>Maps " + pMapsP + "%, Total " + pTotalP + "%",
        { style: { fontSize: "13.5px" } }
      );

      const playerCards = playerData.cards
        .map((pC) => cardJSON.find((c) => c.id === parseInt(pC)))
        .filter((p) => p != undefined);
      // console.log(playerCards);

      const pBossP = Math.floor(
        // Ignore hidden bosses
        (100 * playerCards?.filter((p) => p.kind === "boss" && !p.hidden).length) /
          cardJSON.filter((p) => p.kind === "boss" && !p.hidden).length
      );
      const pMapsP = Math.floor(
        (100 * playerCards?.filter((p) => p.kind === "map").length) / cardJSON.filter((p) => p.kind === "map").length
      );
      const pAnecdoteP = Math.floor(
        (100 * playerCards?.filter((p) => p.kind === "anecdote").length) /
          cardJSON.filter((p) => p.kind === "anecdote").length
      );
      const pTotalP = Math.floor((100 * playerCards?.length) / cardJSON.length);

      const entriesToday =
        joueurDate >= today || sameDay(joueurDate, today)
          ? Math.round(
              (playerData["entries"].reduce((acc, cur) => acc + cur / 3, 0) / playerData["entries"].length) * 100
            )
          : 100;

      const playerEntriesE = createElement("p", "Entrées restantes : " + entriesToday + "%", {
        style: { fontSize: "13px" },
      });

      const playerE = createElement(
        "div",
        [playerConnectedE, playerNameE, playerCoinE, playerCardsE, playerCardsEP, playerEntriesE],
        {
          onClick: () => {
            window.location.href = "jdr_profil.html?joueur=" + player[0];
          },
        }
      );
      playersE.append(playerE);

      const playersE = createElement("div", playerE, { id: "playersE", class: "flexContainer, charactersList" });
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

function loadPlayer(player) {
  charactersList.id = player;
  [...document.querySelectorAll("fieldset")].map(
    (fieldSetE) => (fieldSetE.className = playerJSON[player] ? "" : "hide")
  );

  if (!playerJSON[player]) return;

  const joueurData = updateDay(playerJSON[player], player);

  console.log(joueurData);

  // Display 100% image
  const playerCards = joueurData.cards
    .map((pC) => cardJSON.find((c) => c.id === parseInt(pC)))
    .filter((p) => p != undefined);

  const pBossP = Math.round(
    (100 * playerCards.filter((p) => p.kind === "boss").length) / cardJSON.filter((p) => p.kind === "boss").length
  );
  const pComposP = Math.round(
    (100 * playerCards.filter((p) => p.kind === "composant").length) /
      cardJSON.filter((p) => p.kind === "composant").length
  );
  const pAnecdoteP = Math.round(
    (100 * playerCards.filter((p) => p.kind === "anecdote").length) /
      cardJSON.filter((p) => p.kind === "anecdote").length
  );

  const allDone = pBossP === 100 && pComposP === 100 && pAnecdoteP === 100;
  console.log(allDone, pBossP, pComposP, pAnecdoteP);
  document.querySelector("#image100").closest("label").style.display = allDone ? "block" : "none";
  document.querySelector("#image10k").style.display = joueurData.alpagaCoin >= 10000 ? "block" : "none";

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

  const newPlayer = {};
  newPlayer[indexPlayer] = joueurData;
  // console.log(joueurData);

  setCookie("playerJSON", newPlayer);
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

  const persoWith10kPic = ["Malvis"];
  persoE.querySelector(".persoPic").src = perso.pp;
  if (joueurData.alpagaCoin >= 10000 && persoWith10kPic.includes(perso.nom))
    persoE.querySelector(".persoPic").src = perso.pp.replaceAll(".jpg", "_10k.jpg");

  persoE.addEventListener("click", () => {
    if (joueurData.entries[index] <= 0) {
      toastNotification("Erreur : Le personnage ne peut plus aller combattre, revenez demain !", 4000, true);
    } else {
      document.querySelector("#worldmap").classList.remove("hide");
      document.querySelector(".continent").classList.add("active");
      [...document.querySelectorAll(".mapMenu")][1].classList.add("activate");
      indexPerso = Object.entries(persosJSON).find((p) => p[1] === perso)[0];
    }
  });

  // Classes du perso
  const classePID = classes.indexOf(perso.classeP);
  const classeSID = classes.indexOf(perso.classeS);

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
    !e.target.dataset.map &&
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
  // Reset
  cardKinds.forEach((kind) => {
    if (kind === "anecdote") {
      [...document.querySelector("#" + kind).querySelectorAll("div")].forEach((e) => (e.innerText = ""));
    } else document.querySelector("#" + kind).innerText = "";
  });

  const rarityClass = ["common", "rare", "epic"];

  cardJSON.forEach((card) => {
    const nameCardE = createElement("h4", card.name);
    const descCardE = createElement("p", card.description);

    const imgEndPoint = "images/";
    let imgSrc;

    switch (card.kind) {
      case "map": {
        imgSrc = imgEndPoint + "loadingframe/Loading_" + card.kindId + ".png";
        break;
      }
      case "boss": {
        imgSrc = imgEndPoint + "monsters/" + card.kindId + ".png";
        break;
      }
      case "composant": {
        imgSrc = imgEndPoint + "items/" + card.kindId + ".png";
        break;
      }
      case "anecdote": {
        imgSrc = imgEndPoint + card.kindId + ".png";
        break;
      }
      default:
        console.log("Erreur, type non reconnu : " + card.kind);
    }
    const imgCardE = createElement("img", undefined, { src: imgSrc });

    const cardE = createElement("div", undefined, { class: `card, ${rarityClass[card.value - 1]}` });

    cardE.appendChild(imgCardE);
    if (joueurData.cards.includes(card.id)) {
      cardE.appendChild(nameCardE);
      cardE.appendChild(descCardE);
    } else {
      // Card to hide if not obtained
      if (card.hidden) return;
    }
    if (card.kind === "anecdote") {
      document.querySelector("#g" + card.group)?.append(cardE);
    } else {
      document.querySelector("#" + card.kind)?.append(cardE);
    }
  });
}

function countCards(joueurData) {
  cardKinds.forEach((kind) => {
    const countJoueurCardsByKind = joueurData.cards
      // Remove hidden
      .map((cardId) => cardJSON.filter((c) => c.id === cardId && c.kind === kind && !c.hidden).length)
      .reduce((partialSum, a) => partialSum + a, 0);

    const countHiddenCards = joueurData.cards
      // Remove hidden
      .map((cardId) => cardJSON.filter((c) => c.id === cardId && c.kind === kind && c.hidden).length)
      .reduce((partialSum, a) => partialSum + a, 0);

    // Remove hidden
    const countCardsByKind = cardJSON.filter((c) => c.kind === kind && !c.hidden).length;

    document.querySelector("#" + kind + "Count").innerText = `(${countJoueurCardsByKind}/${countCardsByKind})${
      countHiddenCards ? ` (+${countHiddenCards})` : ""
    }`;
  });
}

// Hide/Show cards by categories :

cardKinds.map((kind) => {
  const label = document.querySelector('label[for="' + kind + '"]');
  const element = document.getElementById(kind);
  label.addEventListener("click", () => {
    const willBeHidden = !element.classList.contains("hide");
    element.classList.toggle("hide");
    label.innerText = label.innerText.slice(0, -1) + (willBeHidden ? "▲" : "▼");
  });
});

// Filters cards :
const radioButtons = [...document.querySelectorAll("input[type='radio']")];
radioButtons.map((radioButton) =>
  radioButton.addEventListener("change", () => {
    const allCardsE = [...document.querySelectorAll(".card")];
    const filter = radioButtons.find((r) => r.checked).value;
    if (filter === "all") {
      allCardsE.map((cardE) => cardE.classList.remove("hide"));
    } else {
      allCardsE.map((cardE) => {
        const isAcquired = cardE.children.length > 1;
        if ((filter === "acquired" && isAcquired) || (filter === "not-acquired" && !isAcquired)) {
          cardE.classList.remove("hide");
        } else {
          cardE.classList.add("hide");
        }
      });
    }
  })
);

// Filters anecdotes group cards
const checkboxes = [...document.querySelectorAll("input[type='checkbox']")];
checkboxes.map((checkbox) =>
  checkbox.addEventListener("change", () => {
    checkboxes.map((cb) => {
      const groupeE = document.querySelector(`#${cb.value}`);
      if (cb.checked) groupeE.classList.remove("hide");
      else groupeE.classList.add("hide");
    });
  })
);

// Modal (Dialog) des informations de bases des labels

const labelsDescription = {
  alpagaCoin:
    "Les pièces d'Alpaga peuvent être échangées contre de l'expérience ou de l'or.<br/>1 XP (1 perso) = 4 à 10+ Pièces Alpaga<br/>1 Or (1 perso) = 2 à 4+ Pièces Alpaga.<br/> > Ce taux varie selon le nombre de persos, leur niveau, leur sort (soin/armure).<br/><br/>Attention : Pour échanger les pièces, il faut que la situation soit cohérente (roleplay), exemple : une interlude, le personnage a quitté le groupe pendant un moment, etc... Et même dans ces conditions, la quantité d'XP/Or donné est limité (ex : on ne peut pas obtenir 3 niveaux d'un coup), voici des exemples :<br/>- Sans aucun délai, les limites sont de 20 XP et 30 pièces (l'un ou l'autre, sinon moins).<br/>- Selon les séances loupées : 10 + 30 * (nombre de séances) en XP / pièces. Maximum : 200 / 300 (idem nouveau perso).",
  // map: "Les cartes de maps & donjons peuvent être obtenues sur leurs zones spécifiques. Elles donnent des informations sur la zone en question.",
  // boss: "Les cartes de Boss peuvent être obtenues n'importe où mais que sur des ennemis de niveau Boss (>= 200 PV). Elles donnent quelques informations sur eux et représentent une belle collection à avoir.",
  // composant:
  //   "Les cartes composants peuvent être obtenues n'importe où. Elles représentent un composant de mine, de ferme ou d'invocation (créatures).",
  // anecdote:
  //   "Les cartes anecdotes peuvent être obtenues dans des endroits et face à des ennemis étant en lien avec l'anecdote. Elles font références à des moments cultes vécus pendant le JDR !",
  image100: "100% des boss, composants et anecdotes ont été obtenus ! Félicitations !",
};

initDialog(labelsDescription);
