// JSON Initialisation
var xhReq = new XMLHttpRequest();
var eqptJSON = {};
var enemyJSON = {};
var persosJSON = {};
var allSkills = [];
var playerJSON = {};
var cardJSON = {};

console.log(window.location.href);
if (window.location.href.includes("http")) {
  xhReq.open("GET", "./JDRskills.json" + "?" + new Date().getTime(), false);
  xhReq.send(null);

  enemyJSON = getData("enemy");

  eqptJSON = getData("eqpt");

  persosJSON = getData("persos");

  allSkills = getData("combatS");

  playerJSON = getData("player");

  cardJSON = getData("card");
}

function getData(filename) {
  xhReq.open("GET", "./JDR" + filename + ".json" + "?" + new Date().getTime(), false);
  xhReq.send(null);
  return JSON.parse(xhReq.responseText);
}

// prettier-ignore
const classes = [ "Guerrier", "Chevalier", "Templier", "Chev Dragon", "Voleur", "Assassin", "Danselame", "Samouraï", "Chasseur", "Ingénieur", "Corsaire", "Juge", "Clerc", "Barde", "Shaman", "Sage", "Magicien", "Illusionniste", "Démoniste", "Luminary",];
// prettier-ignore
const iconsClasses = [ "01", "02", "03", "18", "04", "05", "06", "16", "07", "08", "09", "59", "10", "11", "12", "17", "13", "14", "15", "19",];

// ALL SKILLS

// la (les) classe(s), nom, stat utilisée (skillStat), montant [montant,stat,durée], icone,

// Buff : montant, stat (ou carac), durée
// Soin (ou atk) (++ type action "soin" ou "attaque")
//

/*
var skillSoin = {};
skillSoin["nom"] = "Guérison";
skillSoin["classe"] = "Clerc,Barde,Shaman,Sage";
skillSoin["statUsed"] = "intel";
skillSoin["type"] = "soin";
skillSoin["montant"] = "1D10";
skillSoin["montantFixe"] = 6;
skillSoin["icone"] = "E0018";
var buffDPSMag = {};
buffDPSMag["nom"] = "Magic Boost";
buffDPSMag["classe"] = "Magicien,Illusionniste,Démoniste,Luminary";
buffDPSMag["statUsed"] = "intel";
buffDPSMag["type"] = "buff";
buffDPSMag["buffElem"] = "degat";
buffDPSMag["montant"] = "1D6";
buffDPSMag["montantFixe"] = 6;
buffDPSMag["duree"] = 3;
buffDPSMag["icone"] = "E0024";
var buffDPSCac = {};
buffDPSCac["nom"] = "Encouragement";
buffDPSCac["classe"] = "Voleur,Assassin,Danselame,Samouraï";
buffDPSCac["statUsed"] = "esprit";
buffDPSCac["type"] = "buff";
buffDPSCac["buffElem"] = "degat";
buffDPSCac["montant"] = "1D6";
buffDPSCac["montantFixe"] = 6;
buffDPSCac["duree"] = 3;
buffDPSCac["icone"] = "E0008";
var buffDPSDist = {};
buffDPSDist["nom"] = "Instinct Sauvage";
buffDPSDist["classe"] = "Chasseur,Ingénieur,Corsaire,Juge";
buffDPSDist["statUsed"] = "esprit";
buffDPSDist["type"] = "buff";
buffDPSDist["buffElem"] = "degat";
buffDPSDist["montant"] = "1D4";
buffDPSDist["montantFixe"] = 4;
buffDPSDist["duree"] = 4;
buffDPSDist["icone"] = "E0014";
var buffDPSTank = {};
buffDPSTank["nom"] = "Mur de Titan";
buffDPSTank["classe"] = "Guerrier,Chevalier,Templier,Chev Dragon";
buffDPSTank["statUsed"] = "force";
buffDPSTank["type"] = "buff";
buffDPSTank["buffElem"] = "armure";
buffDPSTank["montant"] = "1D4";
buffDPSTank["montantFixe"] = 2;
buffDPSTank["duree"] = 4;
buffDPSTank["icone"] = "E0029";
var allSkills = [skillSoin, buffDPSMag, buffDPSCac, buffDPSDist, buffDPSTank];
*/

console.log(allSkills);

var perso = {};
var enemy = {};

var turn = 0;
var ingame = false;
var indexPlayer;
var joueurData;
var selectedEnemy;

// console.log('Master JSON', masterJSON);
console.log("Enemy JSON", enemyJSON);

// Initialize persos list
Object.entries(persosJSON).forEach(([id, perso]) => {
  console.log(perso, id);
  if (!perso.nom) return;
  var option = document.createElement("option");
  option.value = id;
  option.innerText = perso.nom.slice(0, 11);
  document.querySelector("#selectPerso").append(option);
});

//  Actions Management

const selectPerso = document.querySelector("#selectPerso");

// Load perso if URL parameter
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("perso")) {
    const indexPerso = urlParams.get("perso");

    indexPlayer = Object.entries(playerJSON)
      .map((player) => {
        if (player[1].persos.includes(parseInt(indexPerso))) {
          return player[0];
        }
      })
      .filter((e) => e != undefined)[0];

    if (!cookieCheck()) return;

    joueurData = playerJSON[indexPlayer];
    console.log(joueurData);
    selectPerso.value = urlParams.get("perso") - 1;
    // loadFiche(urlParams.get('perso'));
    // selectedPerso = selectPerso.value;
    var selectedID = selectPerso.selectedIndex;
  }
  loadFiche(selectedID);
  if (urlParams.has("enemy")) {
    selectedEnemy = Object.values(enemyJSON).find((e) => e.nom == urlParams.get("enemy"));
  } else {
    selectedEnemy = chooseEnemy();
    // Math.round(Math.random()*110)
  }
  loadEnemy(selectedEnemy);

  newturn();
});

function cookieCheck() {
  let name = "loadJDRcombat=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    var cookieAllow = false;
    if (c.indexOf(name) == 0) {
      cookieAllow = c.substring(name.length, c.length);
    }
  }

  if (cookieAllow !== "true") {
    toastNotification("Erreur : Lancez un combat à partir d'une quête", 6000);
    endRediction(indexPlayer);
    return false;
  } else {
    console.log("Allowed");
    // Remove permission for next attempt
    document.cookie = "loadJDRcombat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return true;
  }
}

selectPerso.addEventListener("change", (e) => {
  var indexPerso = e.target.selectedIndex;
  loadFiche(indexPerso);
  loadEnemy(chooseEnemy());

  toastNotification("Chargement réussi de " + e.target.value);

  newturn();
});

function loadFiche(indexPerso) {
  document.querySelector(".perso").id = indexPerso;

  var persoData = persosJSON[indexPerso];

  if (!persoData) return;

  perso = new Perso(persoData);

  document.querySelector("#nom").value = perso.nom;

  document.querySelector("#niv").value = perso.niv;
  document.querySelector("#pv").value = perso.pv;
  document.querySelector("#pvmax").value = perso.pvmax;

  document.querySelector("#degat").value = perso.degat;

  document.querySelector("#armure").value = perso.armure;

  document.querySelector("#pp").src = persoData.pp;
  document.querySelector("#force").value = perso.force;
  document.querySelector("#dexté").value = perso.dexté;
  document.querySelector("#intel").value = perso.intel;
  document.querySelector("#charisme").value = perso.charisme;
  document.querySelector("#esprit").value = perso.esprit;

  // Classes du perso
  var classePID = classes.indexOf(perso.classeP);
  var classeSID = classes.indexOf(perso.classeS);

  loadSkills(perso.classeP, perso.classeS);

  document.querySelector(".iconClasses").children[0].src =
    "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[classePID] + ".png";
  document.querySelector(".iconClasses").children[1].src =
    "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[classeSID] + ".png";
}

function loadSkills(c1, c2) {
  Object.entries([...document.querySelectorAll(".skillCombat")]).forEach(([id, skillE]) => {
    var listSkills = allSkills.filter((skill) => skill.classe.includes(c1) || skill.classe.includes(c2));
    if (!listSkills[id]) return;
    skillE.querySelector(".skillName").value = listSkills[id].nom;
    skillE.querySelector(".skillStat").innerText = listSkills[id].statUsed;

    if (listSkills[id].type == "buff") {
      skillE.querySelector(".montant").innerText =
        listSkills[id].type +
        " : " +
        listSkills[id].buffElem +
        " +" +
        listSkills[id].montant +
        "+" +
        listSkills[id].montantFixe +
        ", " +
        listSkills[id].duree +
        " tours";
    } else {
      if (!listSkills[id].montantFixe) {
        skillE.querySelector(".montant").innerText = listSkills[id].type + " : " + listSkills[id].montant;
      } else {
        skillE.querySelector(".montant").innerText =
          listSkills[id].type + " : " + listSkills[id].montant + "+" + listSkills[id].montantFixe;
      }
    }
    skillE.querySelector(".icone").src = "http://voldre.free.fr/Eden/images/skillIcon/" + listSkills[id].icone + ".png";

    skillE.addEventListener("click", () => {
      turnExecution(listSkills[id], skillE);
    });
  });
}

function Perso(persoData) {
  this.nom = persoData.nom;

  this.niv = persoData.niv;
  this.pvmax = this.pv = persoData.pvmax;

  // Calcul des dégâts fixes et de l'armure
  var stuffs = JSON.parse(persoData.eqpts).map((eqptName) => {
    return Object.values(eqptJSON).find((eqpt) => eqpt.nom.toLowerCase().trim() == eqptName.toLowerCase().trim());
  });

  if (!stuffs[0]) {
    toastNotification("Erreur : Le personnage n'est pas apte à se battre.", 8000);
    stop();
  }
  // stuffs = stuffs.filter((s) => s != undefined);

  var montantBouclier, montantArmure, montantArme1, montantArme2, montantAccessDegat, montantAccessArmure;

  // Add 05/11/2023 : Accessories effects (+ Damage or + Armor), according to access specificites
  // console.log(stuffs);
  montantAccessDegat = stuffs
    .map((stuff) => {
      if (!stuff) return 0;
      if (!!stuff.access && stuff.access[0] == "D") {
        return parseInt(stuff.access[1]);
      }
      return 0;
    })
    .reduce((a, b) => a + b);

  montantAccessArmure = stuffs
    .map((stuff) => {
      if (!stuff) return 0;
      if (!!stuff.access && stuff.access[0] == "A") {
        return parseInt(stuff.access[1]);
      }
      return 0;
    })
    .reduce((a, b) => a + b);

  console.log("Access effets (D, A) : ", montantAccessDegat, montantAccessArmure);

  stuffs[1] = stuffs[1] || { nom: "", montant: "Dégât +0" };
  if (stuffs[1].nom.includes("Bouclier")) {
    montantBouclier = stuffs[1].montant.split("Dégât -")[1].split(",")[0].split(" ")[0];
    stuffs[1] = { montant: "Dégât +0" };
  } else {
    montantBouclier = 0;
  }

  montantArme1 = stuffs[0].montant.split("Dégât +")[1].split(",")[0].split(" ")[0];
  montantArme2 = stuffs[1].montant.split("Dégât +")[1].split(",")[0].split(" ")[0];

  // Bonus de dégât par niveau
  this.degat = Math.round(
    (parseInt(montantArme1) + parseInt(montantArme2)) * Math.pow(1.1, this.niv) + montantAccessDegat
  );

  montantArmure = stuffs[3].montant.split("Dégât -")[1].split(",")[0].split(" ")[0];

  // Bonus d'armure par niveau
  this.armure = Math.round(
    (parseInt(montantBouclier) + parseInt(montantArmure)) * Math.pow(1.1, this.niv) + montantAccessArmure
  );

  // ---

  this.force = persoData.force + persoData.forceB.replace(/[^\d.+-]/g, "");
  this.dexté = persoData.dexté + persoData.dextéB.replace(/[^\d.+-]/g, "");
  this.intel = persoData.intel + persoData.intelB.replace(/[^\d.+-]/g, "");
  this.charisme = persoData.charisme + persoData.charismeB.replace(/[^\d.+-]/g, "");
  this.esprit = persoData.esprit + persoData.espritB.replace(/[^\d.+-]/g, "");

  this.force = eval(this.force).toString().slice(0, 2);
  this.dexté = eval(this.dexté).toString().slice(0, 2);
  this.intel = eval(this.intel).toString().slice(0, 2);
  this.charisme = eval(this.charisme).toString().slice(0, 2);
  this.esprit = eval(this.esprit).toString().slice(0, 2);

  // Classes du perso
  this.classeP = persoData.classeP;
  this.classeS = persoData.classeS;
}

function loadEnemy(enemyData) {
  ingame = true;
  turn = 0;

  // Useless with new chooseEnemy() function
  // document.querySelector(".enemies").id = indexEnemy;
  // var enemyData = enemyJSON[indexEnemy];

  if (!enemyData) return;

  enemy = new Enemy(enemyData);

  document.querySelector("#enom").value = enemy.nom;

  document.querySelector("#epv").value = enemy.pvmax;
  document.querySelector("#epvmax").value = enemy.pvmax;

  document.querySelector("#epp").src = "http://voldre.free.fr/Eden/images/monsters/" + enemyData.visuel3D + ".png";
  document.querySelector("#epp").alt = enemyData.visuel3D;

  document.querySelector("#desc").innerText = enemyData.desc;

  document.querySelector("#edegat").value = enemy.degat;
}

function Enemy(enemyData) {
  this.nom = enemyData.nom;

  this.pvmax = this.pv = enemyData.pvmax;

  var enemyStats = enemyData.stats.split(",");
  this.force = parseInt(enemyStats[0]);
  this.dexté = parseInt(enemyStats[1]);
  this.intel = parseInt(enemyStats[2]);
  this.charisme = parseInt(enemyStats[3]);
  this.esprit = parseInt(enemyStats[4]);

  // Calcul des dégâts fixes
  var rawMontantSkills = enemyData.skills.map((skill) => {
    // console.log(skill)
    // remove all buff skills and passif
    if (
      skill.toLowerCase().includes("passif") ||
      skill.toLowerCase().includes("esprit") ||
      skill.toLowerCase().includes("soin")
    )
      return NaN;

    var allPlusPosition = [];
    for (var i = 0; i < skill.length; i++) {
      if (skill[i] === "+") allPlusPosition.push(i);
    }
    // console.log(allPlusPosition)

    if (allPlusPosition == []) return NaN;

    var amount = [];

    allPlusPosition.forEach((plusPosition) => {
      // console.log(skill[plusPosition+1], skill)
      if (parseInt(skill[plusPosition + 1]) > 0) {
        // console.log(skill[plusPosition+1],skill[plusPosition+2])
        amount.push(parseInt(skill[plusPosition + 1] + skill[plusPosition + 2]));
      }
    });

    // console.log(amount)
    var average = amount.reduce((a, b) => a + b, 0) / amount.length;
    // console.log(average)

    // In average, add Dices
    var dices = dicesAverageConversion(skill);

    return average + dices;
  });

  var montantSkills = rawMontantSkills.filter(function (value) {
    return !Number.isNaN(value);
  });

  // console.log(montantSkills)

  // Pour les ennemis, sachant que des sorts sont mal comptés (ex 1D8 +1D6 +4)
  // Je rajoute 50% de dégâts (contre 10% par niveau pour les joueurs), que 50% pas 100% car les des (1D10,2D6,...) sont comptés !
  this.degat = Math.round((montantSkills.reduce((a, b) => a + b, 0) / montantSkills.length) * 1.5);
  // console.log(this.degat)
}

var enemyGenerated = Object.values(enemyJSON).map((enemy) => {
  return new Enemy(enemy);
});
console.log(enemyGenerated);

function chooseEnemy(category = null) {
  // prettier-ignore
  const forbidden = ["71","82","85","101","104","109","118","121"];
  // console.log(forbidden.map(f => enemyJSON[f]))

  // prettier-ignore
  const boss = ["24","29","45","46","50","54","56","57","59","61","62","67","70","71","74","75","76","77","80","82","84","85","89","90","101","106","109","111","113","114","115","116","117","118","121","122"];

  var enemyList = [];

  if (!category) {
    enemyList = { ...enemyJSON };
    forbidden.forEach((enemyF) => {
      delete enemyList[enemyF];
    });
  } else if (category == "boss") {
    enemyList = { ...enemyJSON };
    enemyList = Object.keys(enemyList).filter((enemy) => boss.includes(enemy));

    forbidden.forEach((enemyF) => {
      enemyList = enemyList.filter((enemy) => enemy != enemyF);
    });
  }

  var randomEnemy = Math.floor(Math.random() * Object.keys(enemyList).length);
  // console.log(randomEnemy,enemyList)
  if (!category) {
    // console.log(enemyList[randomEnemy])
    // console.log(Object.entries(enemyJSON).find(e => e[1] == enemyList[randomEnemy])[0]);

    // Reset index
    enemyList = format(enemyList);
  }

  console.log(enemyList, randomEnemy);
  return enemyList[randomEnemy];
}

function format(object) {
  var items = {};

  var i = 0;
  for (var index in object) {
    items[i] = object[index];
    i++;
  }
  return items;
}

function dicesAverageConversion(skill) {
  var dices = 0;
  if (skill.includes("1D12")) {
    dices += 6.5;
  }
  if (skill.includes("1D10")) {
    dices += 5.5;
  }
  if (skill.includes("2D10")) {
    dices += 11;
  }
  if (skill.includes("3D10")) {
    dices += 16;
  }
  if (skill.includes("1D8")) {
    dices += 4.5;
  }
  if (skill.includes("2D8")) {
    dices += 9;
  }
  if (skill.includes("1D6")) {
    dices += 3.5;
  }
  if (skill.includes("2D6")) {
    dices += 7;
  }
  if (skill.includes("3D6")) {
    dices += 10;
  }
  if (skill.includes("1D4")) {
    dices += 2.5;
  }
  return dices;
}

function dicesConversion(skill) {
  var dices = 0;
  if (skill.includes("1D12")) {
    dices += Math.floor(Math.random() * 12 + 1);
  }
  if (skill.includes("1D10")) {
    dices += Math.floor(Math.random() * 10 + 1);
  }
  if (skill.includes("2D10")) {
    dices += Math.floor(Math.random() * 10 + 1) + Math.floor(Math.random() * 10 + 1);
  }
  if (skill.includes("3D10")) {
    dices += Math.floor(Math.random() * 10 + 1) * 2 + Math.floor(Math.random() * 10 + 1);
  }
  if (skill.includes("1D8")) {
    dices += Math.floor(Math.random() * 8 + 1);
  }
  if (skill.includes("2D8")) {
    dices += Math.floor(Math.random() * 8 + 1) + Math.floor(Math.random() * 8 + 1);
  }
  if (skill.includes("1D6")) {
    dices += Math.floor(Math.random() * 6 + 1);
  }
  if (skill.includes("2D6")) {
    dices += Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
  }
  if (skill.includes("3D6")) {
    dices += Math.floor(Math.random() * 6 + 1) * 2 + Math.floor(Math.random() * 6 + 1);
  }
  if (skill.includes("1D4")) {
    dices += Math.floor(Math.random() * 4 + 1);
  }
  return dices;
}

// FIGHT

function newturn() {
  isEnded();

  turn++;
  document.querySelector("#turn").innerText = turn;
  toastNotification("Tour n°" + turn + ", choisissez une action");
  document.querySelector("#instruction").innerText = "Choisissez une action";

  unlockInputs(true);

  updateBuff();
}

function isEnded() {
  if (ingame) {
    if (document.querySelector("#epv").value <= 0) {
      toastNotification("Victoire !");
      document.querySelector("#instruction").innerText = "Victoire !";
      updateDesc("Vous avez vaincu " + enemy.nom);
      ingame = false;

      // Victory
      if (joueurData) {
        victory();
        toastNotification("Sauvegarde effectuée, redirection ...", 6000);
      } else {
        toastNotification("Pas de joueur détecté", 6000);
      }
    } else if (document.querySelector("#pv").value <= 0) {
      toastNotification("Défaite");
      document.querySelector("#instruction").innerText = "Défaite";
      updateDesc("Vous avez perdu contre " + enemy.nom);
      ingame = false;

      // Defeat
      if (joueurData) {
        savePlayer(joueurData);
        toastNotification("Sauvegarde effectuée, redirection ...", 6000);
      } else {
        toastNotification("Pas de joueur détecté", 6000);
      }
    }
  }

  if (!ingame) {
    endRediction(indexPlayer);
  }
}

function victory() {
  var enemyRarity;
  if (selectedEnemy.pvmax >= 200) {
    enemyRarity = Math.trunc(selectedEnemy.pvmax / 100) + 1;
  } else if (selectedEnemy.pvmax >= 125) {
    enemyRarity = 2;
  } else {
    enemyRarity = 1;
  }

  const cardRarity = Math.min(enemyRarity, 3);

  var newJoueurData = { ...joueurData };
  var winCards = [];

  // Map card
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("map")) {
    const mapCard = cardJSON.find(
      (card) => card.kind === "map" && card.kindId === parseInt(urlParams.get("map")) && card.value === cardRarity
    );
    newJoueurData.cards = addCard(newJoueurData.cards, mapCard);
    mapCard ? winCards.push(mapCard) : null;
  }
  // Boss card
  if (cardRarity == 3) {
    const bossCard = cardJSON.find(
      (card) => card.kind === "boss" && card.kindId.toLowerCase() === selectedEnemy.visuel3D.toLowerCase()
    );
    newJoueurData.cards = addCard(newJoueurData.cards, bossCard);
    bossCard ? winCards.push(bossCard) : null;
  }

  // Compo card
  const cardsCompo = cardJSON.filter((card) => card.kind === "composant");
  const compoCardID = Math.floor(Math.random() * cardsCompo.length);
  const compoCard = cardsCompo[compoCardID];
  newJoueurData.cards = addCard(newJoueurData.cards, compoCard);
  compoCard ? winCards.push(compoCard) : null;

  // Anecdote card

  // Coins
  newJoueurData.alpagaCoin = addCoins(newJoueurData.alpagaCoin, winCards, enemyRarity);

  // Show rewards (cards)
  showCardsAndCoins(joueurData, winCards, newJoueurData.alpagaCoin);

  // Update player data

  savePlayer(newJoueurData);
}

function savePlayer(newJoueurData) {
  const urlParams = new URLSearchParams(window.location.search);

  if (!urlParams.has("perso")) return;

  const indexPerso = urlParams.get("perso");

  const persoIDforPlayer = joueurData.persos.indexOf(parseInt(indexPerso));

  newJoueurData.entries[persoIDforPlayer] -= 1;

  var newPlayer = {};
  newPlayer[indexPlayer] = newJoueurData;
  console.log(newPlayer);

  const newPersoEncoded = JSON.stringify(newPlayer).replaceAll("+", "%2B").replaceAll(";", "%3B");
  // encodeURIComponent(JSON.stringify(newPerso))
  const cookiePerso = "playerJSON=" + newPersoEncoded + "; SameSite=Strict";

  document.cookie = cookiePerso;
  saveWithPHP("player");
  console.log("saveFiche() done : JDRsaveFile.php executed");
}

function addCard(joueurDataCards, card) {
  if (card && !joueurDataCards.includes(card.id)) joueurDataCards.push(card.id);
  return joueurDataCards;
}
function addCoins(alpagaCoin, winCards, enemyRarity) {
  const cardsValue =
    winCards?.map((card) => (card ? card.value : 0))?.reduce((acc, value) => acc + value) || enemyRarity;
  return alpagaCoin + cardsValue + Math.max(enemyRarity - 3, 0);
}

function showCardsAndCoins(joueurData, winCards, newCoins) {
  console.log("Earned : " + (newCoins - joueurData.alpagaCoin).toString() + ", New sold : " + newCoins.toString());
  console.log(winCards.map((card) => card?.name));
  winCards.forEach((card) => {
    if (!joueurData.cards.includes(card.id)) {
      console.log(card.name + " is a new Card !");
    }
  });

  const dialog = document.querySelector("dialog");
  document.querySelector("#coins").innerText = (newCoins - joueurData.alpagaCoin).toString();

  const cardsE = document.querySelector("#cards");

  winCards.forEach((card) => {
    const li = document.createElement("li");
    li.innerText = card.name;

    if (!joueurData.cards.includes(card.id)) {
      li.style.color = "gold";
      // li.innerText += " (New !)";
    }

    const div = document.createElement("div");
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

    div.append(li);
    div.append(imgCardE);
    cardsE.append(div);
  });

  // Ouverture en "modal"
  dialog.showModal();
}

function endRediction(indexPlayer) {
  setTimeout(() => {
    window.location.href = "jdr_profil.html?joueur=" + indexPlayer;
  }, 6000);
  return;
}

function saveWithPHP(nameJSON) {
  // eslint-disable-next-line no-undef
  $.ajax({
    url: "JDRsaveFile.php",
    type: "post",
    data: { name: nameJSON },
    /*
    success: function (data) {
      $("body").html(data);
    },*/
  });
}

// Dice

function rollDice(user, type, statName) {
  var duration = 500; // in ms

  var result;
  var section;
  if (user == perso) {
    section = document.querySelector(".playerAction");
  } else {
    section = document.querySelector(".enemyAction");
  }

  var stat = user[statName];
  // console.log(user,statName,stat)

  var dice = section.querySelector(".dice");

  var success;

  // Stat name section + Success amount
  console.log(stat, type);
  if (type == "attaque" || type == "skill" || type == "soin" || type == "buff") {
    section.querySelector(".statName").innerText = statName;
    success = stat;
  } else {
    section.querySelector(".statName").innerText = statName + "/2";
    success = Math.ceil(stat / 2);
    console.log(success);
  }

  // Result
  var diceValue = Math.round(Math.random() * 19 + 1);

  if (diceValue > success) {
    result = "fail";
    if (diceValue == 20) {
      result = "crit fail";
    }
  } else {
    result = "success";
    if (diceValue == 1) {
      result = "crit success";
    }
  }

  // Display result

  if (!dice.classList.contains("show")) {
    dice.classList.add("show");
    setTimeout(function () {
      dice.classList.remove("show");
      dice.innerText = diceValue;

      if (result == "fail") {
        dice.style.filter = "drop-shadow(1px 1px 10px darkred)";
      }
      if (result == "crit fail") {
        dice.style.filter = "drop-shadow(1px 1px 15px red)";
      }
      if (result == "success") {
        dice.style.filter = "drop-shadow(1px 1px 10px green)";
      }
      if (result == "crit success") {
        dice.style.filter = "drop-shadow(1px 1px 15px yellow)";
      }
    }, duration);
  }

  return result;
}

function resetDices() {
  [...document.querySelectorAll(".dice")].forEach((dice) => {
    dice.style.filter = "";
    dice.innerText = "";
  });
  [...document.querySelectorAll(".instruction")].forEach((desc) => {
    desc.innerText = "";
  });
  updateDesc("");
}

// Skills and stats buttons
const skillsButton = [...document.querySelectorAll(".skillCombat")].map((skillE) => skillE.children[0]);

const statsButton = ["bforce", "bdexté", "bintel"]; //,"bcharisme","besprit"];
statsButton.forEach((buttonStat) => {
  var statName = buttonStat.slice(1);
  document.querySelector("#" + buttonStat).addEventListener("click", () => {
    turnExecution({
      type: "attaque",
      montant: "Dégât +1D10",
      statUsed: statName,
    });
  });
});

// *** Turn execution ***

function turnExecution(persoSkill, skillE = null) {
  if (!ingame) {
    toastNotification("Le combat est terminé");
    return;
  }

  // Déroulement du tour
  unlockInputs(false);

  executeAction(perso, persoSkill);

  setTimeout(function () {
    enemyTurn(enemy);
  }, 3000);

  setTimeout(function () {
    newturn();
    // Add 05/11/2023 : Can't use same skill 2 times
    if (skillE) skillE.querySelector(".skillName").disabled = true;
  }, 6000);
}

// Enemy Turn

function enemyTurn(enemy) {
  isEnded();

  if (!ingame) {
    toastNotification("Le combat est terminé");
    return;
  }

  toastNotification("Au tour de l'ennemi...");
  document.querySelector("#instruction").innerText = "Au tour de l'ennemi...";

  // CHOIX DE STAT : Stat choisi par l'ennemi : que l'une des 2 meilleures
  var stats = { force: enemy.force, dexté: enemy.dexté, intel: enemy.intel };
  var minStat = Object.keys(stats).reduce((key, v) => (stats[v] < stats[key] ? v : key));

  delete stats[minStat];
  var sumStatsATK = Object.values(stats)[0] + Object.values(stats)[1];

  // enemy.force+enemy.dexté+enemy.intel;
  var randValue = Math.round(Math.random() * sumStatsATK);

  var statName;
  if (randValue < Object.values(stats)[0]) {
    statName = Object.keys(stats)[0];
  } else {
    statName = Object.keys(stats)[1];
  }

  // if(randValue < enemy.force){
  //   statName = "force";
  // }else if(randValue < enemy.force + enemy.dexté){
  //   statName = "dexté";
  // }else{ statName = "intel"; }

  executeAction(enemy, {
    type: "attaque",
    montant: "Dégât +1D10",
    statUsed: statName,
  });
}

function executeAction(user, userSkill) {
  console.log(userSkill);
  var type = userSkill.type;
  var statName = userSkill.statUsed;

  resetDices();

  var opponent;
  if (user == perso) {
    opponent = enemy;
  } else {
    opponent = perso;
  }

  var userResult = rollDice(user, type, statName);
  var montant;

  // Montant des dégâts
  if (userResult == "crit success") {
    montant = dicesAverageConversion(userSkill.montant) * 2 + (userSkill.montantFixe || 0);
    console.log(montant);
  } else if (userResult == "success") {
    montant = dicesConversion(userSkill.montant) + (userSkill.montantFixe || 0);
    // console.log(montant);
  }

  console.log("montant : ", montant);

  if (type == "attaque") {
    if (userResult == "crit success") {
      hit(opponent, user.degat + montant);
      updateDesc("Touché critique !");
    } else if (userResult == "success") {
      setTimeout(function () {
        var opponentResult = rollDice(opponent, "defense", statName);
        if (opponentResult == "fail") {
          updateDesc("Touché !");
          hit(opponent, user.degat + montant);
        } else if (opponentResult == "crit fail") {
          hit(opponent, user.degat + 5 + montant);
          updateDesc("Touché !");
        } else {
          updateDesc("Bloqué / Esquivé");
        }
      }, 1500);
    }
  } else if (type == "soin") {
    if (userResult == "crit success") {
      heal(user, user.degat + montant);
      updateDesc("Soin critique !");
    } else if (userResult == "success") {
      heal(user, user.degat + montant);
      updateDesc("Soin !");
    }
  } else if (type == "buff") {
    if (userResult == "crit success") {
      buff(userSkill, montant);
      updateDesc("Buff critique !");
    } else if (userResult == "success") {
      buff(userSkill, montant);
      updateDesc("Buff !");
    }
  }

  if (userResult == "fail") {
    updateDesc("Echec");
  } else if (userResult == "crit fail") {
    hit(user, Math.trunc(user.degat / 2) + (user.armure || 0));
    updateDesc("Echec critique");
  }
}

function hit(user, amount) {
  var damage = amount - (user.armure || 0);
  if (damage > 0) {
    // Si <0 == Big armure, mal chance, etc... donc 0 mais ça ne soigne pas
    user.pv -= damage;
  }
  if (user == perso) {
    document.querySelector("#pv").value = user.pv;
  } else {
    document.querySelector("#epv").value = user.pv;
  }
}

function heal(user, amount) {
  user.pv = Math.min(user.pvmax, parseInt(user.pv) + amount);

  // min() permet de gérer si les PV soignés sont > aux PV max
  document.querySelector("#pv").value = user.pv;
}

function buff(userSkill, amount) {
  [...document.querySelectorAll(".buff")].every((buffE) => {
    if (buffE.id == userSkill.nom) {
      // if already applied, update buff time
      buffE.querySelector(".duree").children[0].innerText = userSkill.duree + 1; // +1 car tour actuel à ne pas compter !
      buffE.querySelector(".duree").children[1].innerText = userSkill.duree;
      return false;
    }

    if (buffE.querySelector(".duree").children[0].innerText != "") return true;

    buffE.querySelector(".duree").children[0].innerText = userSkill.duree + 1; // +1 car tour actuel à ne pas compter !
    buffE.querySelector(".duree").children[1].innerText = userSkill.duree;
    buffE.querySelector(".montant").innerText = amount;
    buffE.querySelector(".icone").src = "http://voldre.free.fr/Eden/images/skillIcon/" + userSkill.icone + ".png";

    buffE.querySelector(".icone").title = userSkill.buffElem.toString();

    buffE.id = userSkill.nom;

    if (userSkill.buffElem.includes("/tour")) {
      userSkill.buffElem = userSkill.buffElem.replace("/tour", "");
    }

    userSkill.buffElem.forEach((bE) => {
      perso[bE] = parseInt(perso[bE]) + amount;
      document.querySelector("#" + bE).value = perso[bE];
    });

    return false;
  });
}

function updateDesc(desc) {
  setTimeout(() => {
    document.querySelector("#actionDescription").innerText = desc;
  }, 1000);
}

function unlockInputs(bool) {
  statsButton.forEach((buttonStat) => {
    document.querySelector("#" + buttonStat).disabled = !bool;
  });
  skillsButton.forEach((buttonSkill) => {
    buttonSkill.disabled = !bool;
  });
}

function updateBuff() {
  [...document.querySelectorAll(".buff")].forEach((buffE) => {
    var dureeE = buffE.querySelector(".duree");
    var buffElem = buffE.querySelector(".icone").title.split(",");

    if (dureeE.children[0].innerText == "") return;

    if (dureeE.children[0].innerText != "1") {
      dureeE.children[0].innerText = parseInt(dureeE.children[0].innerText) - 1;

      // If buff per turn (ex : Euphorie), apply buff
      if (buffE.querySelector(".icone").title.includes("/tour")) {
        buffElem = buffElem[0].replace("/tour", "");
        perso[buffElem] += parseInt(buffE.querySelector(".montant").innerText);
        document.querySelector("#" + buffElem).value = perso[buffElem];
      }
      // Else, if last turn
    } else {
      if (buffE.querySelector(".icone").title.includes("/tour")) {
        // If buff each turn, we remove the whole buff (amount * duration)
        buffElem = buffElem[0].replace("/tour", "");
        perso[buffElem] -=
          parseInt(buffE.querySelector(".montant").innerText) * (parseInt(dureeE.children[1].innerText) + 1);
        document.querySelector("#" + buffElem).value = perso[buffElem];
      } else {
        buffElem.forEach((bE) => {
          perso[bE] -= parseInt(buffE.querySelector(".montant").innerText);
          document.querySelector("#" + bE).value = perso[bE];
        });
      }

      dureeE.children[0].innerText = "";
      dureeE.children[1].innerText = "";

      buffE.querySelector(".montant").innerText = "";
      buffE.querySelector(".icone").src = "";
      buffE.querySelector(".icone").title = "";
      buffE.id = "";
    }

    return false;
  });
}

// Modal (Dialog) des informations de bases des labels

var labelsDescription = {
  niv: "Augmente automatiquement tous les 100 points d'expériences du Niveau 1 à 5, puis tous les 150.<br/> Tous les niveaux paire (2,4,6,8), vous obtenez une compétence.<br/> Au Niveau 5 vous avez +1 en Esprit.<br/> Au Niveau 10, c'est +1 où vous voulez.",
  pv: "Statistique des PV, augmente de 5 par niveau.",
  degat:
    "Les dégâts sont calculés en faisant la somme du montant des 2 premières armes. Puis +10% par niveau. Ex : Armes : 4+5, niveau 6 : 9*1.1^6 = 16<br/> Chaque coup est additionné de 1D10 de dégâts.",
  armure:
    "L'armure vaut le montant de l'armure (dégât reçu -x). Puis +10% par niveau. Ex : Armure : 4, niveau 6 : 9*1.1^6 = 7",
  //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
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
// dialog.show() // Opens a non-modal dialog

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
