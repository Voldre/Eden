// JSON Initialisation
var xhReq = new XMLHttpRequest();
var cardJSON = {};
var persosJSON = {};
var playerJSON = [];

console.log(window.location.href);
if (window.location.href.includes("http")) {
  xhReq.open("GET", "./JDRskills.json" + "?" + new Date().getTime(), false);
  xhReq.send(null);

  cardJSON = getData("card");

  persosJSON = getData("persos");

  playerJSON = getData("player");
}

function getData(filename) {
  xhReq.open("GET", "./JDR" + filename + ".json" + "?" + new Date().getTime(), false);
  xhReq.send(null);
  return JSON.parse(xhReq.responseText);
}

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
    // loadFiche(urlParams.get('perso'));
    selectedPerso = selectPerso.value;
    // selectedID = selectPerso.selectedIndex;
    loadPlayer(selectedPerso);
  }
});

Object.keys(playerJSON).forEach((player) => {
  console.log(player);
  var option = document.createElement("option");
  option.value = player;
  option.innerText = player;
  document.querySelector("#selectPlayer").append(option);
});

document.querySelector("#selectPlayer").addEventListener("change", (e) => {
  console.log(e.target.value);
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
  const today = new Date().toLocaleString().split(" ")[0];

  if (joueurData.date === today) return joueurData;

  joueurData.date = today;
  joueurData.entries.map(() => 3);

  joueurData.alpagaCoin += 5;

  var newPlayer = {};
  newPlayer[indexPlayer] = joueurData;
  // console.log(joueurData);

  const newPersoEncoded = JSON.stringify(newPlayer).replaceAll("+", "%2B").replaceAll(";", "%3B");
  const cookiePerso = "playerJSON=" + newPersoEncoded + "; SameSite=Strict";
  document.cookie = cookiePerso;

  // eslint-disable-next-line no-undef
  $.ajax({
    url: "JDRsaveFile.php",
    type: "post",
    data: { name: "player" },
  });

  console.log("saveFiche() done : JDRsaveFile.php executed");

  toastNotification("Cadeau de Connexion Quotidienne : 5 Pièces Alpaga !", 6000);

  return joueurData;
}

function loadPerso(perso, index, joueurData) {
  // console.log(perso, index);
  const persoE = persosE[index];

  // Entrées du perso
  persoE.querySelector(".entries").innerText = joueurData.entries[index] + "/3 ";

  persoE.querySelector("#nom").value = perso.nom;
  persoE.querySelector("#niv").value = perso.niv;
  persoE.querySelector(".persoPic").src = perso.pp;
  persoE.addEventListener("click", () => {
    if (joueurData.entries[index] === 2) {
      toastNotification("Erreur : Le personnage ne peut plus aller combattre, revenez demain !");
    } else {
      document.querySelector("#worldmap").classList.add("active");
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

document.addEventListener("click", (e) => {
  if (e.target.dataset.map || e.target.parentElement.dataset.map) {
    window.location.href =
      "jdr_quest.html?perso=" +
      (parseInt(indexPerso) + 1) +
      "&map=" +
      (e.target.dataset.map || e.target.parentElement.dataset.map);
    return;
  }
  if (e.target.id !== "worldmap01" && e.target.className !== "persoPic")
    if ([...document.querySelector("#worldmap").classList].includes("active"))
      document.querySelector("#worldmap").classList.remove("active");
});

function loadCards(joueurData) {
  const kinds = ["map", "boss", "composant", "anecdote"];

  // Reset
  kinds.forEach((kind) => (document.querySelector("#" + kind).innerText = ""));

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
    console.log(joueurData);
    if (joueurData.cards.includes(card.id)) {
      cardE.appendChild(nameCardE);
      cardE.appendChild(descCardE);
    }
    document.querySelector("#" + card.kind)?.append(cardE);
  });
}

function countCards(joueurData) {
  const kinds = ["map", "boss", "composant", "anecdote"];

  kinds.forEach((kind) => {
    const countJoueurCardsByKind = joueurData.cards
      .map((cardId) => cardJSON.filter((c) => c.id === cardId && c.kind === kind).length)
      .reduce((partialSum, a) => partialSum + a, 0);
    console.log(kind, countJoueurCardsByKind);

    const countCardsByKind = cardJSON.filter((c) => c.kind === kind).length;

    document.querySelector("#" + kind + "Count").innerText =
      "(" + countJoueurCardsByKind + "/" + countCardsByKind + ")";
  });
}

// Modal (Dialog) des informations de bases des labels

var labelsDescription = {
  alpagaCoin:
    "Les pièces d'Alpaga peuvent être échangées contre de l'expérience ou de l'or.<br/>1 XP (1 perso) = 5 Pièces Alpaga<br/>1 Or (1 perso) = 2 Pièces Alpaga.",
  map: "Les cartes de maps & donjons peuvent être obtenues sur leurs zones spécifiques. Elles donnent des informations sur la zone en question.",
  boss: "Les cartes de Boss peuvent être obtenues n'importe où mais que sur des ennemis de niveau Boss (>= 200 PV). Elles donnent quelques informations sur eux et représentent une belle collection à avoir.",
  composant:
    "Les cartes composants peuvent être obtenues n'importe où. Elles représentent un composant de mine, de ferme ou d'invocation (créatures).",
  anecdote:
    "Les cartes anecdotes peuvent être obtenues dans des endroits et face à des ennemis étant en lien avec l'anecdote. Elles font références à des moments cultes vécus pendant le JDR !",
};

const dialog = document.querySelector("dialog");
document.querySelectorAll("label").forEach((label) => {
  if (!labelsDescription[label.htmlFor]) return; // Si le label n'a pas de description

  label.addEventListener("click", () => {
    dialog.innerText = "";
    var text = document.createElement("p");
    text.innerHTML = labelsDescription[label.htmlFor]; // description
    dialog.append(text);
    // Bouton de fermeture
    var closeE = document.createElement("button");
    closeE.id = "close";
    closeE.innerText = "Fermer";
    closeE.addEventListener("click", () => {
      dialog.close();
    });
    dialog.append(closeE);

    // Ouverture en "modal"
    dialog.showModal();
  });
});

// Allow user to close Modal (Dialogue) by clicking outside
dialog.addEventListener("click", (e) => {
  const dialogDimensions = dialog.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    dialog.close();
  }
});

// Toasts

function toastNotification(text, duration = 3000) {
  var x = document.getElementById("toast");
  if (!x.classList.contains("show")) {
    x.classList.add("show");
    x.innerText = text;
    // if(lastElement){ x.append(lastElement)}
    setTimeout(function () {
      x.classList.remove("show");
    }, duration);
  }
}
document.getElementById("toast").addEventListener("click", () => {
  document.getElementById("toast").classList.remove("show");
});
