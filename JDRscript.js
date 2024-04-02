import { skillsJSON, skillsAwakenJSON, eqptJSON, persosJSON, galeryJSON, masterJSON } from "./JDRstore";
import { callPHP, toastNotification, initDialog, parseEqptsByRegex, unformatText } from "./utils";

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
  return { regex: [` ${element} +`], label: labelElement, img: true };
});

const synthesisCategories = [
  { regex: ["Dégât +"], label: "DGT", img: false },
  { regex: ["Faiblesse +"], label: "F", img: false },
  { regex: ["Soin +"], label: "S", img: false },
  { regex: ["Dégât physique +"], label: "P", img: false },
  ...elementsCategories.slice(0, 3),
  { regex: ["Dégât magique +"], label: "M", img: false },
  ...elementsCategories.slice(3),
  { regex: ["Dégât -", "Dégât reçu -"], label: "ARM", img: false },
];

// RACES
document.querySelector("#race").addEventListener("change", (e) => {
  document.querySelector(".poids").innerText = poids[races.indexOf(e.target.value)];
});

// CLASSES
document.querySelectorAll('[id^="classe"]').forEach((classeElem, i) => {
  ["", ...classes].forEach((classe) => {
    const option = document.createElement("option");
    option.value = classe;
    option.innerText = classe;
    classeElem.append(option);
  });

  classeElem.addEventListener("change", (e) => {
    var selectedClasseID = classes.indexOf(e.target.value);
    if (selectedClasseID == -1) {
      console.log(e.target.value + " is not a class (in the list)");
      document.querySelector(".iconClasses").children[i].src = "";
    } else {
      document.querySelector(".iconClasses").children[i].src =
        "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[selectedClasseID] + ".png";

      updateSkillsList();
    }
  });
});

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

function defineAwaken(classe = "undefined") {
  document.querySelector(".awakenSkill").classList.add("hide");

  const stuffsName = [...equipementsE.children].map((eqpt) => eqpt.children[0].value.toLowerCase());
  if (
    classe === "undefined" ||
    classe === "" ||
    (document.querySelector("#niv").value < 10 && !stuffsName.includes("pistolet suspect"))
  )
    return;

  document.querySelector(".awakenSkill").classList.remove("hide");

  const niv = document.querySelector("#niv").value;

  var nbUse;
  if (niv >= 15) {
    nbUse = 3;
  } else if (niv >= 12) {
    nbUse = 2;
  } else {
    nbUse = 1;
  }

  const awakenSkillE = document.querySelector(".awakenSkill");
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

  const indexPerso = document.querySelector(".perso").id;
  const persoData = persosJSON[indexPerso];

  JSON.parse(persoData.skills).forEach((skill, index) => {
    var competence = [...competencesE.children][index];
    competence.children[0].value = skill;
    insertSkill(competence, skill, awakenClass);
  });
});

// Niv
document.querySelector("#xp").addEventListener("change", (e) => {
  var xp = parseInt(e.target.value);
  var niv;
  // Update 02/04/24 : From lvl 10 to 15 : 200 xp instead of 150
  // Update 12/06/23 : From lvl 5 to 10 : 150 xp instead of 100
  if (xp >= 1150) {
    niv = Math.trunc((xp - 1150) / 200) + 10;
  } else if (xp >= 400) {
    niv = Math.trunc((xp - 400) / 150) + 5;
  } else {
    niv = Math.trunc(xp / 100) + 1;
  }
  document.querySelector("#niv").value = niv;

  updateSkillsSlots();

  // Nouveauté 15/08 : Calcul automatique du montant des stats
  statsVerification(niv);

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
});

// Nouveauté 15/08 : Calcul automatique du montant des stats
function statsVerification(niv) {
  const sommeStats = statsValue(false).reduce((a, b) => a + b);
  var statsRequired = 61 + Math.trunc(parseInt(niv) / 5);
  if (sommeStats !== statsRequired) {
    document.querySelector("#errorStat").innerText =
      " - Attention, vos points de stats ne sont pas bon : " + sommeStats + ", attendu : " + statsRequired;
  } else {
    document.querySelector("#errorStat").innerText = "";
  }
}
document.querySelector(".stats").addEventListener("change", (e) => {
  if (parseInt(e.target.value) > parseInt(e.target.max)) e.target.value = e.target.max;

  statsVerification(document.querySelector("#niv").value);

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
    var niv = document.querySelector("#niv").value || 1;
    var SlotsAvailable = Math.trunc(niv / 2) + 3; // Update 17/05/23, 3 au lieu de 2, car 4 skills sur ~ 12-13 possibles
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
    var selectedOption = competence.children[0].value;
    removeOptions(competence.children[0]);
    var option = document.createElement("option");
    option.value = "";
    competence.children[0].append(option);

    var classeP = document.querySelector("#classeP").value;
    var classeS = document.querySelector("#classeS").value;
    Object.values(skillsJSON).forEach((skill) => {
      if (skill.classe.includes(classeP) || skill.classe.includes(classeS)) {
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

    const skillDesc = selectedAwakenSkill?.desc || selectedSkill.desc;
    const skillMontant = selectedAwakenSkill?.montant || selectedSkill.montant;

    const skillRange = selectedSkill.effet.split("AoE ")[1] ?? null; // en bas [0] + "AoE"
    const selectedSkillEffet = skillRange ? selectedSkill.effet.split(" AoE")[0] : selectedSkill.effet;
    skillElement.children[1].innerText = selectedSkillEffet;

    if (skillRange) {
      const skillRangeIconE = document.createElement("span");
      skillRangeIconE.className = "skillRangeIcon";
      skillRangeIconE.style.backgroundImage = `url(http://voldre.free.fr/Eden/images/layout/${skillRange}.png)`;

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
    if (skillElement.children.length >= 6) {
      skillElement.removeChild(skillElement.children[5]);
    }

    if (selectedSkill.effet == "Invocation") {
      var pvPetE = document.createElement("input");
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
    insertEqpt(equipementE, e.target.value);
    const eqptsName = [...equipementsE.children].map((equipementE) => equipementE.children[0].value);
    const persoEqpts = eqptsName.map((eqptName) =>
      Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) == unformatText(eqptName))
    );
    getAllRes(persoEqpts);
    createEquipmentSynthesis(persoEqpts);
  });

  // Click on eqpt element
  equipementE.addEventListener("click", (e) => {
    if (!e.target.classList.contains("nom")) {
      // If click on select element, don't show/hide the desc ?
      equipementE.children[4].classList.toggle("hide");
    }
  });
});

function insertEqpt(eqptElement, eqptName) {
  // Best update 18/08/2023 (finally !) : "la casse maj/min" the case (upper/lower) now doesn't matter !
  var selectedEqpt = Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) == unformatText(eqptName));
  if (!selectedEqpt) {
    if (eqptName != "") {
      console.log(eqptName + " is not an eqpt (in the list)");
    }
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
  }
}

//  LOADING
const selectPerso = document.querySelector("#selectPerso");
var selectedPerso = selectPerso.value;
var selectedID = selectPerso.selectedIndex;

window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("perso")) {
    selectPerso.value = "J" + urlParams.get("perso");
    // loadFiche(urlParams.get('perso'));
    selectedPerso = selectPerso.value;
    selectedID = selectPerso.selectedIndex;
  }
  loadFiche(selectedID);
});
selectPerso.addEventListener("change", (e) => {
  var perso = e.target.value;
  var indexPerso = e.target.selectedIndex;

  loadFiche(indexPerso);

  toastNotification("Chargement réussi de " + perso);
});

function loadFiche(indexPerso) {
  document.querySelector(".perso").id = indexPerso;

  const persoData = persosJSON[indexPerso];

  if (!persoData) return;

  console.log(`N° de ${persoData.nom} : ${indexPerso + 1}`);

  document.querySelector("#nom").value = persoData.nom;
  document.querySelector(".topleft").children[0].title = "Perso n°" + (parseInt(indexPerso) + 1);
  document.querySelector("#nom").title = "Perso n°" + parseInt(indexPerso) + 1;
  document.querySelector("#race").value = persoData.race;
  document.querySelector("#classeP").value = persoData.classeP;
  document.querySelector("#classeS").value = persoData.classeS;
  document.querySelector("#xp").value = persoData.xp;
  document.querySelector("#niv").value = persoData.niv;

  document.querySelector("#pv").value = persoData.pv;
  document.querySelector("#pvmax").value = persoData.pvmax;

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

  // Classes du perso
  var classePID = classes.indexOf(persoData.classeP);
  var classeSID = classes.indexOf(persoData.classeS);

  document.querySelector(".iconClasses").children[0].id = persoData.classeP;
  document.querySelector(".iconClasses").children[0].src =
    "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[classePID] + ".png";
  document.querySelector(".iconClasses").children[1].id = persoData.classeS;
  document.querySelector(".iconClasses").children[1].src =
    "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[classeSID] + ".png";
  updateSkillsList();

  updateSkillsSlots();

  // Nouveauté 15/08 : Calcul automatique du montant des stats
  statsVerification(persoData.niv);

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

  // Skills du perso
  JSON.parse(persoData.skills).forEach((skill, index) => {
    var competence = [...competencesE.children][index];
    competence.children[0].value = skill;
    insertSkill(competence, skill);
  });

  // Equipements du perso
  const persoEqptsName = JSON.parse(persoData.eqpts);
  persoEqptsName.forEach((eqpt, index) => {
    const eqptE = [...equipementsE.children][index];
    eqptE.children[0].value = eqpt;
    insertEqpt(eqptE, eqpt);
  });

  const persoEqpts = persoEqptsName.map((eqptName) =>
    Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) == unformatText(eqptName))
  );
  getAllRes(persoEqpts);
  createEquipmentSynthesis(persoEqpts);

  // Inventaire du perso
  document.querySelector(".inventaire").value = persoData.inventaire;

  document.querySelector(".poids").innerText = poids[races.indexOf(persoData.race)];

  document.querySelector("#argent").value = persoData.argent;

  document.querySelector(".personnalité").value = persoData.personnalite;
  document.querySelector(".background").value = persoData.background;
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

  const montantBlocP = parseEqptsByRegex(["Blocage +", "Blocage physique +"], persoEqpts).reduce((a, b) => a + b);
  const montantEsq = parseEqptsByRegex(["Esquive +"], persoEqpts).reduce((a, b) => a + b);
  const montantBlocM = parseEqptsByRegex(["Blocage +", "Blocage magique +"], persoEqpts).reduce((a, b) => a + b);
  const montantRes = parseEqptsByRegex(["Résistance d'esprit +"], persoEqpts).reduce((a, b) => a + b);

  document.querySelector("#resForce").innerText = `Bloc ${resAmount[0]} ${montantBlocP ? `+ ${montantBlocP}` : ""}`;
  document.querySelector("#resDexté").innerText = `Esq ${resAmount[1]} ${montantEsq ? `+ ${montantEsq}` : ""}`;
  document.querySelector("#resIntel").innerText = `Bloc ${resAmount[2]} ${montantBlocM ? `+ ${montantBlocM}` : ""}`;
  document.querySelector("#resEsprit").innerText = `Res ${resAmount[4]} ${montantRes ? `+ ${montantRes}` : ""}`;
}

function createEquipmentSynthesis(persoEqpts) {
  const eqptSynthesisE = document.querySelector(".equipements-synthese");
  eqptSynthesisE.innerHTML = "";

  synthesisCategories.forEach((category) => {
    const eqptsValueList = parseEqptsByRegex(category.regex, persoEqpts);

    const eqptsValue = eqptsValueList.reduce((total, item) => total + item, 0);

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
}

//  DOWNLOAD as FILE
// Function to download data to a file
document.querySelector("#download").addEventListener("click", () => {
  download(JSON.stringify(persosJSON[document.querySelector(".perso").id]), selectedPerso + ".json", "text/plain");
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

document.querySelector("#save").addEventListener("click", () => {
  if (!masterJSON.allow) {
    toastNotification("Les sauvegardes sont bloquées par le MJ");
    return;
  }
  const cookiePerso = savePerso();
  // Save to JSON...
  // Only store persosJSON current user (perso id)
  console.log(cookiePerso.length);
  document.cookie = cookiePerso;
  if (cookiePerso.length < 4000) {
    document.cookie = cookiePerso;
    callPHP({ action: "saveFile", name: "persos" });
    toastNotification("Sauvegarde effectuée");
  } else {
    toastNotification("ECHEC : Plus de place disponible sur la fiche !", 10000);
  }
});

function savePerso() {
  const skillsName = [...competencesE.children].map((competenceE) => competenceE.children[0].value);

  const eqptsName = [...equipementsE.children].map((competenceE) => competenceE.children[0].value);

  persosJSON[document.querySelector(".perso").id] = {
    nom: document.querySelector("#nom").value,
    race: document.querySelector("#race").value,
    classeP: document.querySelector("#classeP").value,
    classeS: document.querySelector("#classeS").value,
    xp: document.querySelector("#xp").value,
    niv: document.querySelector("#niv").value,

    awaken: document.querySelector(".awakenSkill").id,

    pv: document.querySelector("#pv").value,
    pvmax: document.querySelector("#pvmax").value,

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
    eqpts: JSON.stringify(eqptsName),
    inventaire: document.querySelector(".inventaire").value,
    argent: document.querySelector("#argent").value,
    personnalite: document.querySelector(".personnalité").value,
    background: document.querySelector(".background").value,
    notes: document.querySelector(".notes").value,
    sticky: document.querySelector(".sticky").value,
  };

  console.log(persosJSON);

  const newPerso = {};
  newPerso[document.querySelector(".perso").id] = persosJSON[document.querySelector(".perso").id];
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
    "La synthèse résume les montants de dégâts et d'armures issus des équipements.<br/> Attention, cela ne prend pas en compte les montants conditionnels (si panoplie, classe), voici la légende :<br/>";
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
    "Changer d'arme en combat se fait en début de tour (action instantanée). <br/><br/>Porter une armure non adapté (magique, léger, lourd) n'est pas possible. Sauf si gros malus (malus de stats, ...).<br/><br/>Le montant fixe total de l'ensemble des stuffs est limité : +2 de montant des buffs et +1 durée des buffs.<br/><br/>Le montant fixe total (hors %) des accessoires est limité : +2 par stat, +3 blocage/esquive, pour les soins (infligé, reçu) : 6, pour les dégâts infligés : 6 (+2 si bonus élémentaire) et dégâts reçu : 5",
  //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
  synthese: syntheseDesc(),
};

initDialog(labelsDescription);
