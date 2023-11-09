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

  const joueurData = playerJSON[player];

  if (!joueurData) return;

  console.log(joueurData);
  document.querySelector(".alpagaCoin").innerText = joueurData.alpagaCoin;
  document.querySelector(".alpagaCoinSpent").innerText = " (" + joueurData.alpagaCoinSpent + ")";

  const persosData = joueurData.persos.map((idPerso) => {
    return persosJSON[idPerso - 1]; // Error, index -1
  });

  if (!persosData) return;

  persosE.forEach((e) => e.classList.add("hide"));

  persosData.forEach((perso, index) => {
    loadPerso(perso, index);
  });

  loadCards(joueurData);
  countCards(joueurData);
}

function loadPerso(perso, index) {
  // console.log(perso, index);
  const persoE = persosE[index];

  persoE.querySelector("#nom").value = perso.nom;
  persoE.querySelector("#niv").value = perso.niv;
  persoE.querySelector(".persoPic").src = perso.pp;
  persoE.querySelector(".persoPic").addEventListener("click", () => {
    document.querySelector("#worldmap").classList.add("active");
    indexPerso = Object.entries(persosJSON).find((p) => p[1] === perso)[0];
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
