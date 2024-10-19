import { allSkills, eqptJSON } from "./JDRstore.js";

export async function callPHP(data) {
  const result = await fetch("jdr_backend.php", {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    method: "POST",
    body: new URLSearchParams(data),
  });
  console.log("jdr_backend.php executed, data : ", data);

  return result.text();
  // Later content-type JSON, body JSON.stringify, and retrieve result.json() ?
  // If that, also change jdr_backend to json_decode input url parameters
}

let currentTimeout;

export const toastNotification = (text, duration = 3000, error = false) => {
  const toaster = document.getElementById("toast");

  if (error) toaster.classList.add("error");
  else toaster.classList.remove("error");

  if (toaster.getAttribute("listener") !== "true") {
    toaster.addEventListener("click", () => {
      toaster.classList.remove("show");
    });
  }

  if (!toaster.classList.contains("show") || error) {
    // Clear timeout if defined
    clearTimeout(currentTimeout);
    toaster.classList.add("show");
    toaster.innerText = text;
    currentTimeout = setTimeout(function () {
      toaster.classList.remove("show");
    }, duration);
  }
};

export const aoeDescInfo = {
  range: ["L", "R"],
  type: ["-", "+"],
  rangeName: ["Ligne de", "Rond de"],
  typeName: ["Courte portée", "Longue portée"],
  typeMalus: ["Esquivable Malus 4 si proche, 2 si éloigné", "Esquivable seulement de loin, Malus 3-4"],
};

export class Perso {
  constructor(persoData, inFight = true) {
    this.nom = persoData.nom;

    this.niv = persoData.niv;
    // 25/11/23 Suite à hugo qui fait PvMax/Pv, j'introduis le fait de prendre le max des 2... xD
    // 14/05/24 : Maintenant que la case est mise en rouge en cas de mauvais montant des PV max, plus besoin
    this.pvmax = this.pv = persoData.pvmax;

    // Calcul des dégâts fixes et de l'armure
    const stuffs = JSON.parse(persoData.eqpts).map((eqptName) => {
      return Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) == unformatText(eqptName));
    });

    if (!stuffs[0]) {
      if (inFight) {
        toastNotification("Erreur : Le personnage n'est pas apte à se battre.", 8000, true);
        stop();
      } else {
        this.degat = "-";
        this.armure = "-";
        return;
      }
    }
    // console.log(stuffs);

    // Add 05/11/2023 : Accessories effects (Damage or Armor), according to access specificites
    const montantAccessDegat = stuffs
      .map((stuff) => {
        if (!stuff) return 0;
        if (!!stuff.access && stuff.access[0] == "D") {
          return parseInt(stuff.access[1]);
        }
        return 0;
      })
      .reduce(sum);

    const montantAccessArmure = stuffs
      .map((stuff) => {
        if (!stuff) return 0;
        if (!!stuff.access && stuff.access[0] == "A") {
          return parseInt(stuff.access[1]);
        }
        return 0;
      })
      .reduce(sum);

    console.log("Access effets (" + persoData.nom + ") (Dégât, Armure) : ", montantAccessDegat, montantAccessArmure);

    // Récupération de tous les points de dégâts et armures naturels (valeur + bonus conditionnels)
    const stuffsDamages = parseEqptsByRegex(["Dégât +"], stuffs, persoData);
    const stuffsArmor = parseEqptsByRegex(["Dégât -", "Dégât reçu -"], stuffs, persoData);

    const montantBouclier = stuffsArmor[1];
    const montantArmure = stuffsArmor[3];
    const montantArme1 = stuffsDamages[0];
    const montantArme2 = stuffsDamages[1];

    const montantAccessDegatNat = stuffsDamages.slice(3).reduce(sum);
    const montantAccessArmureNat = stuffsArmor.reduce(sum) - montantBouclier - montantArmure;

    console.log(
      "stuffs nat damages/armor",
      stuffsDamages,
      stuffsArmor,
      "access :",
      montantAccessDegatNat,
      montantAccessArmureNat
    );

    // Bonus de dégât par niveau (20/11/23 : Fixe à 2 en +, exponentiel par niveau)
    this.degat = Math.round(
      (2 + montantArme1 + montantArme2) * Math.pow(1.1, this.niv) + montantAccessDegat + montantAccessDegatNat
    );

    // Bonus d'armure par niveau (20/11/23 : Fixe à 2 en +, exponentiel par niveau)
    // 02/12/23 : l'exponentiel du bouclier est réduit, car sinon trop cheat
    this.armure = Math.round(
      (2 + montantArmure) * Math.pow(1.1, this.niv) +
        montantBouclier * Math.pow(1.05, this.niv) +
        montantAccessArmure +
        montantAccessArmureNat
    );

    // *** Dégression des montants et équilibrage ! ***
    //
    // 21/11/23 : Si l'armure actuelle est trop haute, je la diminue !
    // Car l'armure dans le jeu c'est vraiment trop cheat !
    this.armure -= Math.max(Math.floor((this.armure - 15) / 5), -1);
    // et un peu pareil pour les dégâts, mais moins violent :
    this.degat -= Math.max(Math.floor((this.degat - 25) / 5), 0);

    // Réduction si la personne a du soin
    const classSoins = ["Clerc", "Barde", "Shaman", "Sage", "Templier"];
    if (classSoins.includes(persoData.classeP) || classSoins.includes(persoData.classeS)) {
      this.armure -= 1;
    }
    // ****

    // 25/11 Bonus if less skills than 4
    const nbSkills = allSkills.filter(
      (skill) => skill.classe.includes(persoData.classeP) || skill.classe.includes(persoData.classeS)
    ).length;
    if (nbSkills < 4) {
      this.degat += 1;
      this.armure += 1;
    }
    // 24/12 For Leyla and other
    if (nbSkills < 3) {
      this.degat += 1;
      this.armure += 1;
    }
    // **

    // 03/12 Add Bloc/Esq (resistance) bonus according to stuff
    const montantBlocP = parseEqptsByRegex(["Blocage +", "Blocage physique +"], stuffs, persoData).reduce(sum);

    const montantEsq = parseEqptsByRegex(["Esquive +"], stuffs, persoData).reduce(sum);

    const montantBlocM = parseEqptsByRegex(["Blocage +", "Blocage magique +"], stuffs, persoData).reduce(sum);

    const statsB = [persoData.forceB, persoData.dextéB, persoData.intelB, persoData.charismeB, persoData.espritB].map(
      (statB) => {
        const statBWithRegex = statB.replace(/[^\d.+-]/g, "");
        if (statB.match(/^[-+]\d+|\d*$/)[0]) return statBWithRegex;
        else return "";
      }
    );

    this.force = persoData.force + statsB[0];
    this.forceRes = montantBlocP;
    this.dexté = persoData.dexté + statsB[1];
    this.dextéRes = montantEsq;
    this.intel = persoData.intel + statsB[2];
    this.intelRes = montantBlocM;
    this.charisme = persoData.charisme + statsB[3];
    this.esprit = persoData.esprit + statsB[4];

    this.force = eval(this.force).toString().slice(0, 2);
    this.dexté = eval(this.dexté).toString().slice(0, 2);
    this.intel = eval(this.intel).toString().slice(0, 2);
    this.charisme = eval(this.charisme).toString().slice(0, 2);
    this.esprit = eval(this.esprit).toString().slice(0, 2);

    // Classes du perso
    this.classeP = persoData.classeP;
    this.classeS = persoData.classeS;
  }
}

export const initDialog = (labelsDescription) => {
  const dialog = document.querySelector("dialog");
  document.querySelectorAll("label").forEach((label) => {
    if (!labelsDescription[label.htmlFor]) return; // Si le label n'a pas de description

    label.addEventListener("click", () => {
      dialog.innerText = "";
      const text = document.createElement("p");
      text.innerHTML = labelsDescription[label.htmlFor]; // description
      dialog.append(text);
      // Bouton de fermeture
      const closeE = document.createElement("button");
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
};

// text : string, eqpt : eqpt
export const parseEqptValue = (text, eqpt) => {
  // Handle "+" in regex
  const regex = new RegExp(unformatText(text).replaceAll("+", "\\+"));
  if (!eqpt) return 0;
  const eqptValue = [eqpt.montant, eqpt.effet].map((eqptText) => {
    // Update regex to handle "negative lookbehind assertion"
    const match = regex.exec(unformatText(eqptText));
    if (!match) return "0";
    const position = match.index + match[0].length;
    console.log(regex, eqptText, eqptText[position] + (eqptText[position + 1] ?? ""));
    return eqptText[position] + (eqptText[position + 1] ?? "");
  });
  // if (regex.includes("glace")) console.log(`(${regex})`, eqpt, eqptValue);
  return parseInt(eqptValue[0]) + parseInt(eqptValue[1]);
};

// Shortcut function to make sum of access amounts (without passif, only access parts)
// Never send eqpts without access in parseEqptsByRegex, because "panoplies" with
// weapons/armor will not match (because equipments are not sent in the function) !
// So we need to slice AFTER
export const sumEqptsAsAccess = (texts, eqpts, persoData) =>
  parseEqptsByRegex(texts, eqpts, persoData, false).slice(4).reduce(sum, 0);

// text : string[], eqpts : eqpt[], persoData : Perso
export const parseEqptsByRegex = (texts, eqpts, persoData, withPassif = true) => {
  // 24/05/2024 : Handle Passif level 12
  if (persoData.niv >= 12 && withPassif) {
    eqpts = eqpts.concat({ montant: persoData.passif12 });
  }
  return eqpts.map((eqpt) => {
    if (!eqpt) return 0;
    // For each regex, parse Eqpt, and do the sum of each regex (.reduce)
    const result = texts.map((reg) => parseEqptValue(reg, eqpt)).reduce((total, item) => total + item);

    // Handle condition bonus
    const bonus = parseEqptBonus(eqpt, texts, eqpts, persoData);
    // console.log("in parseEqptsByRegex : (result,bonus)", result, bonus);
    return result + bonus;
  });
};

export const parseEqptBonus = (eqpt, texts, eqpts, persoData) => {
  // Check if bonus is corresponding to text and get the value
  const parseEqptBonus = texts
    .map((text) => {
      if (!eqpt.condition) return 0;
      const hasValue = unformatText(eqpt.condition.bonus)?.split(unformatText(text))[1];
      if (!hasValue) return 0;
      return parseInt(hasValue.split(",")[0].split(" ")[0]);
    })
    .reduce((total, item) => total + item);

  let bonus = 0;
  if (parseEqptBonus !== 0) {
    switch (eqpt.condition.type) {
      case "classe":
        // Check if the Primary or Secondary class are included in the class condition list
        const nbValidClass = [persoData.classeP, persoData.classeS].filter((pClasse) =>
          eqpt.condition.value.includes(pClasse)
        ).length;
        bonus = nbValidClass * parseEqptBonus;
        break;
      case "race":
        bonus = eqpt.condition.value.includes(persoData.race) && parseEqptBonus;
        break;
      case "panoplie":
        // Get eqptsName, excepted the selected eqpt (that can match panoplie, ex : Heldentod)
        const eqptsName = eqpts.map((eq) => eq && eq != eqpt && unformatText(eq.nom));
        const nbEqptsInPanop = eqptsName.filter(
          (eqptName) => eqptName && eqptName.includes(unformatText(eqpt.condition.value))
        ).length;
        bonus = nbEqptsInPanop * parseEqptBonus;
        break;
      // There are 2 problems with PV condition effect :
      // 1) persoData.pv is read, so you need to save and refresh to see the synthesis updated
      // 2) If currently the perso met the condition, in the mini-game (jdr combat), the bonus will always be triggered, because "persoData" is low HP
      // This is why I didn't take into account this kind of data, "versatile data" like HP must not be used, for the moment !
      // case "PV":
      //   bonus = persoData.pv < Math.round(persoData.pvmax / parseInt(eqpt.condition.value)) && parseEqptBonus;
      // break;
      default:
        break;
    }
  }
  // if (eqpt.condition) console.log(JSON.stringify(eqpt.condition), texts);
  if (bonus)
    console.log(`Bonus déclenché (${texts[0]}${bonus}) pour ${persoData.nom} sur `, JSON.stringify(eqpt.condition));

  return bonus;
};

export const isTextInText = (mainText, subText) => {
  const mainTextUnformated = unformatText(mainText);
  const subTextUnformated = unformatText(subText);
  return mainTextUnformated.includes(subTextUnformated);
};

// Remove accents, upper case and spaces
export const unformatText = (text) =>
  (text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const sum = (a, b) => a + b;

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const sameDay = (first, second) =>
  first.getUTCFullYear() === second.getUTCFullYear() &&
  first.getUTCMonth() === second.getUTCMonth() &&
  first.getUTCDate() === second.getUTCDate();

export const dateToString = (date, full) => {
  const stringDate = date.toLocaleString("fr-FR");
  return full ? stringDate : stringDate.split(" ")[0];
};

export const stringToDate = (stringDate) => {
  const splitDate = stringDate.split("/");
  // console.log(splitDate, new Date(splitDate[2], parseInt(splitDate[1]) - 1, splitDate[0]));

  // Date(year,month-1,day,hours) : hours = 2 to Handle converison locale string FR
  return new Date(splitDate[2], parseInt(splitDate[1]) - 1, splitDate[0], 2);
};

export const readCookie = (key) => {
  let result;
  // eslint-disable-next-line no-cond-assign
  return (result = new RegExp("(?:^|; )" + encodeURIComponent(key) + "=([^;]*)").exec(document.cookie))
    ? result[1]
    : null;
};
