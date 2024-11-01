import {
  skillsJSON,
  eqptJSON,
  masterJSON,
  enemyJSON,
  enemyGenericJSON,
  statsJSON,
  persosJSON,
  getData,
} from "./JDRstore.js";
import {
  callPHP,
  createElement,
  eventOnClick,
  fillSelectOptions,
  isTextInText,
  setCookie,
  toastNotification,
  unformatText,
} from "./utils.js";

const logged = !!document.querySelector(".admin");

// Show/Hide other pages of Eden
const buttonIframe = document.querySelector("#buttonIframe");
buttonIframe?.addEventListener("click", () => {
  if (buttonIframe.innerText === "Afficher le site") {
    buttonIframe.innerText = "Masquer le site";
  } else {
    buttonIframe.innerText = "Afficher le site";
  }
  document.querySelector("iframe").classList.toggle("hide");
});

let allSlots;
function updateSlots() {
  const enemiesList = [...document.querySelectorAll(".infoEnnemi")].filter(
    (infoE) => infoE.querySelector("#pvmax").value !== ""
  );
  const persosList = [...document.querySelectorAll(".perso")].filter((persoE) => persoE.children[0].value !== "");
  allSlots = [...enemiesList, ...persosList];
}

// Enemies Select Options
[...document.querySelectorAll(".ennemi")].forEach((selectEnnemiE) => {
  const allowedEnnemiesPart = ["Veyda", "Champi Baga"];

  const options = [
    { value: 0, innerText: "" },
    ...Object.entries(enemyJSON)
      .filter(
        // If logged : take all, else : take allowed enemies
        ([_, enemy]) => logged || allowedEnnemiesPart.some((enemyPart) => enemy.nom.includes(enemyPart))
      )
      .map(([index, enemy]) => ({
        value: index,
        innerText: enemy.nom,
      })),
  ];

  fillSelectOptions(selectEnnemiE, options);

  // Change enemy selected

  selectEnnemiE.addEventListener("change", (e) => {
    loadEnemy(e.target.value, selectEnnemiE.closest(".infoEnnemi"));
    toastNotification(`Chargement de l'ennemi réussi : ${e.target.value}`);
  });
});

function loadEnemy(indexEnemy, ennemiElement, genericEnemy = null) {
  const enemyData = genericEnemy || enemyJSON[indexEnemy];

  if (!enemyData) {
    console.log(`${indexEnemy} is not an enemy (in the list)`);
    // ennemiElement.querySelector('#nom').innerText = "";
    ennemiElement.querySelector("#desc").innerText = "";
    ennemiElement.querySelector("#infos").innerText = "";
    ennemiElement.querySelector("#drop").innerText = "";
    ennemiElement.querySelector(".visuel").innerText = "Switch...";
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
  ennemiElement.querySelector("#desc").innerText = enemyData.desc && `Desc : ${enemyData.desc}`;
  ennemiElement.querySelector("#infos").innerText = enemyData.infos && `Infos / BP : ${enemyData.infos}`;
  ennemiElement.querySelector("#drop").innerText = enemyData.drop && `Drop : ${enemyData.drop}`;

  ennemiElement.querySelector(".visuel").innerText = enemyData.visuel3D;
  if (enemyData.visuel3D !== "Switch...")
    ennemiElement.querySelector(".icon").src = `http://voldre.free.fr/Eden/images/monsters/${enemyData.visuel3D}.png`;
  ennemiElement.querySelector(".icon").alt = enemyData.visuel3D.toLowerCase();
  ennemiElement.querySelector("#pv").value = enemyData.pvmax;
  if (enemyData.pvmax >= 200) ennemiElement.querySelector("#boss_icon").classList.remove("hide");
  else ennemiElement.querySelector("#boss_icon").classList.add("hide");

  const nbP = document.querySelector("#nbP").value; // new functionality 28/08/2023
  ennemiElement.querySelector("#pvmax").value =
    nbP !== "3"
      ? Math.round(enemyData.pvmax * (1 + (nbP - 3) * 0.33))
      : parseInt(enemyData.pvmax) >= 200 && logged
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
    const competenceE = [...ennemiElement.querySelectorAll(".competence")][index];
    // innerHTML because enemy skill can have <br/>
    competenceE.innerHTML = skill;
  });

  if (logged) updateSlots();
}

if (!logged) {
  document.querySelector("#pnjTurnE").addEventListener("click", () => {
    [...document.querySelector("#buffs").querySelectorAll('input[type="number"]')].forEach((buffTurnE) => {
      if (buffTurnE.value > 0) {
        buffTurnE.value -= 1;
      }
    });
  });
  throw new Error("Not logged");
}

// load notes
const notesE = document.querySelector(".notes");
notesE.value = masterJSON.notes;

console.log("Enemy JSON", enemyJSON);

// Display all persos ID
console.log(
  "Persos JSON",
  Object.entries(persosJSON).map((perso) => {
    return { "n°": parseInt(perso[0]) + 1, p: perso[1].nom };
  })
);

if (window.location.href.includes("html")) {
  console.log("Page must not be read in .html, use .php instead");
  stop();
}

// Next turn
const allTurnE = [...document.querySelectorAll(".nextTurn")];

allTurnE.forEach((turnE) => turnE.addEventListener("click", () => nextTurn()));
document.addEventListener("keydown", (e) => {
  if (e.key === "²") nextTurn();
});

function nextTurn() {
  const currentTurnE = document.querySelector("#currentTurnE");
  const mainE = currentTurnE.closest(".perso") || currentTurnE.closest(".infoEnnemi");

  if (!allSlots) {
    toastNotification("Impossible de passer le tour", 4000, true);
    return;
  }

  let slotID = allSlots.indexOf(mainE);

  if (allSlots.length === slotID + 1) {
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

  currentTurnE.classList.add("hide");
  currentTurnE.id = null;
  const nextTurnE = allSlots[slotID + 1].querySelector(".nextTurn");
  nextTurnE.classList.remove("hide");
  nextTurnE.id = "currentTurnE";
}

// Disable the possibility of launching many audio simultaneously
const audiosE = document.getElementsByTagName("audio");
const currentMusicE = document.getElementById("currentMusic");

document.addEventListener(
  "play",
  (e) => {
    for (let i = 0, len = audiosE.length; i < len; i++) {
      if (audiosE[i] !== e.target) {
        audiosE[i].pause();
        if (audiosE[i].currentTime < 30) {
          audiosE[i].currentTime = 0;
        }
      }
    }
    if (e.target.firstChild.attributes) {
      const currentBGM = e.target.firstChild.attributes.src.nodeValue.split("/")[1].split(".")[0];
      console.log(currentBGM);
      currentMusicE.innerText = `${document.getElementById(currentBGM).innerText} (${currentBGM})`;
    }
  },
  true
);

// prettier-ignore
const elements = ["ontond", "ranch", "perç", "feu", "lace", "oudre", "ature", "énèbre", "umière",];

const abnormalWeaknesses = Object.values(enemyJSON)
  .filter((enemy) => !enemy.nom.includes("Veyda") && parseInt(enemy.pvmax) < 500)
  .map((enemy) => {
    const weaknesses = elements.filter((element) => isTextInText(enemy.infos, element));

    if (weaknesses.length !== 2) return { nom: enemy.nom, infos: enemy.infos, elements: weaknesses };
    return undefined;
  })
  .filter((w) => !!w);

if (abnormalWeaknesses.length) console.log("Abnormal weaknesses :", abnormalWeaknesses);

const enemyWeakness = Object.values(enemyJSON).map((enemy) => enemy.infos);

const elementsCount = {};
elements.forEach((element) => {
  const fullText = unformatText(JSON.stringify(enemyWeakness));
  // The g in the regular expression (meaning "g"lobal) says to search the whole string rather than just find the first occurrence
  const regex = new RegExp(unformatText(element), "g"); // Regex for the element in global
  elementsCount[element] = (fullText.match(regex) || []).length;
});
console.log("Enemies Weaknesses :", elementsCount);

// console.log("Pour trouver des ennemis par nom  : Object.values(enemyJSON).filter(enemy => enemy.nom.includes('rsun')");
document.querySelector("#filtre").addEventListener("change", (e) => {
  document.querySelector("#filteredEnemys").innerHTML = null;
  const enemiesList = Object.values(enemyJSON).filter((enemy) => isTextInText(enemy.nom, e.target.value));
  enemiesList.forEach((enemy) => {
    const liElem = createElement("li", `${enemy.nom} - ${enemy.visuel3D}`);
    document.querySelector("#filteredEnemys").append(liElem);
  });
});

[...document.querySelectorAll(".enemyDesc")].forEach((descE) => {
  eventOnClick(descE, () => toggleDesc(descE));
});

function toggleDesc(descE) {
  if (descE.style.maxHeight === "10px") {
    descE.style.backgroundColor = "";
    descE.style.maxHeight = "200px";
  } else {
    descE.style.backgroundColor = "rgba(36, 36, 106, 0.5)";
    descE.style.maxHeight = "10px";
  }
}

// loadEnemy (previously here)

// EQPTS
const equipementsE = document.querySelector(".equipements");
// eqpts list
Object.values(eqptJSON).forEach((eqpt) => {
  const nomE = createElement("p", eqpt.nom, { class: "nom" });
  const descE = createElement("p", eqpt.desc, { class: "desc" });
  const effetE = createElement("p", eqpt.effet, { class: "effet" });
  const montantE = createElement("p", eqpt.montant, { class: "montant" });

  const iconeE = createElement("img", undefined, {
    class: "icone",
    src: eqpt.icone !== "?" ? `http://voldre.free.fr/Eden/images/items/${eqpt.icone}.png` : "",
  });

  const eqptE = createElement("div", [nomE, descE, effetE, montantE, iconeE], { class: "eqpt" });
  equipementsE.append(eqptE);
});

// Show/Hide eqpts
const buttonEqpt = document.querySelector("#buttonEqpt");
buttonEqpt.addEventListener("click", () => {
  if (buttonEqpt.innerText === "Afficher") {
    buttonEqpt.innerText = "Masquer";
  } else {
    buttonEqpt.innerText = "Afficher";
  }
  equipementsE.classList.toggle("hide");
});

// Filter eqpts by name (08/02/2024)

const eqptNameFilter = document.querySelector("#eqptNameFilter");
const eqptEffectFilter = document.querySelector("#eqptEffectFilter");
const revertFilterNames = document.querySelector("#revertNameFilter");

[eqptNameFilter, eqptEffectFilter].map((element) =>
  element.addEventListener("blur", () => {
    eqptFilter();
  })
);
revertFilterNames.addEventListener("change", () => {
  eqptFilter();
});

const eqptFilter = () => {
  // Update 02/05/2024 : Handle multiple filters if splited by coma, + revert filter
  // Filters (of same type) are defined by UNION (||), so we display any eqpt matching one of the filter
  const filterNames = eqptNameFilter.value ? eqptNameFilter.value.split(",") : [];
  const filterEffects = eqptEffectFilter.value ? eqptEffectFilter.value.split(",") : [];
  const isRevertFilterNames = revertFilterNames.checked;

  let nbEqptsDisplayed = 0;

  [...equipementsE.children].forEach((eqptE) => {
    const eqptName = eqptE.querySelector(".nom").innerText;
    const eqptEffect = eqptE.querySelector(".effet").innerText;
    const eqptMontant = eqptE.querySelector(".montant").innerText;

    const filterNamesCondition =
      !filterNames.length || filterNames.find((filterName) => isTextInText(eqptName, filterName));
    const filtersConditionsMet =
      //         isRevertFilterNames ^= filterNamesCondition
      // The revert is only applied on filterNames
      (isRevertFilterNames ? !filterNamesCondition : filterNamesCondition) &&
      (!filterEffects.length ||
        filterEffects.find(
          (filterEffect) => isTextInText(eqptEffect, filterEffect) || isTextInText(eqptMontant, filterEffect)
        ));

    if (filtersConditionsMet) {
      eqptE.classList.remove("hide");
      nbEqptsDisplayed++;
    } else eqptE.classList.add("hide");
  });

  document.querySelector("#nbEqptFiltered").innerText = `(${nbEqptsDisplayed})`;
};

// Add new enemy (4th)

document.querySelector("#newEnemy").addEventListener("click", () => {
  const allEnemies = [...document.querySelectorAll(".infoEnnemi")];

  const lastEnemy = allEnemies[allEnemies.length - 1];
  if (allEnemies.length > 5) {
    lastEnemy.remove();
    updateSlots();

    // If last enemy has "current turn", make new turn because enemy will close
    const hasCurrentTurn = !!lastEnemy.querySelector("#currentTurnE");
    if (hasCurrentTurn) {
      document.querySelector("#tour").value = parseInt(document.querySelector("#tour").value) + 1;
      const nextTurnE = allSlots[0].querySelector(".nextTurn");
      nextTurnE.classList.remove("hide");
      nextTurnE.id = "currentTurnE";
    }
  } else {
    const newEnemyE = lastEnemy.cloneNode(true);
    newEnemyE.id = `e${allEnemies.length}`;

    // Add event listeners
    // Classic enemy on select
    newEnemyE.querySelector(".ennemi").addEventListener("change", (e) => {
      loadEnemy(e.target.value, newEnemyE);
      toastNotification(`Chargement de l'ennemi réussi : ${e.target.value}`);
    });

    // Next turn button
    newEnemyE.querySelector(".nextTurn").addEventListener("click", () => nextTurn());

    // hide desc
    const descE = newEnemyE.querySelector(".enemyDesc");
    descE.addEventListener("click", () => toggleDesc(descE));

    // Switch kind of enemy with visual text
    newEnemyE.querySelector(".visuel").addEventListener("click", (e) => {
      const enemyTypeE = e.target.closest(".infoEnnemi").querySelector(".enemyType");
      [...enemyTypeE.children].map((child) => child.classList.toggle("hide"));
    });

    // Generic enemy on selects
    const genericE = newEnemyE.querySelector(".generic");
    const selectElements = [...genericE.children];
    selectElements.forEach((selectE) => {
      selectE.addEventListener("change", () => handleGenericSelectChange(selectElements));
    });

    document.querySelector(".ennemis").append(newEnemyE);
  }
});

// Get and update players PV (new functionality 28/08/2023)

document.querySelector("#updatePInfo").addEventListener("click", () => {
  updateSlots();

  const pInfo = document.querySelector("#pInfo");

  const persosJSON = getData("persos");

  const playersListID = document.querySelector("#pList").value.split(",");

  pInfo.innerHTML = "";

  Object.entries(playersListID).forEach(([index, pID]) => {
    const player = persosJSON[(parseInt(pID) - 1).toString()]; // Car index 0 à la première
    if (!player) return; // Can't continue

    if ([...document.querySelectorAll(".perso")][index])
      [...document.querySelectorAll(".perso")][index].children[0].value = player.nom;

    const liElem = createElement("li", `${player.nom} : ${player.pv}/${player.pvmax}`);
    pInfo.append(liElem);
  });
});

// Variateurs de PV et Dégâts selon le nombre de joueurs (new functionality 28/08/2023)

document.querySelector("#nbP").addEventListener("change", (e) => {
  const nbP = e.target.value;
  if (nbP >= 3) {
    document.querySelector("#variation").innerText = `+${(nbP - 3) * 33}%`;
  } else {
    document.querySelector("#variation").innerText = `-${(3 - nbP) * 33}%`;
  }
});

// Add new kind of enemy : Generic Enemy !

const genericElements = [...document.querySelectorAll(".generic")];
[...document.querySelectorAll(".visuel")].forEach((visuelE) => {
  // On click, toggle hidden type
  visuelE.addEventListener("click", (e) => {
    const enemyTypeE = e.target.closest(".infoEnnemi").querySelector(".enemyType");
    [...enemyTypeE.children].map((child) => child.classList.toggle("hide"));
  });
});

genericElements.forEach((genericE) => {
  const selectElements = [...genericE.children];
  selectElements.forEach((selectE) => {
    const propName = selectE.className;
    // Fill options with all of an element (classes, races, rangs, guildes), mapped on "prop" value (classe =, ...)
    fillSelectOptions(selectE, [
      { value: "", innerText: "" },
      ...Object.values(enemyGenericJSON[`${propName}s`].map((e) => ({ value: e[propName], innerText: e[propName] }))),
    ]);

    selectE.addEventListener("change", () => handleGenericSelectChange(selectElements));
  });
});

function handleGenericSelectChange(selectElements) {
  const v = {};
  let hasEmptyValue = false;
  selectElements.forEach((selectE) => {
    v[selectE.className] = selectE.value;
    if (selectE.value === "") hasEmptyValue = true;
  });

  if (hasEmptyValue) return;

  const stats = statsJSON.classes.find((e) => e.Classe === v["classe"]);
  const raceStats = statsJSON.races.find((e) => e.Race === v["race"]);

  const classe = enemyGenericJSON.classes.find((e) => e.classe === v["classe"]);
  const rang = enemyGenericJSON.rangs.find((e) => e.rang === v["rang"]);
  const guilde = enemyGenericJSON.guildes.find((e) => e.guilde === v["guilde"]);

  const skills = classe.sorts.map((s) => {
    const bonusMontantVar =
      s.portee === "Mono"
        ? rang.montantVariable["Mono"] + guilde.montantVariable["Mono"]
        : s.portee === "AoE"
          ? rang.montantVariable["AoE"] + guilde.montantVariable["AoE"]
          : 0;
    const montantVarTot =
      s.type === "Buff" ? Math.round((s.montantVariable + bonusMontantVar) / 2) : s.montantVariable + bonusMontantVar;

    const bonusMontantEffet =
      s.portee === "Mono"
        ? rang.montantEffet["Mono"] + guilde.montantEffet["Mono"]
        : s.portee === "AoE"
          ? rang.montantEffet["AoE"] + guilde.montantEffet["AoE"]
          : 0;
    const montantEffetTot = unformatText(s.effet).includes("degat")
      ? s.montantEffet + Math.round(bonusMontantEffet * (unformatText(s.effet).includes("prochain degat") ? 2.5 : 1.5))
      : s.montantEffet + Math.round(bonusMontantEffet / 2);

    const duree = s.duree + rang.duree + guilde.duree;

    return `${s.nom} : ${s.type} ${s.montantFixe}${s.montantFixe ? ` +${montantVarTot}` : ""}, ${s.effet}${
      s.montantEffet ? montantEffetTot : ""
    }${s.duree ? ` sur ${duree} tours` : ""} ${s.portee} : ${s.stat}`;
  });

  const statsName = ["Force", "Dextérité", "Intelligence", "Charisme", "Esprit"];
  const statsValues = statsName.map(
    (statName) => stats[statName] * 2 + raceStats[statName] + rang["stat"] + (guilde["stat"] || 0)
  );

  const enemyData = {
    visuel3D: "Switch...",
    nom: "",
    pvmax: stats["PV"] * 2 + raceStats["PV"] + rang["pv"] + guilde["pv"],
    skills,
    stats: statsValues.join(","),
    desc: "",
    infos: "",
    drop: "",
  };

  loadEnemy(0, selectElements[0].closest(".infoEnnemi"), enemyData);
}

// ALL SAVES

// Allow save for users
function toggleButton() {
  document.querySelector("#allowSave").style = `border: 3px solid ${masterJSON.allow ? "green" : "red"}`;
}

toggleButton();
document.querySelector("#allowSave").addEventListener("click", () => {
  masterJSON.allow = !masterJSON.allow;
  toggleButton();

  masterJSON.notes = notesE.value;

  document.cookie = `masterJSON=${encodeURIComponent(JSON.stringify(masterJSON))}`;
  callPHP({ action: "saveFile", name: "master" });
  toastNotification("Autorisation modifiée");
});

document.querySelector("#save").addEventListener("click", () => {
  masterJSON.notes = notesE.value;
  document.cookie = `masterJSON=${encodeURIComponent(JSON.stringify(masterJSON))}`;
  callPHP({ action: "saveFile", name: "master" });
  toastNotification("Données sauvegardées");
});

document.querySelector("#saveBackup").addEventListener("click", () => {
  callPHP({ action: "saveBackup" });
  toastNotification("JDRpersos_backup.json et JDRplayer sauvegardés");
});

// Create skill & Save

document.querySelector("#createSkill").addEventListener("click", () => {
  const addSkill = document.querySelector(".addSkill");
  const skillID = parseInt(Object.keys(skillsJSON).reverse()[0]) + 1 || 1;
  const newSkill = {};
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
  setCookie("skillsJSON", newSkill);

  callPHP({ action: "saveFile", name: "skills" });
  skillsJSON[skillID] = newSkill[skillID];
  toastNotification("Compétence créé");
});

// Create eqpt & Save

document.querySelector("#createEqpt").addEventListener("click", () => {
  const addEqpt = document.querySelector(".addEqpt");
  const eqptID = parseInt(Object.keys(eqptJSON).reverse()[0]) + 1 || 1;
  const newEqpt = {};
  newEqpt[eqptID] = {
    nom: addEqpt.children[0 + 1].value,
    desc: addEqpt.children[2 + 1].value,
    effet: addEqpt.children[4 + 1].value,
    montant: addEqpt.children[6 + 1].value,
    icone: addEqpt.children[8 + 1].value,
  };
  console.log(newEqpt);

  setCookie("eqptJSON", newEqpt);

  callPHP({ action: "saveFile", name: "eqpt" });
  eqptJSON[eqptID] = newEqpt[eqptID];
  toastNotification("Equipement créé");
});

// Create enemy & Save

document.querySelector("#createEnemy").addEventListener("click", () => {
  const addEnemy = document.querySelector(".addEnemy");
  const enemyID = parseInt(Object.keys(enemyJSON).reverse()[0]) + 1 || 1;
  const newEnemy = {};
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

  setCookie("enemyJSON", newEnemy);

  callPHP({ action: "saveFile", name: "enemy" });
  enemyJSON[enemyID] = newEnemy[enemyID];
  toastNotification("Ennemi créé");
});

document.querySelector("#randomBoss").addEventListener("click", () => {
  const bosses = Object.entries(enemyJSON).filter((e) => e[1].pvmax > 200);
  const randomIndex = Math.floor(Math.random() * bosses.length);
  loadEnemy(bosses[randomIndex][0], document.querySelector("#e0"));
});

document.querySelector("#logout").addEventListener("click", async () => {
  const response = await callPHP({ action: "logout" });
  if (response)
    window.location.reload(true); // Force le reload depuis le serveur
  else toastNotification("Deconnexion échouée", 3000, true);
});
