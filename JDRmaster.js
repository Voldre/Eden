import { skillsJSON, eqptJSON, masterJSON, enemyJSON } from "./JDRstore";
import { callPHP, isTextInText, toastNotification } from "./utils";

// load notes
document.querySelector(".notes").value = masterJSON.notes;

console.log("Enemy JSON", enemyJSON);

if (window.location.href.includes("html")) {
  console.log("Page must not be read in .html, use .php instead");
  stop();
}

var allSlots = [document.querySelectorAll(".infoEnnemi")];
function updateSlots() {
  var enemiesList = [...document.querySelectorAll(".infoEnnemi")].filter(
    (infoE) => infoE.querySelector(".ennemi").value != ""
  );
  var persosList = [...document.querySelectorAll(".perso")].filter((persoE) => persoE.children[0].value != "");
  allSlots = [...enemiesList, ...persosList] || [document.querySelectorAll(".infoEnnemi")];
}

// Next turn
var allTurnE = [...document.querySelectorAll(".nextTurn")];

allTurnE.forEach((turnE) => {
  turnE.addEventListener("click", () => {
    var mainE = turnE.closest(".perso") || turnE.closest(".infoEnnemi");

    var slotID = allSlots.indexOf(mainE);

    if (allSlots.length == slotID + 1) {
      // If all done, new turn
      document.querySelector("#tour").value = parseInt(document.querySelector("#tour").value) + 1;
      slotID = -1;
    }

    // Turn of character done
    [...mainE.querySelector("#buffs").querySelectorAll('input[type="number"]')].forEach((buffTurnE) => {
      if (buffTurnE.value > 0) {
        buffTurnE.value -= 1;
      }
    });

    turnE.classList.add("hide");
    allSlots[slotID + 1].querySelector(".nextTurn").classList.remove("hide");
  });
});

// Disable the possibility of launching many audio simultaneously

document.addEventListener(
  "play",
  function (e) {
    var audios = document.getElementsByTagName("audio");
    for (var i = 0, len = audios.length; i < len; i++) {
      if (audios[i] != e.target) {
        audios[i].pause();
        if (audios[i].currentTime < 30) {
          audios[i].currentTime = 0;
        }
      }
    }
    if (e.target.firstChild.attributes) {
      var currentBGM = e.target.firstChild.attributes.src.nodeValue.split("/")[1].split(".")[0];
      console.log(currentBGM);
      document.getElementById("currentMusic").innerText =
        document.getElementById(currentBGM).innerText + " (" + currentBGM + ")";
    }
  },
  true
);

// prettier-ignore
const elements = ["ontond", "ranch", "perç", "perc", "feu", "lace", "oudre", "ature", "énèbre", "umière",];

var enemyWeakness = Object.values(enemyJSON).map((enemy) => enemy.infos);

var elementsCount = {};

elements.forEach((element) => {
  // The g in the regular expression (meaning "g"lobal) says to search the whole string rather than just find the first occurrence
  var fullText = JSON.stringify(enemyWeakness);
  var regex = new RegExp(element, "g"); // Regex for the element in global
  var count = (fullText.match(regex) || []).length;
  // var count = (temp.match(/is/g) || []).length;
  elementsCount[element] = count;
});
console.log("Enemies Weaknesses :");
console.log(enemyWeakness);
console.log(elementsCount);

// console.log("Pour trouver des ennemis par nom  : Object.values(enemyJSON).filter(enemy => enemy.nom.includes('rsun')");
document.querySelector("#filtre").addEventListener("change", (e) => {
  document.querySelector("#filteredEnemys").innerHTML = null;
  var enemiesList = Object.values(enemyJSON).filter((enemy) => isTextInText(enemy.nom, e.target.value));
  enemiesList.forEach((enemy) => {
    var liElem = document.createElement("li");
    liElem.innerText = enemy.nom + " - " + enemy.visuel3D;
    document.querySelector("#filteredEnemys").append(liElem);
  });
});

[...document.querySelectorAll(".ennemi")].forEach((selectEnnemi, i) => {
  // Fill Select elements
  [{ nom: "" }, ...Object.values(enemyJSON)].forEach((enemy) => {
    var option = document.createElement("option");
    option.value = enemy.nom;
    option.innerText = enemy.nom;
    selectEnnemi.append(option);
  });

  // Change enemy selected

  selectEnnemi.addEventListener("change", (e) => {
    loadEnemy(e.target.selectedIndex, i);
    toastNotification("Chargement de l'ennemi réussi : " + e.target.value);
  });
});
[...document.querySelectorAll(".enemyDesc")].forEach((descE) => {
  descE.addEventListener("click", () => {
    if (descE.style.maxHeight === "10px") {
      descE.style.backgroundColor = "";
      descE.style.maxHeight = "200px";
    } else {
      descE.style.backgroundColor = "rgba(36, 36, 106, 0.5)";
      descE.style.maxHeight = "10px";
    }
  });
});

function loadEnemy(indexEnemy, indexElement) {
  updateSlots();

  var ennemiElement = [...document.querySelectorAll(".infoEnnemi")][indexElement];

  var enemyData = enemyJSON[indexEnemy];

  if (!enemyData) {
    console.log(indexEnemy + " is not an enemy (in the list)");
    // ennemiElement.querySelector('#nom').innerText = "";
    ennemiElement.querySelector("#desc").innerText = "";
    ennemiElement.querySelector("#infos").innerText = "";
    ennemiElement.querySelector("#drop").innerText = "";
    ennemiElement.querySelector("#visuel").innerText = "";
    ennemiElement.querySelector(".icon").src = "";
    ennemiElement.querySelector("#pv").value = "";
    ennemiElement.querySelector("#pvmax").value = "";

    ennemiElement.querySelector("#force").value = "";
    ennemiElement.querySelector("#dexté").value = "";
    ennemiElement.querySelector("#intel").value = "";
    ennemiElement.querySelector("#charisme").value = "";
    ennemiElement.querySelector("#esprit").value = "";

    [...ennemiElement.querySelectorAll(".competence")].forEach((e) => (e.innerText = ""));

    return;
  }

  // ennemiElement.querySelector('#nom').innerText = enemyData.nom;
  ennemiElement.querySelector("#desc").innerText = "Desc : " + enemyData.desc;
  ennemiElement.querySelector("#infos").innerText = "Infos / BP : " + enemyData.infos;
  ennemiElement.querySelector("#drop").innerText = "Drop : " + enemyData.drop;
  ennemiElement.querySelector("#visuel").innerText = enemyData.visuel3D;
  ennemiElement.querySelector(".icon").src =
    "http://voldre.free.fr/Eden/images/monsters/" + enemyData.visuel3D + ".png";
  ennemiElement.querySelector(".icon").alt = enemyData.visuel3D.toLowerCase();
  ennemiElement.querySelector("#pv").value = enemyData.pvmax;
  if (enemyData.pvmax >= 200) ennemiElement.querySelector("#boss_icon").classList.remove("hide");
  else ennemiElement.querySelector("#boss_icon").classList.add("hide");
  var nbP = document.querySelector("#nbP").value; // new functionality 28/08/2023
  ennemiElement.querySelector("#pvmax").value =
    nbP !== "3"
      ? Math.round(enemyData.pvmax * (1 + (nbP - 3) * 0.33))
      : parseInt(enemyData.pvmax) >= 200
      ? parseInt(enemyData.pvmax) + 100
      : enemyData.pvmax;

  // Stats
  ennemiElement.querySelector("#force").value = enemyData.stats.split(",")[0];
  ennemiElement.querySelector("#dexté").value = enemyData.stats.split(",")[1];
  ennemiElement.querySelector("#intel").value = enemyData.stats.split(",")[2];
  ennemiElement.querySelector("#charisme").value = enemyData.stats.split(",")[3];
  ennemiElement.querySelector("#esprit").value = enemyData.stats.split(",")[4];

  // Skills de l'ennemi
  enemyData.skills.forEach((skill, index) => {
    var competence = [...ennemiElement.querySelectorAll(".competence")][index];
    competence.innerText = skill;
  });
}

// EQPTS
const equipementsE = document.querySelector(".equipements");
// eqpts list
Object.values(eqptJSON).forEach((eqpt) => {
  var eqptE = document.createElement("div");
  eqptE.classList.add("eqpt");
  var nomE = document.createElement("p");
  nomE.classList.add("nom");
  var descE = document.createElement("p");
  descE.classList.add("desc");
  var effetE = document.createElement("p");
  effetE.classList.add("effet");
  var montantE = document.createElement("p");
  montantE.classList.add("montant");

  var iconeE = document.createElement("img");
  iconeE.classList.add("icone");

  nomE.innerText = eqpt.nom;
  descE.innerText = eqpt.desc;
  effetE.innerText = eqpt.effet; // Ajout Sanofi
  montantE.innerText = eqpt.montant;
  iconeE.src = "http://voldre.free.fr/Eden/images/items/" + eqpt.icone + ".png";

  eqptE.append(nomE, descE, effetE, montantE, iconeE);
  equipementsE.append(eqptE);
});

// Show/Hide eqpts
const buttonEqpt = document.querySelector("#buttonEqpt");
buttonEqpt.addEventListener("click", () => {
  if (buttonEqpt.innerText == "Afficher") {
    buttonEqpt.innerText = "Masquer";
  } else {
    buttonEqpt.innerText = "Afficher";
  }
  equipementsE.classList.toggle("hide");
});

// Filter eqpts by name (08/02/2024)

const eqptNameFilter = document.querySelector("#eqptNameFilter");
const eqptEffectFilter = document.querySelector("#eqptEffectFilter");
eqptNameFilter.addEventListener("blur", () => {
  eqptFilter();
});
eqptEffectFilter.addEventListener("blur", () => {
  eqptFilter();
});

const eqptFilter = () => {
  const filterName = eqptNameFilter.value;
  const filterEffect = eqptEffectFilter.value;

  let nbEqptsDisplayed = 0;

  [...equipementsE.children].forEach((eqptE) => {
    const eqptName = eqptE.querySelector(".nom").innerText;
    const eqptEffect = eqptE.querySelector(".effet").innerText;
    const eqptMontant = eqptE.querySelector(".montant").innerText;

    if (
      isTextInText(eqptName, filterName) &&
      (isTextInText(eqptEffect, filterEffect) || isTextInText(eqptMontant, filterEffect))
    ) {
      eqptE.classList.remove("hide");
      nbEqptsDisplayed++;
    } else eqptE.classList.add("hide");
  });

  document.querySelector("#nbEqptFiltered").innerText = `(${nbEqptsDisplayed})`;
};

// ALL SAVES

// Allow save for users
function toggleButton() {
  if (masterJSON.allow == true) {
    document.querySelector("#allowSave").style = "border: 3px solid green";
  } else {
    document.querySelector("#allowSave").style = "border: 3px solid red";
  }
}

toggleButton();
document.querySelector("#allowSave").addEventListener("click", () => {
  masterJSON.allow = !masterJSON.allow;
  toggleButton();

  masterJSON.notes = document.querySelector(".notes").value;

  document.cookie = "masterJSON=" + encodeURIComponent(JSON.stringify(masterJSON));
  callPHP({ action: "saveFile", name: "master" });
  toastNotification("Autorisation modifiée");
});

document.querySelector("#save").addEventListener("click", () => {
  masterJSON.notes = document.querySelector(".notes").value;
  document.cookie = "masterJSON=" + encodeURIComponent(JSON.stringify(masterJSON));
  callPHP({ action: "saveFile", name: "master" });
  toastNotification("Données sauvegardées");
});

document.querySelector("#saveBackup").addEventListener("click", () => {
  callPHP({ action: "saveBackup" });
  toastNotification("JDRpersos_backup.json et JDRplayer sauvegardés");
});

// Add new enemy (4th)

document.querySelector("#newEnemy").addEventListener("click", () => {
  var allEnemies = [...document.querySelectorAll(".infoEnnemi")];

  if (allEnemies[2].checkVisibility() == false) {
    // Mobile view
    if (allEnemies[3].style.display == "none") {
      allEnemies[3].style.display = "block";
      document.querySelector(".combat").style.gridTemplateColumns = "50vw 50vw";
    } else {
      allEnemies[3].style.display = "none";
      document.querySelector(".combat").style.gridTemplateColumns = "99vw";
    }
  } else {
    // Desktop view
    if (allEnemies[3].style.display == "none") {
      allEnemies[3].style.display = "block";
      document.querySelector(".combat").style.gridTemplateColumns = "25vw 25vw 25vw 25vw";
    } else {
      allEnemies[3].style.display = "none";
      document.querySelector(".combat").style.gridTemplateColumns = "33vw 33vw 33vw";
    }
  }
});

// Get and update players PV (new functionality 28/08/2023)

document.querySelector("#updatePInfo").addEventListener("click", () => {
  updateSlots();

  var xhReq = new XMLHttpRequest();

  const pInfo = document.querySelector("#pInfo");
  xhReq.open("GET", "./JDRpersos.json" + "?" + new Date().getTime(), false);
  xhReq.send(null);
  var persosJSON = JSON.parse(xhReq.responseText);

  var playersListID = document.querySelector("#pList").value.split(",");

  pInfo.innerHTML = "";

  Object.entries(playersListID).forEach(([index, pID]) => {
    var player = persosJSON[(parseInt(pID) - 1).toString()]; // Car index 0 à la première
    if (!player) return; // Can't continue

    if ([...document.querySelectorAll(".perso")][index])
      [...document.querySelectorAll(".perso")][index].children[0].value = player.nom;

    var liElem = document.createElement("li");
    liElem.innerText = player.nom + " : " + player.pv + "/" + player.pvmax;
    pInfo.append(liElem);
  });
});

// Variateurs de PV et Dégâts selon le nombre de joueurs (new functionality 28/08/2023)

document.querySelector("#nbP").addEventListener("change", (e) => {
  var nbP = e.target.value;
  if (nbP >= 3) {
    document.querySelector("#variation").innerText = "+" + (nbP - 3) * 33 + "%";
  } else {
    document.querySelector("#variation").innerText = "-" + (3 - nbP) * 33 + "%";
  }
});

// Create skill & Save

document.querySelector("#createSkill").addEventListener("click", () => {
  var addSkill = document.querySelector(".addSkill");
  var skillID = parseInt(Object.keys(skillsJSON).reverse()[0]) + 1 || 1;
  var newSkill = {};
  newSkill[skillID] = {
    nom: addSkill.children[0 + 1].value,
    desc: addSkill.children[2 + 1].value,
    effet: addSkill.children[4 + 1].value,
    montant: addSkill.children[6 + 1].value,
    icone: addSkill.children[8 + 1].value,
    stat: addSkill.children[10 + 1].value,
    classe: addSkill.children[12 + 1].value.split(","),
  };
  console.log(newSkill);

  document.cookie = "skillsJSON=" + encodeURIComponent(JSON.stringify(newSkill));

  callPHP({ action: "saveFile", name: "skills" });
  skillsJSON[skillID] = newSkill[skillID];
  toastNotification("Compétence créé");
});

// Create eqpt & Save

document.querySelector("#createEqpt").addEventListener("click", () => {
  var addEqpt = document.querySelector(".addEqpt");
  var eqptID = parseInt(Object.keys(eqptJSON).reverse()[0]) + 1 || 1;
  var newEqpt = {};
  newEqpt[eqptID] = {
    nom: addEqpt.children[0 + 1].value,
    desc: addEqpt.children[2 + 1].value,
    effet: addEqpt.children[4 + 1].value,
    montant: addEqpt.children[6 + 1].value,
    icone: addEqpt.children[8 + 1].value,
  };
  console.log(newEqpt);

  document.cookie = "eqptJSON=" + encodeURIComponent(JSON.stringify(newEqpt));

  callPHP({ action: "saveFile", name: "eqpt" });
  eqptJSON[eqptID] = newEqpt[eqptID];
  toastNotification("Equipement créé");
});

// Create enemy & Save

document.querySelector("#createEnemy").addEventListener("click", () => {
  var addEnemy = document.querySelector(".addEnemy");
  var enemyID = parseInt(Object.keys(enemyJSON).reverse()[0]) + 1 || 1;
  var newEnemy = {};
  newEnemy[enemyID] = {
    visuel3D: addEnemy.children[0 + 1].value,
    nom: addEnemy.children[2 + 1].value,
    pvmax: addEnemy.children[4 + 1].value,
    skills: [
      addEnemy.children[6 + 1].value,
      addEnemy.children[8 + 1].value,
      addEnemy.children[10 + 1].value,
      addEnemy.children[12 + 1].value,
    ],
    stats: addEnemy.children[14 + 1].value,
    desc: addEnemy.children[16 + 1].value,
    infos: addEnemy.children[18 + 1].value,
    drop: addEnemy.children[20 + 1].value,
  };
  console.log(newEnemy);

  document.cookie = "enemyJSON=" + encodeURIComponent(JSON.stringify(newEnemy));

  callPHP({ action: "saveFile", name: "enemy" });
  enemyJSON[enemyID] = newEnemy[enemyID];
  toastNotification("Ennemi créé");
});
