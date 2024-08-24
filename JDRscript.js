import {
  skillsJSON,
  skillsAwakenJSON,
  eqptJSON,
  persosJSON,
  galeryJSON,
  masterJSON,
  statsJSON,
  cardJSON,
} from "./JDRstore";
import {
  callPHP,
  toastNotification,
  initDialog,
  parseEqptsByRegex,
  unformatText,
  capitalize,
  aoeDescInfo,
  sum,
  sumEqptsAsAccess,
  isTextInText,
} from "./utils";

console.log("Skills JSON", skillsJSON);
console.log("Persos JSON", persosJSON);

const buttonBuffs = document.querySelector("#buttonBuffs");

// Table Initialisation

// prettier-ignore
const classes = [ "Guerrier", "Chevalier", "Templier", "Chev Dragon", "Voleur", "Assassin", "Danselame", "Samouraï", "Chasseur", "Ingénieur", "Corsaire", "Juge", "Clerc", "Barde", "Shaman", "Sage", "Magicien", "Illusionniste", "Démoniste", "Luminary",];
// prettier-ignore
const iconsClasses = [ "01", "02", "03", "18", "04", "05", "06", "16", "07", "08", "09", "59", "10", "11", "12", "17", "13", "14", "15", "19",];
// prettier-ignore
const iconsEveil = [ "J009", "J011", "J013", "j043", "J015", "J017", "J019", "j039", "J021", "J023", "J025", "j087", "J027", "J029", "J031", "j041", "J033", "J035", "J037", "j045"];
// prettier-ignore
const races = [ "Humain", "Ezelin", "Ursun", "Zumi", "Anuran", "Torturran", "Drakai", "Tuskar", "Ogre",];
// prettier-ignore
const poids = [ "Moyen", "Léger", "Lourd", "Léger", "Moyen", "Moyen", "Léger", "Lourd", "Lourd",];

const elements = ["contondant", "tranchant", "perçant", "feu", "glace", "foudre", "nature", "lumière", "ténèbres"];

const elementsCategories = elements.map((element) => {
  // Remove all accents (é,è,ç)
  const labelElement = unformatText(element);
  // Dégât xxx + || Dégât de xxx + ... ?
  return { regex: [`${element} +`], label: labelElement, img: true };
});

const statistiques = ["Force", "Dextérité", "Intelligence", "Charisme", "Esprit"];

// Categories not in the synthesis, but used to calcule limits
const statsCategories = statistiques.map((stat) => {
  // Don't match "Résistance d'esprit" for "Esprit" stat
  const regex = stat === "Esprit" ? /(?<!résistance d')esprit \+/gi : stat;
  return { regex: [`${regex} +`], label: unformatText(stat), img: false };
});

const synthesisCategories = [
  { regex: ["Dégât +"], label: "DGT", img: false },
  { regex: ["Faiblesse +"], label: "F", img: false },
  { regex: ["Soin +"], label: "S", img: false },
  { regex: ["Dégât physique +"], label: "P", img: false },
  ...elementsCategories.slice(0, 3),
  { regex: ["Dégât magique +", "Dégât élémentaire +"], label: "M", img: false },
  ...elementsCategories.slice(3),
  { regex: ["Dégât -", "Dégât reçu -"], label: "ARM", img: false },
];

// Main elements

const persoE = document.querySelector(".perso");
let indexPerso = -1;
let persoData = {};

const classePElement = document.querySelector("#classeP");
const classeSElement = document.querySelector("#classeS");
const nivE = document.querySelector("#niv");

let persoEqptsName = [];
let persoEqpts = [];

const errorEqptE = document.querySelector("#errorEQPT");

// RACES
const raceE = document.querySelector("#race");
raceE.addEventListener("change", (e) => {
  document.querySelector(".poids").innerText = poids[races.indexOf(e.target.value)];
  // Verify stats repartition
  statsVerification();
});

// CLASSES
const allClassE = document.querySelectorAll('[id^="classe"]');
allClassE.forEach((classeElem, i) => {
  ["", ...classes].forEach((classe) => {
    const option = document.createElement("option");
    option.value = classe;
    option.innerText = classe;
    classeElem.append(option);
  });

  classeElem.addEventListener("change", (e) => {
    const selectedClasseID = classes.indexOf(e.target.value);
    if (selectedClasseID == -1) {
      console.log(e.target.value + " is not a class (in the list)");
      document.querySelector(".iconClasses").children[i].src = "";
    } else {
      document.querySelector(".iconClasses").children[i].src =
        "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[selectedClasseID] + ".png";

      updateSkillsList();

      // Display armor type
      displayArmorTypes();

      statsVerification();
    }
  });
});

const displayArmorTypes = () => {
  const physicBorderClasses = ["Chevalier"];
  const magicBorderClasses = ["Sage", "Luminary"];

  const classes = [allClassE[0].value, allClassE[1].value];
  const classesArmorTypes = classes.map((classe) => statsJSON.classes.find((c) => c.Classe === classe));

  let physicException = false;
  let magicException = false;

  physicBorderClasses.forEach((pClass) => {
    if (classes.includes(pClass)) {
      physicException = true;
    }
  });
  magicBorderClasses.forEach((pClass) => {
    if (classes.includes(pClass)) {
      magicException = true;
    }
  });

  let armorTypes = [];

  if (physicException) {
    const otherClass = classesArmorTypes.filter((c) => !physicBorderClasses.includes(c.Classe))[0];
    armorTypes.push("lourd");
    if (!otherClass) {
      // Chevalier Chevalier
      armorTypes.push("leger");
    } else if (otherClass.armure !== "lourd") {
      armorTypes.push("leger");
      armorTypes.push(otherClass.armure);
    }
  } else if (magicException) {
    const otherClass = classesArmorTypes.filter((c) => !magicBorderClasses.includes(c.Classe))[0];
    armorTypes.push("magique");
    if (!otherClass) {
      // Sage Luminary - or one twice
      armorTypes.push("leger");
    } else if (otherClass.armure !== "magique") {
      armorTypes.push("leger");
      armorTypes.push(otherClass.armure);
    }
  } else
    armorTypes = statsJSON.classes
      .filter((e) => classes.includes(e.Classe))
      .map((classStat) => classStat.armure)
      .flat();

  // console.log(allClassE[0].value, allClassE[1].value, armorTypes);

  ["magique", "leger", "lourd"].forEach((type) => {
    document.querySelector("#" + type).className = armorTypes.includes(type) ? "skillRangeIcon" : "hide skillRangeIcon";
  });
};

// CLASSES EVEILLES
const iconClassesEs = [...document.querySelector(".iconClasses").children];
iconClassesEs.forEach((icClasseE) => {
  icClasseE.addEventListener("click", (e) => {
    iconClassesEs.forEach((e) => e.classList.remove("awaken"));
    const classe = document.querySelector("#" + e.target.className).value;
    e.target.classList.add("awaken");

    defineAwaken(classe);
  });
});

function defineAwaken(classe = "") {
  awakenSkillE.classList.add("hide");

  const stuffsName = [...equipementsE.children].map((eqpt) => eqpt.children[0].value.toLowerCase());
  const niv = nivE.value;
  if (classe === "" || (niv < 10 && !stuffsName.includes("pistolet suspect"))) return;

  awakenSkillE.classList.remove("hide");

  var nbUse;
  if (niv >= 15) {
    nbUse = 3;
  } else if (niv >= 12) {
    nbUse = 2;
  } else {
    nbUse = 1;
  }

  awakenSkillE.id = classe;
  awakenSkillE.querySelector(".nom").innerText = "Eveil du " + classe;
  awakenSkillE.querySelector(".effet").innerText = "Inactif";

  const nbTurns = nbUse === 1 ? "4" : "3";
  awakenSkillE.querySelector(".montant").innerText =
    nbUse + " fois par combat : Eveil des compétences : Durée " + nbTurns + " tours";

  var classeID = classes.indexOf(classe);
  awakenSkillE.querySelector(".icone").src =
    "http://voldre.free.fr/Eden/images/skillIcon/" + iconsEveil[classeID] + ".png";
  awakenSkillE.querySelector(".desc").innerText =
    "Eveil de la classe du " + classe + ", ses compétences sont altérées et améliorées !";
}

// Click on awaken skill element
const awakenSkillE = document.querySelector(".awakenSkill");
awakenSkillE.addEventListener("click", (e) => {
  if (e.target.id !== "awakenButton") {
    awakenSkillE.querySelector(".desc").classList.toggle("hide");
  }
});

document.querySelector("#awakenButton").addEventListener("click", (e) => {
  var awakenClass; // Classe à éveiller
  if (e.target.innerText == "Inactif") {
    e.target.innerText = "Actif";
    e.target.style.color = "green";
    awakenClass = awakenSkillE.id;
  } else {
    e.target.innerText = "Inactif";
    e.target.style.color = "black";
    awakenClass = "No class";
  }

  JSON.parse(persoData.skills).forEach((skill, index) => {
    const competence = [...competencesE.children][index];
    competence.children[0].value = skill;
    insertSkill(competence, skill, awakenClass);
  });
});

// PV
const pvMaxE = document.querySelector("#pvmax");
pvMaxE.addEventListener("change", () => statsVerification());

// Niv
document.querySelector("#xp").addEventListener("change", (e) => {
  const xp = parseInt(e.target.value);
  let niv;
  // Update 02/04/24 : From lvl 10 to 15 : 200 xp instead of 150
  // Update 12/06/23 : From lvl 5 to 10 : 150 xp instead of 100
  if (xp >= 1150) {
    niv = Math.trunc((xp - 1150) / 200) + 10;
  } else if (xp >= 400) {
    niv = Math.trunc((xp - 400) / 150) + 5;
  } else {
    niv = Math.trunc(xp / 100) + 1;
  }
  nivE.value = niv;

  updateSkillsSlots();

  // Nouveauté 15/08 : Calcul automatique du montant des stats
  statsVerification();

  // Nouveauté 27/05/23 : 4eme accessoire au niveau 4
  if (niv >= 4) {
    equipementsE.lastElementChild.previousElementSibling.classList.remove("hide");
  } else {
    equipementsE.lastElementChild.previousElementSibling.classList.add("hide");
  }
  // Nouveauté 12/06/23 : 5eme accessoire au niveau 8
  if (niv >= 8) {
    equipementsE.lastElementChild.classList.remove("hide");
  } else {
    equipementsE.lastElementChild.classList.add("hide");
  }
  // Nouveauté 18/10/23 : Compétence éveillés
  defineAwaken();
  // Nouveauté 24/05/24 : Passif niveau 12
  setPassif(niv >= 12);
});

// Nouveauté 15/08 : Calcul automatique du montant des stats
function statsVerification() {
  const niv = nivE.value;
  const sommeStats = statsValue(false).reduce(sum);
  const statsRequired = 61 + Math.trunc(parseInt(niv) / 5);
  if (sommeStats !== statsRequired) {
    document.querySelector("#errorStat").innerText =
      "/!\\ Attention : Erreur points de stats : " + sommeStats + ", attendu : " + statsRequired;
  } else {
    document.querySelector("#errorStat").innerText = "";
  }

  // 12/05/2024 Verify stats repartition according to race and classes
  const { allStats } = getStats();
  // Rename stats name according to element
  allStats.Dexté = allStats.Dextérité;
  allStats.Intel = allStats.Intelligence;

  ["force", "dexté", "intel", "charisme", "esprit"].map((statName) => {
    const statE = document.querySelector("#" + statName);
    // The maximum is 17
    if (statE.value < Math.min(allStats[capitalize(statName)], 17)) {
      statE.classList.add("wrong");
    } else {
      statE.classList.remove("wrong");
    }
  });
  // PV are always the right value (character cannot have more, stuff are handled)
  if (parseInt(pvMaxE.value) !== allStats["PVMax"]) {
    pvMaxE.classList.add("wrong");
  } else {
    pvMaxE.classList.remove("wrong");
  }
}

document.querySelector(".stats").addEventListener("change", (e) => {
  if (parseInt(e.target.value) > parseInt(e.target.max)) e.target.value = e.target.max;

  statsVerification();

  const eqptsName = [...equipementsE.children].map((competenceE) => competenceE.children[0].value);
  const persoEqpts = eqptsName.map((eqptName) =>
    Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) == unformatText(eqptName))
  );
  getAllRes(persoEqpts);
});

// STRESS
document.querySelector("#stress").addEventListener("change", (e) => {
  if (e.target.value >= 50) {
    document.querySelector("#stressImpact").innerText = "(Stats -" + Math.trunc(e.target.value / 50) + ")";
  } else {
    document.querySelector("#stressImpact").innerText = "";
  }
});

// COMPETENCES
const competencesE = document.querySelector(".skills");

[...competencesE.children].forEach((competence) => {
  // Selected skill
  competence.children[0].addEventListener("change", (e) => {
    insertSkill(competence, e.target.value);
  });
  // Click on skill element
  competence.addEventListener("click", (e) => {
    if (!e.target.classList.contains("nom") && !e.target.classList.contains("buffTurn")) {
      // If click on select element, don't show/hide the desc ?
      competence.children[4].classList.toggle("hide");
    }
  });
});

function updateSkillsSlots() {
  // Display skils slots
  [...competencesE.children].forEach((competence, i) => {
    const niv = nivE.value || 1;
    const SlotsAvailable = Math.trunc(niv / 2) + 3; // Update 17/05/23, 3 au lieu de 2, car 4 skills sur ~ 12-13 possibles
    if (i > SlotsAvailable) {
      competence.classList.add("hide");
    } else {
      competence.classList.remove("hide");
    }
  });
}
function updateSkillsList() {
  // Depending on classes
  [...competencesE.children].forEach((competence) => {
    // Skills list
    const selectedOption = competence.children[0].value;
    removeOptions(competence.children[0]);
    var option = document.createElement("option");
    option.value = "";
    competence.children[0].append(option);

    const classeP = classePElement.value;
    const classeS = classeSElement.value;

    // Look at the First weapon name
    const weaponName = unformatText(document.querySelector(".arme").children[0].value);

    Object.values(skillsJSON).forEach((skill) => {
      if (skill.classe.includes(classeP) || skill.classe.includes(classeS) || skill.classe.includes(weaponName)) {
        // Si la classe est dans la liste
        var option = document.createElement("option");
        option.value = skill.nom;
        option.innerText = skill.nom;
        competence.children[0].append(option);
      }
    });
    competence.children[0].value = selectedOption;
  });
}

function removeOptions(selectElement) {
  var i,
    L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}

function insertSkill(skillElement, skillName, awakenClass = false) {
  var selectedSkill = Object.values(skillsJSON).find((skill) => skill.nom == skillName);

  skillElement.classList.remove("awaken");

  if (!selectedSkill) {
    if (skillName != "") {
      console.log(skillName + " is not a skill (in the list)");
    }
    skillElement.children[1].innerText = "";
    skillElement.children[2].innerText = "";
    skillElement.children[3].src = "";
    skillElement.children[3].title = "";
    skillElement.children[4].innerText = "";
  } else {
    var selectedAwakenSkill;
    if (selectedSkill.classe.includes(awakenClass)) {
      skillElement.classList.add("awaken");
      selectedAwakenSkill = Object.values(skillsAwakenJSON).find((skill) => skill.nom == skillName);
    }

    // Check if it's same skill by icon
    const sameSkill = skillElement.children[3].children[0].src.includes(selectedSkill.icone);

    const skillDesc = selectedAwakenSkill?.desc || selectedSkill.desc;
    const skillMontant = selectedAwakenSkill?.montant || selectedSkill.montant;

    const skillRange = selectedSkill.effet.split("AoE ")[1] ?? null; // en bas [0] + "AoE"
    const selectedSkillEffet = skillRange ? selectedSkill.effet.split(" AoE")[0] : selectedSkill.effet;
    skillElement.children[1].innerText = selectedSkillEffet;

    if (skillRange) {
      const skillRangeIconE = document.createElement("span");
      skillRangeIconE.className = "skillRangeIcon";
      skillRangeIconE.style.backgroundImage = `url(http://voldre.free.fr/Eden/images/layout/${skillRange}.png)`;
      const rangeI = aoeDescInfo.range.findIndex((x) => x === skillRange[0]);
      const typeI = aoeDescInfo.type.findIndex((x) => x === skillRange[1]);
      skillRangeIconE.title = `AoE en ${aoeDescInfo.rangeName[rangeI]} ${aoeDescInfo.typeName[typeI]}`;

      const skillStatE = document.createElement("span");
      skillStatE.innerText = "/ " + selectedSkill.stat;

      skillElement.children[1].append(skillRangeIconE, skillStatE);
    } else {
      skillElement.children[1].innerText += " / " + selectedSkill.stat;
    }

    skillElement.children[2].innerText = skillMontant;
    insertBuffInteraction(skillElement.children[3], skillName, selectedSkill, skillMontant);
    skillElement.children[3].children[0].src =
      "http://voldre.free.fr/Eden/images/skillIcon/" + selectedSkill.icone + ".png";
    skillElement.children[3].title = skillDesc;
    skillElement.children[4].innerText = skillDesc;

    // Update 29/07/2023, case de PV pour familiers
    const inputExists = skillElement.children.length >= 6;
    if (inputExists) {
      if (sameSkill) return; // No need to update
      skillElement.removeChild(skillElement.children[5]); // Update
    }

    if (selectedSkill.effet == "Invocation") {
      const pvPetE = document.createElement("input");
      pvPetE.type = "number";
      skillElement.append(pvPetE);
    }
    // Update 05/01/2024, add inputs to handle charges (light/dark)
    if (skillName === "Assaut du Chaos") {
      var wrapperE = document.createElement("div");
      wrapperE.style.width = "max-content";
      var textE = document.createElement("span");
      textE.innerText = "Lum/Ten";
      var lumiereE = document.createElement("input");
      lumiereE.style.width = "40px";
      var tenebresE = document.createElement("input");
      tenebresE.style.width = "40px";

      lumiereE.type = "number";
      tenebresE.type = "number";
      wrapperE.append(textE, lumiereE, tenebresE);
      skillElement.append(wrapperE);
    }

    // Update 14/01/2024, add inputs to handle number of hits
    if (skillName === "Euphorie") {
      var wrapperE = document.createElement("div");
      wrapperE.style.width = "max-content";
      var textE = document.createElement("span");
      textE.innerText = "Coups";
      var coupE = document.createElement("input");
      coupE.style.width = "40px";
      coupE.type = "number";
      coupE.max = 5;
      wrapperE.append(textE, coupE);
      skillElement.append(wrapperE);
    }
  }
}

function insertBuffInteraction(buffTurnE, skillName, selectedSkill, skillMontant) {
  const skillEffet = selectedSkill.effet;
  buffTurnE.style.cursor = "pointer";

  const dialog = document.querySelector("dialog");

  if (
    skillEffet.includes("Provocation") ||
    skillEffet.includes("Buff") ||
    skillEffet.includes("Malus") ||
    skillEffet.includes("Transformation") ||
    skillEffet.includes("Status")
  ) {
    buffTurnE.remove;
    buffTurnE.style.cursor = "url('images/layout/cursor-x.png'), auto";
    buffTurnE.addEventListener("click", () => {
      if (buffTurnE.children[1]) {
        if (buffTurnE.children[1].innerText === "0") {
          buffTurnE.children[2]?.remove();
          buffTurnE.children[1].remove();
        } else {
          // Don't update, remove skill before
          return;
        }
      }
      dialog.innerText = "";
      dialog.style.width = "60%";

      const globalE = document.createElement("p");
      globalE.className = "dialogBuff";

      const name = document.createElement("p");
      name.innerText = skillName;
      globalE.append(name);

      const inputs = document.createElement("div");
      inputs.style.display = "flex";
      inputs.style.alignItems = "center";

      const turnText = document.createElement("p");
      turnText.innerText = "Tours ";
      inputs.append(turnText);

      const turnE = document.createElement("input");
      turnE.type = "number";
      turnE.min = 1;
      turnE.max = 9;
      turnE.value = 3;

      const confirmE = document.createElement("button");
      turnE.addEventListener("change", (e) => {
        confirmE.disabled = e.target.value < 1;
      });
      inputs.append(turnE);

      const amountText = document.createElement("p");
      const amountE = document.createElement("input");
      console.log(skillMontant);

      const hasAmount = skillMontant.includes("1D") || skillMontant.includes("effet mode");
      if (hasAmount) {
        amountText.innerText = "Montants ";
        inputs.append(amountText);

        amountE.type = "number";
        amountE.min = 1;
        amountE.max = 20;
        amountE.value = 2;
        inputs.append(amountE);
      }
      globalE.append(inputs);

      confirmE.innerText = "Confirmer";
      confirmE.addEventListener("click", () => {
        const turnOfBuffE = document.createElement("p");
        const amountOfBuffE = document.createElement("p");
        turnOfBuffE.innerText = turnE.value;
        amountOfBuffE.innerText = hasAmount ? amountE.value : "";
        buffTurnE.append(turnOfBuffE, amountOfBuffE);
        dialog.close();
      });
      globalE.append(confirmE);

      // Bouton de fermeture
      const closeE = document.createElement("button");
      closeE.id = "close";
      closeE.innerText = "Fermer";
      closeE.addEventListener("click", () => {
        dialog.close();
      });
      globalE.append(closeE);

      dialog.append(globalE);
      // Ouverture en "modal"
      dialog.showModal();

      buttonBuffs.className = "";
    });
  }
}

buttonBuffs.addEventListener("click", () => {
  let buffExist = false;
  [...document.querySelectorAll(".buffTurn")].forEach((buffE) => {
    if (buffE.children.length > 1) {
      const turnLeftElement = buffE.children[1];
      if (turnLeftElement.innerText === "1") {
        buffE.children[2]?.remove();
        buffE.children[1].remove();
      } else {
        buffExist = true;
        turnLeftElement.innerText = parseInt(turnLeftElement.innerText) - 1;
      }
    }
  });
  [...document.querySelector(".malus").children].forEach((buffE) => {
    const turnLeftElement = buffE.children[0];
    const turnLeft = Math.max(0, parseInt(turnLeftElement.value) - 1);
    console.log(turnLeft);
    turnLeftElement.value = turnLeft;
    if (turnLeft >= 1) {
      buffExist = true;
    }
  });
  buttonBuffs.className = buffExist ? "" : "hide";
});

[...document.querySelector(".malus").children].forEach((buffE) => {
  buffE.children[0].addEventListener("change", (e) => {
    if (e.target.value > 0) buttonBuffs.className = "";
  });
});

[...document.querySelectorAll(".buffTurn")].forEach((buffE) => {
  buffE.addEventListener("click", () => {
    if (buffE.children.length > 1) {
      const turnLeftElement = buffE.children[1];
      if (turnLeftElement.innerText === "1") {
        buffE.children[2]?.remove();
        buffE.children[1].remove();
      } else {
        turnLeftElement.innerText = parseInt(turnLeftElement.innerText) - 1;
      }
    }
  });
});

// EQUIPEMENTS
const equipementsE = document.querySelector(".equipements");

[...equipementsE.children].forEach((equipementE) => {
  // Selected eqpt
  equipementE.children[0].addEventListener("change", (e) => {
    const newEqpt = Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) == unformatText(e.target.value));
    insertEqpt(equipementE, newEqpt);

    persoEqptsName = [...equipementsE.children].map((equipementE) => equipementE.children[0].value);
    persoEqpts = persoEqptsName.map((eqptName) =>
      Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) == unformatText(eqptName))
    );
    getAllRes(persoEqpts);
    createEquipmentSynthesis(persoEqpts);
    updateSkillsList();
  });

  // Click on eqpt element
  equipementE.addEventListener("click", (e) => {
    if (!e.target.classList.contains("nom")) {
      // If click on select element, don't show/hide the desc ?
      equipementE.children[4].classList.toggle("hide");
    }
  });
});

// selectedEqpt as an object eqpt
function insertEqpt(eqptElement, selectedEqpt) {
  // Best update 18/08/2023 (finally !) : "la casse maj/min" the case (upper/lower) now doesn't matter !
  if (!selectedEqpt) {
    eqptElement.children[1].innerText = "";
    eqptElement.children[2].innerText = "";
    eqptElement.children[3].src = "";
    eqptElement.children[3].title = "";
    eqptElement.children[4].innerText = "";
  } else {
    eqptElement.children[1].innerText = selectedEqpt.effet;
    eqptElement.children[2].innerText = selectedEqpt.montant;
    eqptElement.children[3].src = "http://voldre.free.fr/Eden/images/items/" + selectedEqpt.icone + ".png";
    eqptElement.children[3].title = selectedEqpt.desc;
    eqptElement.children[4].innerText = selectedEqpt.desc;

    // Update eqptElement 05/2024, case de PV pour monture
    if (eqptElement.children.length >= 6) {
      eqptElement.removeChild(eqptElement.children[5]);
    }

    if (selectedEqpt.effet == "Monture de Combat") {
      const pvPetE = document.createElement("input");
      pvPetE.type = "number";
      eqptElement.append(pvPetE);
    }
  }
}

//  PERSOS
const selectPerso = document.querySelector("#selectPerso");
var selectedPerso = selectPerso.value;

const archiveE = document.querySelector("#archived");

Object.entries(persosJSON).forEach(([id, perso]) => {
  const option = document.createElement("option");
  option.value = "J" + (parseInt(id) + 1);
  option.innerText = perso.nom;
  // By default, hidden archived
  option.hidden = perso.isArchived;
  selectPerso.append(option);
});
// Default new slots for new characters (limited)
[0, 1].map((i) => {
  const nbNewPersos = Object.values(persosJSON).filter((perso) => perso.joueur === undefined).length;
  if (nbNewPersos > 5) {
    toastNotification("Limite de personnages temporaires atteinte", 2000, true);
    return;
  }
  const option = document.createElement("option");
  const label = "J" + (Object.entries(persosJSON).length + i + 1);
  option.value = label;
  option.innerText = label;
  option.hidden = false;
  selectPerso.append(option);
});

archiveE.addEventListener("change", (e) => {
  onArchive(e.target.checked);
});

const onArchive = (isArchived) => {
  Object.entries(persosJSON).forEach(([id, perso]) => {
    // Hidden if isArchived is matching
    selectPerso.options[parseInt(id)].hidden = isArchived !== perso.isArchived;
  });
  archiveE.checked = isArchived;
};

//  LOADING
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("perso")) {
    selectPerso.value = "J" + urlParams.get("perso");
    // loadFiche(urlParams.get('perso'));
    selectedPerso = selectPerso.value;
    indexPerso = selectPerso.selectedIndex;
    loadFiche();
    toastNotification("Chargement réussi de " + selectedPerso);
  } else {
    indexPerso = 0;
    loadFiche();
  }

  saveButton.disabled = false;
});

selectPerso.addEventListener("change", (e) => {
  const perso = e.target.value;
  indexPerso = e.target.selectedIndex;

  loadFiche();

  const newUrl = `${window.location.origin}${window.location.pathname}?perso=${indexPerso + 1}`;
  window.history.pushState({}, perso, newUrl);
  toastNotification("Chargement réussi de " + perso);
});

function loadFiche() {
  // Define perso
  persoE.id = indexPerso;
  persoData = persosJSON[indexPerso];

  if (!persoData) return;

  console.log(`N° de ${persoData.nom} : ${indexPerso + 1}`);

  document.querySelector("#nom").value = persoData.nom;
  document.querySelector(".topleft").children[0].title = "Perso n°" + (parseInt(indexPerso) + 1);
  document.querySelector("#nom").title = "Perso n°" + parseInt(indexPerso) + 1;
  raceE.value = persoData.race;
  classePElement.value = persoData.classeP;
  classeSElement.value = persoData.classeS;

  displayArmorTypes();
  document.querySelector("#xp").value = persoData.xp;
  nivE.value = persoData.niv;

  document.querySelector("#pv").value = persoData.pv;
  pvMaxE.value = persoData.pvmax;

  document.querySelector("#stress").value = persoData.stress;

  if (persoData.stress >= 50) {
    document.querySelector("#stressImpact").innerText = "(Stats -" + Math.trunc(persoData.stress / 50) + ")";
  } else {
    document.querySelector("#stressImpact").innerText = "";
  }

  document.querySelector("#pp").src = persoData.pp;
  document.querySelector("#force").value = persoData.force;
  document.querySelector("#dexté").value = persoData.dexté;
  document.querySelector("#intel").value = persoData.intel;
  document.querySelector("#charisme").value = persoData.charisme;
  document.querySelector("#esprit").value = persoData.esprit;

  document.querySelector("#forceB").value = persoData.forceB;
  document.querySelector("#dextéB").value = persoData.dextéB;
  document.querySelector("#intelB").value = persoData.intelB;
  document.querySelector("#charismeB").value = persoData.charismeB;
  document.querySelector("#espritB").value = persoData.espritB;

  document.querySelector(".notes").value = persoData.notes;
  document.querySelector(".sticky").value = persoData.sticky ?? "";

  onArchive(persoData.isArchived);
  // Classes du perso
  var classePID = classes.indexOf(persoData.classeP);
  var classeSID = classes.indexOf(persoData.classeS);

  document.querySelector(".iconClasses").children[0].id = persoData.classeP;
  document.querySelector(".iconClasses").children[0].src =
    "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[classePID] + ".png";
  document.querySelector(".iconClasses").children[1].id = persoData.classeS;
  document.querySelector(".iconClasses").children[1].src =
    "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[classeSID] + ".png";

  // Nouveauté 27/05 : 4eme accessoire si le perso est au moins niveau 4
  if (persoData.niv >= 4) {
    equipementsE.lastElementChild.previousElementSibling.classList.remove("hide");
  } else {
    equipementsE.lastElementChild.previousElementSibling.classList.add("hide");
  }
  // Nouveauté 12/06 : 5eme accessoire au niveau 8
  if (persoData.niv >= 8) {
    equipementsE.lastElementChild.classList.remove("hide");
  } else {
    equipementsE.lastElementChild.classList.add("hide");
  }
  // Nouveauté 18/10/23 : Compétence éveillés
  [...document.querySelector(".iconClasses").children].forEach((e) => e.classList.remove("awaken"));

  defineAwaken(persoData.awaken);
  setPassif(persoData.niv >= 12);

  // Equipements du perso
  persoEqptsName = JSON.parse(persoData.eqpts);
  persoEqpts = persoEqptsName.map((eqptName) =>
    Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) == unformatText(eqptName))
  );
  persoEqpts.forEach((eqpt, index) => {
    const eqptE = [...equipementsE.children][index];
    eqptE.children[0].value = eqpt?.nom ?? "";
    insertEqpt(eqptE, eqpt);
  });

  getAllRes(persoEqpts);
  createEquipmentSynthesis(persoEqpts);

  // Skills du perso (update list après les équipements, car skills issus de l'arme "Monture de Combat")
  updateSkillsList();

  updateSkillsSlots();

  JSON.parse(persoData.skills).forEach((skill, index) => {
    var competence = [...competencesE.children][index];
    competence.children[0].value = skill;
    insertSkill(competence, skill);
  });

  // Inventaire du perso
  document.querySelector(".inventaire").value = persoData.inventaire;

  getItemsInInventory(persoData.inventaire);

  document.querySelector(".poids").innerText = poids[races.indexOf(persoData.race)];

  document.querySelector("#argent").value = persoData.argent;

  document.querySelector(".personnalité").value = persoData.personnalite;
  document.querySelector(".background").value = persoData.background;

  // Nouveauté 15/08/23 : Calcul automatique du montant des stats, 12/05/24 : Add stats repertatition
  statsVerification();
}

function statsValue(resistance) {
  return ["force", "dexté", "intel", "charisme", "esprit"].map((stat) => {
    const statMain = document.querySelector("#" + stat).value;
    const statBWithRegex = document.querySelector("#" + stat + "B").value.replace(/[^\d.+-]/g, "");

    const statsBValue = !!statBWithRegex?.match(/^[-+]\d+|\d*$/)[0]
      ? parseInt(statBWithRegex.replace("+", "").replace("-", ""))
      : 0;

    return resistance
      ? statsBValue !== 0
        ? statBWithRegex.includes("+")
          ? Math.ceil((parseInt(statMain) + statsBValue) / 2)
          : Math.ceil((parseInt(statMain) - statsBValue) / 2)
        : Math.ceil(parseInt(statMain) / 2)
      : parseInt(statMain);
  });
}
// SYNTHESE DES EQUIPEMENTS

function getAllRes(persoEqpts) {
  const resAmount = statsValue(true);

  const montantBlocP = parseEqptsByRegex(["Blocage +", "Blocage physique +"], persoEqpts, persoData).reduce(sum, 0);
  const montantEsq = parseEqptsByRegex(["Esquive +"], persoEqpts, persoData).reduce(sum, 0);
  const montantBlocM = parseEqptsByRegex(["Blocage +", "Blocage magique +"], persoEqpts, persoData).reduce(sum, 0);
  const montantRes = parseEqptsByRegex(["Résistance d'esprit +"], persoEqpts, persoData).reduce(sum, 0);

  document.querySelector("#resForce").innerText = `Bloc ${resAmount[0]} ${montantBlocP ? `+ ${montantBlocP}` : ""}`;
  document.querySelector("#resDexté").innerText = `Esq ${resAmount[1]} ${montantEsq ? `+ ${montantEsq}` : ""}`;
  document.querySelector("#resIntel").innerText = `Bloc ${resAmount[2]} ${montantBlocM ? `+ ${montantBlocM}` : ""}`;
  document.querySelector("#resEsprit").innerText = `Res ${resAmount[4]} ${montantRes ? `+ ${montantRes}` : ""}`;
}

function createEquipmentSynthesis(persoEqpts) {
  const eqptSynthesisE = document.querySelector(".equipements-synthese");
  eqptSynthesisE.innerHTML = "";

  let accessValues = [];

  synthesisCategories.forEach((category) => {
    const eqptsValueList = parseEqptsByRegex(category.regex, persoEqpts, persoData);
    // console.log("eqptsValueList", eqptsValueList);
    const eqptsValue = eqptsValueList.reduce(sum, 0);

    // 01/06/2024 : Get category over the defined limit for accessories (exclude passif)
    accessValues.push({
      label: category.label,
      value: sumEqptsAsAccess(category.regex, persoEqpts, persoData),
    });

    if (!eqptsValue || eqptsValue === 0) return;

    let categoryValue;
    if (category.label === "DGT" && eqptsValueList[2]) {
      categoryValue = `${eqptsValue - eqptsValueList[2]} | ${eqptsValue - eqptsValueList[0] - eqptsValueList[1]}`;
    } else {
      categoryValue = eqptsValue;
    }

    const synthesisCategoryE = document.createElement("div");
    synthesisCategoryE.className = "synthese";

    const categoryValueE = document.createElement("p");
    categoryValueE.innerText = categoryValue;

    let categoryHeaderE;
    if (category.img) {
      categoryHeaderE = document.createElement("img");
      categoryHeaderE.src = encodeURI(`images/layout/${category.label}.png`);
      categoryHeaderE.title = category.label;
    } else {
      categoryHeaderE = document.createElement("p");
      categoryHeaderE.innerText = category.label;
    }

    synthesisCategoryE.append(categoryHeaderE, categoryValueE);
    eqptSynthesisE.append(synthesisCategoryE);
  });

  // 01/06/2024 : Display category over the defined limit for accessories
  statsCategories.forEach((category) => {
    accessValues.push({
      label: category.label,
      value: sumEqptsAsAccess(category.regex, persoEqpts, persoData),
    });
  });

  const montantBlocP = sumEqptsAsAccess(["Blocage +", "Blocage physique +"], persoEqpts, persoData);
  const montantEsq = sumEqptsAsAccess(["Esquive +"], persoEqpts, persoData);
  const montantBlocM = sumEqptsAsAccess(["Blocage +", "Blocage magique +"], persoEqpts, persoData);
  const montantRes = sumEqptsAsAccess(["Résistance d'esprit +"], persoEqpts, persoData);

  const degatPM = accessValues
    .filter((v) => ["DGT", "P", "M"].includes(v.label))
    .map((v) => v.value)
    .reduce(sum, 0);
  const degatElems = accessValues.filter((v) => elements.map((e) => unformatText(e)).includes(v.label));

  console.log(accessValues);

  const accesLimitsByCategory = [
    { label: "Dégât (P/M)", limit: 6, value: degatPM },
    ...degatElems.map((degatElem) => ({
      label: `Dégât (P+M) + ${degatElem.label}`,
      limit: 8,
      value: degatPM + degatElem.value,
    })),
    { label: "Soin", limit: 6, value: accessValues.find((v) => v.label === "S").value },
    ...statsCategories.map((category) => ({
      label: category.label,
      limit: 2,
      value: accessValues.find((v) => v.label === category.label).value,
    })),
    { label: "Armure", limit: 5, value: accessValues.find((v) => v.label === "ARM").value },
    { label: "Blocage physique", limit: 3, value: montantBlocP },
    { label: "Esquive", limit: 3, value: montantEsq },
    { label: "Blocage magique", limit: 3, value: montantBlocM },
    { label: "Résistance d'esprit", limit: 3, value: montantRes },
  ];
  // console.log(accesLimitsByCategory);
  const eqptOverLimits = accesLimitsByCategory.filter((category) => category.value > category.limit);
  errorEqptE.innerText = eqptOverLimits.length ? "/!\\ Des montants dépassent les limites" : "";

  if (eqptOverLimits) {
    errorEqptE.addEventListener("click", () => showEqptErrors(eqptOverLimits));
  }
}

function showEqptErrors(eqptOverLimits) {
  const dialog = document.querySelector("dialog");
  dialog.innerText = "La somme des montants des accessoires sont trop élevés sur les catégories suivantes :";
  const listE = document.createElement("ul");
  eqptOverLimits.map((eqptLimit) => {
    const limitE = document.createElement("li");
    limitE.innerText = `${eqptLimit.label} : ${eqptLimit.value} > ${eqptLimit.limit}`;
    listE.append(limitE);
  });
  dialog.append(listE);

  // Bouton de fermeture
  const closeE = document.createElement("button");
  closeE.id = "close";
  closeE.innerText = "Fermer";
  closeE.addEventListener("click", () => {
    dialog.close();
  });
  dialog.append(closeE);

  dialog.showModal();
}

//  DOWNLOAD as FILE
// Function to download data to a file
document.querySelector("#download").addEventListener("click", () => {
  download(JSON.stringify(persosJSON[persoE.id]), selectedPerso + ".json", "text/plain");
});

function download(data, filename, type) {
  var xhReq = new XMLHttpRequest();

  xhReq.open("POST", "http://voldre.free.fr/Eden/" + filename, true);
  xhReq.send(data);

  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
// Download as screenshot under body
/*
document.querySelector("#screenshot").addEventListener('click',() =>{
    html2canvas(document.querySelector('.perso')).then(function(canvas) {
    // Export the canvas to its data URI representation
    var base64image = canvas.toDataURL("image/png");

    // Open the image in a new window
    // window.open(base64image , "_blank");
    var screenshot = document.createElement('img');
    screenshot.src = "data:"+base64image;
    // screenshot.classList.add('screen');
    document.body.append(screenshot)
    });
});
*/

// PROFIL PICTURE

// Change Profil Picture
document.querySelector("#pp").addEventListener("click", () => {
  // console.log('pp clicked')
  document.querySelector("#galerie").classList.toggle("hide");
});
document.querySelector("#galerie").addEventListener("click", () => {
  document.querySelector(".galerie").classList.remove("hide");
});

// Fill galery
galeryJSON.forEach((pic) => {
  if (pic.includes(".jpg") || pic.includes(".png") || pic.includes(".webp")) {
    var imgE = document.createElement("img");
    imgE.src = "./images/jdrgalerie/" + pic;
    document.querySelector(".galerie").append(imgE);
  }
});

// Choosed picture
document.querySelector(".galerie").addEventListener("click", (e) => {
  if (!e.target.src) {
    document.querySelector(".galerie").classList.add("hide");
    return;
  }
  if (e.target.src.includes(".jpg") || e.target.src.includes(".png")) {
    document.querySelector("#pp").src = e.target.src;
    document.querySelector(".galerie").classList.add("hide");
    document.querySelector(".galerie").classList.add("hide");
  }
});

// ALL SAVE

// Save persos
const saveButton = document.querySelector("#save");

saveButton.addEventListener("click", () => {
  if (!masterJSON.allow) {
    toastNotification("Les sauvegardes sont bloquées par le MJ");
    return;
  }
  const cookiePerso = savePerso();
  // Save to JSON...
  // Only store persosJSON current user (perso id)
  if (!cookiePerso) {
    toastNotification("Erreur : ID Perso ou Nom invalide", 4000, true);
    return;
  }
  console.log(cookiePerso.length);
  document.cookie = cookiePerso;
  if (cookiePerso.length < 4000) {
    document.cookie = cookiePerso;
    callPHP({ action: "saveFile", name: "persos" });
    toastNotification("Sauvegarde effectuée");
  } else {
    toastNotification("ECHEC : Plus de place disponible sur la fiche !", 10000, true);
  }
});

function savePerso() {
  const skillsName = [...competencesE.children].map((competenceE) => competenceE.children[0].value);

  const persoId = persoE.id;
  const name = document.querySelector("#nom").value;

  if (!persoId || persoId < 0 || !name) return null;

  persosJSON[persoId] = {
    nom: name,
    race: raceE.value,
    classeP: classePElement.value,
    classeS: classeSElement.value,
    xp: document.querySelector("#xp").value,
    niv: nivE.value,

    awaken: nivE.value >= 10 ? awakenSkillE.id : "",

    pv: document.querySelector("#pv").value,
    pvmax: pvMaxE.value,

    stress: document.querySelector("#stress").value,

    pp: document.querySelector("#pp").src,
    force: document.querySelector("#force").value,
    dexté: document.querySelector("#dexté").value,
    intel: document.querySelector("#intel").value,
    charisme: document.querySelector("#charisme").value,
    esprit: document.querySelector("#esprit").value,

    forceB: document.querySelector("#forceB").value,
    dextéB: document.querySelector("#dextéB").value,
    intelB: document.querySelector("#intelB").value,
    charismeB: document.querySelector("#charismeB").value,
    espritB: document.querySelector("#espritB").value,

    skills: JSON.stringify(skillsName),
    eqpts: JSON.stringify(persoEqptsName),
    inventaire: document.querySelector(".inventaire").value,
    argent: document.querySelector("#argent").value,
    personnalite: document.querySelector(".personnalité").value,
    background: document.querySelector(".background").value,
    notes: document.querySelector(".notes").value,
    sticky: document.querySelector(".sticky").value,
    passif12: persosJSON[persoId]?.passif12 ?? undefined,
    isArchived: persosJSON[persoId]?.isArchived ?? false,
    joueur: persosJSON[persoId]?.joueur ?? null,
  };

  console.log(persosJSON);

  const newPerso = {};
  newPerso[persoId] = persosJSON[persoId];
  console.log(newPerso);

  const newPersoEncoded = JSON.stringify(newPerso).replaceAll("+", "%2B").replaceAll(";", "%3B");
  // encodeURIComponent(JSON.stringify(newPerso))
  const cookiePerso = "persosJSON=" + newPersoEncoded + "; SameSite=Strict";

  return cookiePerso;
}

// Global Save

callPHP({ action: "jdrGalerie" });

// Show/Hide other pages of Eden
var buttonIframe = document.querySelector("#buttonIframe");
buttonIframe.addEventListener("click", () => {
  if (buttonIframe.innerText == "Afficher le site") {
    buttonIframe.innerText = "Masquer le site";
  } else {
    buttonIframe.innerText = "Afficher le site";
  }
  document.querySelector("iframe").classList.toggle("hide");
});

function syntheseDesc() {
  let description =
    "La synthèse résume les montants de dégâts et d'armures issus des équipements.<br/> Les montants conditionnels (panoplie, classe, ...) sont pris en compte (07/04/24), voici la légende :<br/>";
  synthesisCategories.forEach((category) => {
    if (category.img) {
      description +=
        "<br/><img src='http://voldre.free.fr/Eden/images/layout/" +
        category.label +
        ".png'/> = Dégât de " +
        category.label;
    } else {
      description += `<br/>${category.label} : ${category.regex[0].replace("+", "").replace("Soin", "Soin effectué")}`;
    }
  });
  return description;
}

const labelsDescription = {
  force:
    "Permet d'utiliser des attaques lourdes, de pousser, de soulever.<br/>Si la stat est à 1 ou 2 : Impossible de tenir une arme. <br/>Permet de bloquer des coups physiques (Dé/2)<br/><br/> Un blocage à 20 inflige 5 dégâts de plus. <br/>Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.<br/>Le blocage est limité à 13.",
  dexté:
    "Permet d'utiliser des attaques agiles et rapide, de se mouvoir, courir.<br/>Si la stat est à 1 ou 2 : Impossible de bouger. <br/>Permet d'esquiver des attaques mono-cible (Dé/2) et quelques AoE selon le contexte (voir Infos JDR).<br/><br/> Une esquive à 20 inflige 5 dégâts de plus. <br/> Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.<br/>L'esquive est limité à 13.",
  intel:
    "Permet d'utiliser des attaques magiques, de tester son érudition, sa réflexion.<br/>Si la stat est à 1 ou 2 : Impossible de réfléchir, action directe. <br/>Permet de bloquer des coups magiques (Dé/2)<br/><br/> Un blocage à 20 inflige 5 dégâts de plus.<br/> Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.<br/>Le blocage est limité à 13.",
  charisme:
    "Permet d'intéragir avec les autres personnes dans différents contexte :<br/> éloquence, persuasion, négociation, menace, distraction, ... <br/><br/> Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.",
  esprit:
    "Permet d'utiliser des buffs, des débuffs et des invocations.<br/> Permet aussi de résister (Dé/2) à des envoûtements (contrôle d'esprit, peur) <br/><br/> Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.<br/>La résistance est limitée à 13.",
  niv: "Augmente automatiquement tous les 100 points d'expériences du Niveau 1 à 5, puis tous les 150 de 6 à 10, puis 200.<br/> Tous les niveaux paire (2,4,6,8), vous obtenez une compétence.<br/> Au Niveau 5 vous avez +1 en Esprit.<br/> Au Niveau 10 et 15, c'est +1 où vous voulez.",
  pv: "Statistique des PV, augmente de 5 par niveau.",
  stress:
    'Fatigue/Stress max : 200%. Chaque 50%, les stats diminue de 1 (4 max).<br/> La fatigue s\'accumule au fur et à mesures des combats (sauf tour des cieux). Le stress uniquement dans les zones dédiées.<br/><br/>Le stress "accentué" augmente de 50%, la "réduction" diminue de 33%.',
  infoEQPT:
    "Changer d'arme en combat (si équipée) se fait en début de tour (action instantanée).<br/>Sinon, échanger d'arme ou d'accessoire prend 1 tour.<br/><br/>Porter une armure non adapté (magique, léger, lourd) implique des malus de stats (voir page \"Infos JDR\", section \"Armure\").<br/><br/>Le montant total de l'ensemble des stuffs est limité : +2 de montant des buffs, +1 durée des buffs, -1 durée des malus, et +50% PV soin reçu.<br/><br/>Le montant fixe total (hors %) des accessoires est limité : +2 par stat, +3 blocage/esquive, pour les soins (infligé, reçu) : 6, pour les dégâts infligés : 6 (+2 si bonus élémentaire) et dégâts reçu : 5",
  //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
  synthese: syntheseDesc(),
  passif12:
    'Le passif niveau 12 consiste en un ajout de montant de stats.<br/>Vous avez 4 points à répartir dans les montants suivant (max 2 points par montant) :<br/>1 point :<ul><li>Dégât +1</li><li>Soin +1</li><li>Armure +1</li><li>PV +5</li><li>Familier : Dégât et Soin +1</li></ul>2 points :<ul><li>Blocage Physique +1</li><li>Esquive +1</li><li>Blocage Magique +1</li><li>Résistance d\'esprit +1</li><li>Montant des buffs +1</li><li>Durée des buffs +1</li><li>Une statistique +1</li></ul><span style="color: lightcoral;">/!\\ Attention : vous ne pourrez plus facilement changer votre passif après avoir choisi !</span><br/>A noter : ces montants ne comptent pas dans la limite des stuffs (voir "Equipements - Infos")',
};

initDialog(labelsDescription);

// Display information about all basic stats of the character (race, class, level)

const infoStatsE = document.querySelector("#infoStats");

infoStatsE.addEventListener("click", () => {
  // Calculation of all stats
  const niv = nivE.value;
  const { sumStats, allStats, pvStuff } = getStats();

  const dialog = document.querySelector("dialog");
  // Reset dialog
  dialog.innerText = "";
  dialog.style.width = "75%";

  const globalE = document.createElement("p");
  globalE.className = "dialogStats";

  const titleE = document.createElement("h2");
  titleE.innerText = "Statistique de référence";
  globalE.append(titleE);

  const pv = document.createElement("p");
  pv.innerText = `PV : ${allStats.PVMax} = ${allStats.PV} (base) + ${5 * (niv - 1)} (niveau) + ${pvStuff} (stuff)`;
  globalE.append(pv);

  // Count stats over 17
  let statOver = 0;

  const statsE = document.createElement("div");
  statsE.className = "stats";
  statistiques.map((statName) => {
    const statNameE = document.createElement("p");
    statNameE.innerText = statName;

    const statE = document.createElement("div");
    statE.className = "stat";

    const over = Math.max(allStats[statName] - 17, 0);
    statOver += over;

    statE.append(statNameE, `${allStats[statName]}${over > 0 ? ` (-${over})` : ""}`);
    statsE.append(statE);
  });

  globalE.append(statsE);

  const nbStatsToChoose = 60 - sumStats + Math.max(Math.ceil((niv - 9) / 5), 0);
  const nivInfo = document.createElement("p");
  nivInfo.innerText = `+ ${nbStatsToChoose + statOver} stat(s) au choix, car niveau ${niv}`;
  globalE.append(nivInfo);
  if (60 - sumStats > 1) {
    const classWithPointsToChoose = document.createElement("p");
    classWithPointsToChoose.innerText = "L'ingénieur et le Chevalier Dragon ont chcaun 1 point en plus à répartir";
    globalE.append(classWithPointsToChoose);
  }

  // Bouton de fermeture
  const closeE = document.createElement("button");
  closeE.id = "close";
  closeE.innerText = "Fermer";
  closeE.addEventListener("click", () => {
    dialog.close();
  });
  globalE.append(closeE);

  dialog.append(globalE);
  // Ouverture en "modal"
  dialog.showModal();
});

const getStats = () => {
  const race = raceE.value;
  const classeP = classePElement.value;
  const classeS = classeSElement.value;
  const niv = nivE.value;

  const classesStats = statsJSON.classes.filter((e) => [classeP, classeS].includes(e.Classe));
  const raceStats = statsJSON.races.find((e) => e.Race === race);

  const pvStuff = parseEqptsByRegex(["PV +"], persoEqpts, persoData).reduce(sum, 0);

  const allStats = sumObjectsByKey(classesStats[0], classesStats[1] ?? classesStats[0], raceStats);

  const sumStats =
    allStats["Force"] +
    allStats["Dextérité"] +
    allStats["Intelligence"] +
    allStats["Charisme"] +
    (allStats["Esprit"] - 2);

  // Esprit is "- 1" under level 5
  allStats.Esprit += niv < 5 ? -1 : 0;
  allStats.PVMax = allStats.PV + 5 * (niv - 1) + pvStuff;

  return { sumStats, allStats, pvStuff };
};

function sumObjectsByKey(...objs) {
  return objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
}

function setPassif(isAvailable) {
  const passif12E = document.querySelector("#passif12");
  passif12E.innerHTML = "";

  const li = document.createElement("li");

  li.innerText =
    "Passif 12 " +
    (persosJSON[persoE.id].passif12
      ? ": " + persosJSON[persoE.id].passif12
      : "à définir : 4 points à répartir (cliquez)");
  passif12E.classList = isAvailable ? "" : "hide";
  passif12E.append(li);
}

const getCards = Object.values(cardJSON)
  .filter((card) => card.kind === "composant")
  .map((card) => ({
    title: card.name,
    desc: card.description,
    montant: "",
    src: `http://voldre.free.fr/Eden/images/items/${card.kindId}.png`,
  }));

const getEqpts = Object.values(eqptJSON).map((eqpt) => ({
  title: eqpt.nom,
  desc: eqpt.desc,
  montant: eqpt.montant,
  effet: eqpt.effet,
  src: `http://voldre.free.fr/Eden/images/items/${eqpt.icone}.png`,
}));

const allItems = [...getCards, ...getEqpts];

const dialog = document.querySelector("dialog");

// Display items in the inventory
const getItemsInInventory = (inventory) => {
  const inventoryUnformated = unformatText(inventory).replaceAll("bombes", "bombe").replaceAll("potions", "potion");

  const itemsInInventory = allItems.filter((item) => isTextInText(inventoryUnformated, item.title));

  const eqptsName = [...equipementsE.children].map((competenceE) => unformatText(competenceE.children[0].value));

  const itemsE = document.querySelector(".items");
  itemsE.innerHTML = "";

  itemsInInventory.map((item) => {
    const imgE = document.createElement("img");
    imgE.src = item.src;
    imgE.title = item.title + "\n" + item.desc + "\n" + item.montant;

    // Highlight equipments equipped
    if (eqptsName.find((eqptName) => isTextInText(eqptName, item.title))) imgE.style.borderColor = "goldenrod";

    imgE.addEventListener("click", () => {
      dialog.innerText = "";

      const headerE = document.createElement("div");
      headerE.className = "itemHeader";
      headerE.append(imgE.cloneNode());
      const title = document.createElement("h2");
      title.innerText = item.title;
      headerE.append(title);

      dialog.append(headerE);

      const desc = document.createElement("p");
      desc.innerText = item.desc;
      dialog.append(desc);

      if (item.montant) {
        const montant = document.createElement("p");
        montant.innerText = item.montant;
        dialog.append(montant);
        const effet = document.createElement("p");
        effet.innerText = item.effet;
        dialog.append(effet);
      }

      // fermeture
      const closeE = document.createElement("button");
      closeE.id = "close";
      closeE.innerText = "Fermer";
      closeE.addEventListener("click", () => {
        dialog.close();
      });
      dialog.append(closeE);

      dialog.showModal();
    });

    itemsE.append(imgE);
  });
};

document.querySelector(".inventaire").addEventListener("change", (e) => getItemsInInventory(e.target.value));
