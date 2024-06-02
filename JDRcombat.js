import { cardJSON, persosJSON, enemyJSON, allSkills, playerJSON, getData } from "./JDRstore";
import { callPHP, dateToString, initDialog, isTextInText, Perso, sum, toastNotification } from "./utils";

// prettier-ignore
const classes = [ "Guerrier", "Chevalier", "Templier", "Chev Dragon", "Voleur", "Assassin", "Danselame", "Samouraï", "Chasseur", "Ingénieur", "Corsaire", "Juge", "Clerc", "Barde", "Shaman", "Sage", "Magicien", "Illusionniste", "Démoniste", "Luminary",];
// prettier-ignore
const iconsClasses = [ "01", "02", "03", "18", "04", "05", "06", "16", "07", "08", "09", "59", "10", "11", "12", "17", "13", "14", "15", "19",];

console.log(allSkills);

var perso = {};
var enemy = {};

var turn = 0;
var ingame = false;
var indexPlayer;
var joueurData;
var selectedEnemy;
var currentPersoEntries;
const turnToCheck = 6 + Math.floor(Math.random() * 3);

const MIN_COMMON = 15;
const MAX_COMMON = 29;
const MIN_ELITE = 26;
// Average Elite = 32,5
const MAX_ELITE = 39;
const MIN_BOSS = 28;
const MAX_BOSS = 52; // 49... + out of limite (+3)

var indexPerso;
var nomPerso;
var logID;

let mapID;
let enemyRarity;
let cardRarity;

// Initialize persos list
Object.entries(persosJSON).forEach(([id, perso]) => {
  if (!perso.nom) return;
  var option = document.createElement("option");
  option.value = id;
  option.innerText = perso.nom.slice(0, 11);
  document.querySelector("#selectPerso").append(option);
});

//  Actions Management
// const selectPerso = document.querySelector("#selectPerso");

// Load perso if URL parameter
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("perso")) {
    // Init parameters
    mapID = parseInt(urlParams.get("map"));

    // Init Perso
    indexPerso = urlParams.get("perso");
    nomPerso = persosJSON[indexPerso - 1].nom;

    indexPlayer = Object.entries(playerJSON)
      .map((player) => {
        if (player[1].persos.includes(parseInt(indexPerso))) {
          return player[0];
        }
      })
      .filter((e) => e != undefined)[0];

    if (!cookieCheck()) return;

    joueurData = playerJSON[indexPlayer];

    // Update to get current perso entries
    const persoIDforPlayer = joueurData.persos.indexOf(parseInt(indexPerso));
    currentPersoEntries = joueurData.entries[persoIDforPlayer];

    // 29/11/23 : Add check of entries at the beginning of the fight (here)
    if (currentPersoEntries <= 0) {
      toastNotification("Erreur : Le personnage a déjà consommé toutes ses entrées.", 6000, true);
      endRediction();
      return;
    }

    loadFiche(urlParams.get("perso") - 1);

    // 30/01/24 : Short security to handle abberation (like Nyx with more than 1 billion damage)
    if (perso.degat > 75 || perso.armure > 50 || perso.pvmax > 275) {
      toastNotification("Erreur : Le personnage a des statistiques hors-norme.", 6000, true);
      endRediction();
      return;
    }

    // 27/04/24 : New logs : cheat log to handle potential cheat !
    const sumStats =
      parseInt(perso.force) +
      parseInt(perso.dexté) +
      parseInt(perso.intel) +
      parseInt(perso.charisme) +
      parseInt(perso.esprit);

    if (perso.degat > 52 || perso.armure > 35 || perso.pvmax > 200 || sumStats > 72) {
      console.log("new C log...");
      saveCheat(urlParams.get("enemy"));
    }

    // selectPerso.value = urlParams.get("perso") - 1;
    // selectedPerso = selectPerso.value;
    // var selectedID = selectPerso.selectedIndex;
  } else {
    // Not in real fight
    const enemyCombatData = Object.values(enemyJSON).map((e) => {
      let enemyStats = new Enemy(e);
      enemyStats.rarity = enemyStats.pvmax >= 200 ? "BOSS" : enemyStats.pvmax > 120 ? "ELITE" : "COMMUN";
      enemyStats.degatMin =
        (enemyStats.rarity === "BOSS" && enemyStats.degat < MIN_BOSS) ||
        (enemyStats.rarity === "COMMUN" && enemyStats.degat < MIN_COMMON);
      enemyStats.degatMax =
        (enemyStats.rarity === "BOSS" && enemyStats.degat > MAX_BOSS) ||
        (enemyStats.rarity === "COMMUN" && enemyStats.degat > MAX_COMMON);

      return enemyStats;
    });
    console.log(
      "Stats & Degats de tous les ennemis :",
      enemyCombatData,
      "> JSON.stringify() > copy all (...) > JSON to Excel"
    );
  }

  // Init Enemy

  if (urlParams.has("enemy")) {
    selectedEnemy = Object.values(enemyJSON).find((e) => e.nom == urlParams.get("enemy"));
  } else {
    selectedEnemy = chooseEnemy();
    // Math.round(Math.random()*110)
  }
  loadEnemy(selectedEnemy, urlParams.has("isElite"));

  if (selectedEnemy.pvmax >= 200) {
    enemyRarity = Math.trunc(selectedEnemy.pvmax / 100) + 1;
  } else if (selectedEnemy.pvmax > 120) {
    enemyRarity = 2;
  } else {
    enemyRarity = 1;
    // Handle enemy with "elite mode"
    enemyRarity += urlParams.has("isElite");
  }
  cardRarity = Math.min(enemyRarity, 3);

  // First turn
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
    toastNotification("Erreur : Lancez un combat à partir d'une quête", 6000, true);
    endRediction();
    return false;
  } else {
    console.log("Allowed");
    // Remove permission for next attempt
    document.cookie = "loadJDRcombat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return true;
  }
}

// selectPerso.addEventListener("change", (e) => {
//   var indexPerso = e.target.selectedIndex;
//   loadFiche(indexPerso);
//   loadEnemy(chooseEnemy());

//   toastNotification("Chargement réussi de " + e.target.value);

//   newturn();
// });

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
  document.querySelector("#resForce").innerText = "Bloc +" + perso.forceRes;
  document.querySelector("#dexté").value = perso.dexté;
  document.querySelector("#resDexté").innerText = "Esq +" + perso.dextéRes;
  document.querySelector("#intel").value = perso.intel;
  document.querySelector("#resIntel").innerText = "Bloc +" + perso.intelRes;
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
    const listSkills = allSkills.filter((skill) => skill.classe.includes(c1) || skill.classe.includes(c2));
    if (!listSkills[id]) return;
    skillE.querySelector(".skillName").value = listSkills[id].nom;
    skillE.querySelector(".skillStat").innerText = listSkills[id].statUsed;

    if (listSkills[id].type == "buff") {
      skillE.querySelector(".montant").innerText =
        listSkills[id].type +
        " : " +
        listSkills[id].buffElem +
        " +" +
        `${listSkills[id].montant ? listSkills[id].montant + "+" : ""}` +
        listSkills[id].montantFixe +
        ", " +
        listSkills[id].duree +
        " tours";
      skillE.querySelector(".montant").innerText = skillE.querySelector(".montant").innerText.replaceAll(",", ", ");
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
      // Bug fix Victorine 26/11/2023 : check if button disabled
      // Because the Event Listener is the whole skill Element, not only the button
      if (!skillE.querySelector(".skillName").disabled) turnExecution(listSkills[id], skillE);
    });
  });
}

function loadEnemy(enemyData, isElite = false) {
  ingame = true;
  turn = 0;

  // Useless with new chooseEnemy() function
  // document.querySelector(".enemies").id = indexEnemy;
  // var enemyData = enemyJSON[indexEnemy];

  if (!enemyData) return;

  enemy = new Enemy(enemyData);

  // Apply "isElite" only if not an elite or a boss
  if (isElite && enemy.pvmax <= 120) {
    enemy.nom += " (ELITE)";
    // Value clipped between min and max
    enemy.pvmax = enemy.pv = Math.round(Math.max(130, Math.min(enemy.pvmax * 1.5, 180)));
    enemy.degat = Math.max(MIN_ELITE, Math.min(Math.round(enemy.degat * 1.1) + 5, MAX_ELITE));
  }

  document.querySelector("#enom").value = enemy.nom;

  document.querySelector("#epv").value = enemy.pvmax;
  document.querySelector("#epvmax").value = enemy.pvmax;
  document.querySelector(".lifebar").style.width = `${enemy.pvmax}px`;

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
    if (["passif", "esprit", "soin", "buff", "provocation"].find((text) => isTextInText(skill, text))) return NaN;

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
    var average = amount.reduce(sum, 0) / amount.length;
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
  this.degat = Math.round((montantSkills.reduce(sum, 0) / montantSkills.length) * 1.5);
  // console.log(this.degat)
}

// var enemyGenerated = Object.values(enemyJSON).map((enemy) => {
//   return new Enemy(enemy);
// });
// console.log(enemyGenerated);

function chooseEnemy(category = null) {
  // prettier-ignore
  const forbidden = ["82","85","101","104","109"];
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
  if (!category) {
    // Reset index
    enemyList = resetIndex(enemyList);
  }

  // console.log(enemyList, randomEnemy);
  return enemyList[randomEnemy];
}

function resetIndex(object) {
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
    dices += 16.5;
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
    dices += 10.5;
  }
  if (skill.includes("4D6")) {
    dices += 14;
  }
  if (skill.includes("5D6")) {
    dices += 17.5;
  }
  if (skill.includes("6D6")) {
    dices += 21;
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
  if (skill.includes("4D6")) {
    dices += Math.floor(Math.random() * 6 + 1) * 3 + Math.floor(Math.random() * 6 + 1);
  }
  if (skill.includes("5D6")) {
    dices += Math.floor(Math.random() * 6 + 1) * 4 + Math.floor(Math.random() * 6 + 1);
  }
  if (skill.includes("6D6")) {
    dices += Math.floor(Math.random() * 6 + 1) * 5 + Math.floor(Math.random() * 6 + 1);
  }
  if (skill.includes("1D4")) {
    dices += Math.floor(Math.random() * 4 + 1);
  }
  return dices;
}

// FIGHT

function newturn() {
  // Correcting inExecution
  inExecution = false;
  isEnded();

  turn++;
  document.querySelector("#turn").innerText = turn;

  // Update 26/11/23 : Pour éviter la triche de "j'enregistre que si j'ai gagné"
  // J'ai décidé de consommer l'entrée du personnage (en sauvegardant) à partir de 6 à 8 tours de combat
  // 6-8 tours représente un engagement "Je réalise le combat jusqu'au bout"

  // Bug Fix 28/11/23 : Ajout condition "ingame". Car si on a déjà gagné (isEnded => victory() / defeat), on a déjà
  // log toutes les informations (avec winCards + earnedcoins), donc pas besoin de re-log !
  if (turn === turnToCheck && ingame) {
    const urlParams = new URLSearchParams(window.location.search);

    if (!urlParams.has("perso")) return;

    saveLog(0, null);
    savePlayer(joueurData);
  }

  toastNotification("Tour n°" + turn + ", choisissez une action");
  document.querySelector("#instruction").innerText = "Choisissez une action";

  updateBuff();

  unlockInputs(true);
}

async function isEnded() {
  if (ingame && (enemy.pv <= 0 || perso.pv <= 0)) {
    ingame = false;
    const isVictory = enemy.pv <= 0;
    toastNotification(isVictory ? "Victoire !" : "Défaite");
    document.querySelector("#instruction").innerText = isVictory ? "Victoire !" : "Défaite";
    updateDesc(`Vous avez ${isVictory ? "vaincu" : "perdu contre"} ${enemy.nom}`);

    if (!joueurData) {
      toastNotification("Erreur : Pas de joueur détecté, sauvegarde impossible", 6000, true);
      return;
    }

    try {
      if (isVictory) {
        await victory();
      } else {
        await saveLog(0, null);
        await savePlayer(joueurData);
      }
      toastNotification("Sauvegarde effectuée, redirection ...", 6000);
    } catch (e) {
      console.error(e);
      toastNotification("Erreur : le combat n'a pas pu être sauvegardé :" + e.message, 6000, true);
    }
  }

  if (!ingame) {
    endRediction();
  }
}

const newCards = [];
async function victory() {
  const enemyID = parseInt(Object.entries(enemyJSON).find((e) => e[1] === selectedEnemy)[0]);

  var newJoueurData = { ...joueurData };
  var winCards = [];

  // Map card
  if (mapID) {
    const mapCard = cardJSON.find((card) => card.kind === "map" && card.kindId === mapID && card.value === cardRarity);
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

  // Anecdote card (50% chance to get)
  if (Math.random() * 2 <= 1) {
    const anecdoteCardsList = cardJSON.filter(
      (card) => card.kind === "anecdote" && ((mapID && card.maps?.includes(mapID)) || card.enemies?.includes(enemyID))
    );

    // Choose 1 between all possibilities
    const randomAnecdoteCardID = Math.floor(Math.random() * anecdoteCardsList.length);
    const anecdoteCard = anecdoteCardsList[randomAnecdoteCardID];

    newJoueurData.cards = addCard(newJoueurData.cards, anecdoteCard);
    anecdoteCard ? winCards.push(anecdoteCard) : null;
  }
  // Coins
  newJoueurData.alpagaCoin = addCoins(newJoueurData.alpagaCoin, winCards);

  // Security 30/12 : Bug when update files, cookies of player are like "corrupted" and enemy data doesn't work well
  if (!newJoueurData.alpagaCoin) {
    toastNotification("Erreur : Données corrompues : Supprimez vos cookies.", 12000, true);
    stop();
  }

  // Save fight in log
  const earnedCoins = newJoueurData.alpagaCoin - joueurData.alpagaCoin;
  await saveLog(earnedCoins, winCards);
  // Update player data
  await savePlayer(newJoueurData);

  // Show rewards (cards)
  showCardsAndCoins(winCards, earnedCoins);
}

async function saveCheat(enemy) {
  const cheatJSON = getData("combatCheat");
  const cheatID = parseInt(Object.keys(cheatJSON).reverse()[0]) + 1 || 1;

  const newCheatLog = {};
  newCheatLog[cheatID] = {
    date: dateToString(new Date(), true),
    joueur: indexPlayer,
    perso: nomPerso,
    enemy: enemy,
    degat: perso.degat,
    armure: perso.armure,
    pvmax: perso.pvmax,
    sumStats: [perso.force, perso.dexté, perso.intel, perso.charisme, perso.esprit],
  };

  const newCheatLogEncoded = JSON.stringify(newCheatLog).replaceAll("+", "%2B").replaceAll(";", "%3B");
  const cookiePerso = "combatCheatJSON=" + newCheatLogEncoded + "; SameSite=Strict";
  document.cookie = cookiePerso;
  await callPHP({ action: "saveFile", name: "combatCheat" });
}

async function saveLog(earnedCoins, winCards) {
  const logsJSON = getData("combatLogs");

  if (logID === undefined) logID = parseInt(Object.keys(logsJSON).reverse()[0]) + 1 || 1;

  const newLog = {};
  newLog[logID] = {
    date: dateToString(new Date(), true),
    joueur: indexPlayer,
    perso: nomPerso,
    map: mapID,
    cardRarity: cardRarity,
    enemy: selectedEnemy.nom,
    earnedCoins: earnedCoins,
    winCards: winCards?.map((w) => [w.id, w.name]) || [],
    turn: parseInt(document.querySelector("#turn").innerText),
    pv: perso.pv,
    epv: enemy.pv,
  };

  // console.log(newLog);

  const newLogEncoded = JSON.stringify(newLog).replaceAll("+", "%2B").replaceAll(";", "%3B");
  const cookiePerso = "combatLogsJSON=" + newLogEncoded + "; SameSite=Strict";

  document.cookie = cookiePerso;
  // console.log("saveFile done : combatLogs, jdr_backend.php executed");
  await callPHP({ action: "saveFile", name: "combatLogs" });
}

async function savePlayer(newJoueurData) {
  // Last control before save : if entries are negative, don't save !
  const persoIDforPlayer = joueurData.persos.indexOf(parseInt(indexPerso));

  // Glitch Bug fixes : Victorine 27/11/23 "Infini combat si tu gagnes avant T6-8 !"
  // En effet, l'entrée n'était pas décomptée/consommée si tu finissais avant, mtn dès la save je la compte
  if (currentPersoEntries === newJoueurData.entries[persoIDforPlayer]) newJoueurData.entries[persoIDforPlayer] -= 1;

  if (newJoueurData.entries[persoIDforPlayer] <= -1) {
    toastNotification("Erreur : Le personnage a déjà consommé toutes ses entrées.", 6000, true);
    return;
  }

  var newPlayer = {};
  newPlayer[indexPlayer] = newJoueurData;
  // console.log(newPlayer);

  const newPersoEncoded = JSON.stringify(newPlayer).replaceAll("+", "%2B").replaceAll(";", "%3B");
  // encodeURIComponent(JSON.stringify(newPerso))
  const cookiePerso = "playerJSON=" + newPersoEncoded + "; SameSite=Strict";

  document.cookie = cookiePerso;
  await callPHP({ action: "saveFile", name: "player" });
}

function addCard(joueurDataCards, card) {
  if (card && !joueurDataCards.includes(card.id)) {
    newCards.push(card.id);
    joueurDataCards.push(card.id);
  }
  return joueurDataCards;
}
function addCoins(alpagaCoin, winCards) {
  const cardsValue =
    winCards?.map((card) => (card ? card.value : 0))?.reduce((acc, value) => acc + value) || enemyRarity;
  if (cardRarity === 2) {
    // 13/12/23 : Add 1 alpaga Coin for Elite !
    alpagaCoin += 1;
  }
  return alpagaCoin + cardsValue + Math.max(enemyRarity - 3, 0);
}

function showCardsAndCoins(winCards, newCoins) {
  // console.log("Earned : " + newCoins.toString() + ", New sold : " + (newCoins + joueurData.alpagaCoin).toString());
  // console.log(winCards.map((card) => card?.name));
  // winCards.forEach((card) => {
  //   if (!oldJoueurData.cards.includes(card.id)) {
  //     console.log(card.name + " is a new Card !");
  //   }
  // });

  const dialog = document.querySelector("dialog");
  // Disable outside click to close dialog
  dialog.style.pointerEvents = "none";
  document.querySelector("#coins").innerText = newCoins.toString();

  const cardsE = document.querySelector("#cards");

  winCards.forEach((card) => {
    const li = document.createElement("li");
    li.innerText = card.name;

    if (newCards.includes(card.id)) {
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

    div.append(li, imgCardE);
    cardsE.append(div);
  });

  // Ouverture en "modal"
  dialog.showModal();
}

function endRediction() {
  setTimeout(() => {
    window.location.href = "jdr_profil.html?joueur=" + indexPlayer;
  }, 5500);
  return;
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
  if (type == "attaque" || type == "skill" || type == "soin" || type == "buff") {
    section.querySelector(".statName").innerText = statName;
    // 24/11/23 : Max success is 18 (because user can have 19,20, ... !)
    success = Math.min(stat, 18);
  } else {
    // Defense
    section.querySelector(".statName").innerText = statName + "/2";
    // 24/11/23 : Max success is 13 (because user can have more !)
    success = Math.min(Math.ceil(stat / 2) + (user[statName + "Res"] ?? 0), 13);
    // console.log("Defense " + statName + " : " + success);
  }

  // Result (correction 20/11/23 : change round to floor to have nice repartition)
  const diceValue = Math.floor(Math.random() * 20 + 1);

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
let inExecution = false;
function turnExecution(persoSkill, skillE = null) {
  // Bug fix Victorine 26/11/2023 : If already clicked (in execution), then cancel
  // Because if not, can spam x skills and kill enemy in 1 turn !
  if (inExecution) return;
  inExecution = true;

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
    if (skillE) {
      skillE.querySelector(".skillName").disabled = true;
      // 25/11/2023 : Can't use heal 2 times (too cheat)
      if (skillE.querySelector(".montant").innerText.includes("soin")) {
        Object.values([...document.querySelectorAll(".skillCombat")]).forEach((sE) => {
          if (sE.querySelector(".montant").innerText.includes("soin")) {
            sE.querySelector(".skillName").disabled = true;
          }
        });
      }
    }
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

  executeAction(enemy, {
    type: "attaque",
    montant: "Dégât +1D10",
    statUsed: statName,
  });
}

function executeAction(user, userSkill) {
  // console.log(userSkill);
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
  } else if (userResult == "success") {
    montant = dicesConversion(userSkill.montant) + (userSkill.montantFixe || 0);
  }

  // console.log("montant : ", montant);

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
      // Update 26/11/23 : Nerf du heal qui est trop cheat
      // "Heal autant que ton montant de dégâts, ce n'est pas normal"
      // 0 de dégâts transformé en heal, ce n'est pas normal non plus
      // Test d'une première version où 2/3 dégâts == Heal
      // heal(user, (user.degat * 4) / 5 + montant);
      heal(user, Math.floor(user.degat * 0.9) + montant);
      updateDesc("Soin critique !");
    } else if (userResult == "success") {
      // heal(user, Math.floor((user.degat * 4) / 5) + montant);
      heal(user, Math.floor(user.degat * 0.9) + montant);
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
    // Update 05/01/2024 : Pour les ennemis, sachant qu'ils n'ont pas d'armure, ils ont une
    // réduction égale à 1/8 des dégâts.
    // Exemple joueur (32 dégâts, 20 armures) : (32/2 = 16) + (20/2 =10) = 26, 26 - 20 (armure) = 6 sur un échec critique
    // Si on a dégâts <= armures, alors on prend 0
    // Exemple ennemi (40 dégâts) : (40/2 = 20) + (-40/8 = -5) = 15, 15 - 0 (armure) = 15 sur un échec critique
    hit(user, Math.trunc(user.degat / 2) + Math.trunc(user.armure / 2 || -user.degat / 8));
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
    // document.querySelector(".lifebar").style.width = `${Math.max(39 * (user.pv / user.pvmax), 0)}%`;
    document.querySelector(".lifebar").style.width = `${Math.max(user.pv, 0)}px`;
  }
}

function heal(user, amount) {
  // Bug Fixes Victorine 20/11/23 : Take min between "max HP and healed HP" x)
  // ++ Reduce the heal by 1 point (because too cheat)
  user.pv = Math.min(user.pvmax, parseInt(user.pv) + amount - 1);

  // min() permet de gérer si les PV soignés sont > aux PV max
  document.querySelector("#pv").value = user.pv;
}

function buff(userSkill, amount) {
  [...document.querySelectorAll(".buff")].every((buffE) => {
    // Second security check to don't update Euphorie, which increase each turn
    if (buffE.id === userSkill.nom && buffE.id !== "Euphorie") {
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

    userSkill.buffElem.forEach((bE) => {
      bE = bE.replace("/tour", "");
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

    // Bug Fix 27/11/23 (Grâce aux logs <3, et à la triche de Sekhmet # Battu Ochak Oo)
    if (buttonSkill.value === "Euphorie") {
      [...document.querySelectorAll(".buff")].forEach((buffE) => {
        if (buffE.id === "Euphorie") {
          buttonSkill.disabled = true;
        }
      });
    }
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

const labelsDescription = {
  niv: "Augmente automatiquement tous les 100 points d'expériences du Niveau 1 à 5, puis tous les 150.<br/> Tous les niveaux paire (2,4,6,8), vous obtenez une compétence.<br/> Au Niveau 5 vous avez +1 en Esprit.<br/> Au Niveau 10, c'est +1 où vous voulez.",
  pv: "Statistique des PV, augmente de 5 par niveau.",
  degat:
    "Les dégâts sont calculés en faisant la somme du montant des 2 premières armes. Puis +10% par niveau. Ex : Armes : 4+5, niveau 6 : 9*1.1^6 = 16<br/> Chaque coup est additionné de 1D10 de dégâts.",
  armure:
    "L'armure vaut le montant de l'armure (dégât reçu -x). Puis +10% par niveau. Ex : Armure : 4, niveau 6 : 9*1.1^6 = 7",
  //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
};

initDialog(labelsDescription);
