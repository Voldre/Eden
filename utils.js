import { allSkills, eqptJSON } from "./JDRstore";

export async function callPHP(data) {
  $.ajax({
    url: "jdr_backend.php",
    type: "post",
    data: data,
    async: true,
  });
  console.log("jdr_backend.php executed, data : ", data);
}

export const toastNotification = (text, duration = 3000) => {
  const toaster = document.getElementById("toast");

  if (toaster.getAttribute("listener") !== "true") {
    toaster.addEventListener("click", () => {
      toaster.classList.remove("show");
    });
  }

  if (!toaster.classList.contains("show")) {
    toaster.classList.add("show");
    toaster.innerText = text;
    setTimeout(function () {
      toaster.classList.remove("show");
    }, duration);
  }
};

export class Perso {
  constructor(persoData, inFight = true) {
    this.nom = persoData.nom;

    this.niv = persoData.niv;
    // 25/11/23 Suite à hugo qui fait PvMax/Pv, j'introduis le fait de prendre le max des 2... xD
    this.pvmax = this.pv = Math.max(persoData.pvmax, persoData.pv);

    // Calcul des dégâts fixes et de l'armure
    const stuffs = JSON.parse(persoData.eqpts).map((eqptName) => {
      return Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) == unformatText(eqptName));
    });

    console.log(stuffs[1]);

    if (!stuffs[0]) {
      if (inFight) {
        toastNotification("Erreur : Le personnage n'est pas apte à se battre.", 8000);
        stop();
      } else {
        this.degat = "-";
        this.armure = "-";
        return;
      }
    }
    // stuffs = stuffs.filter((s) => s != undefined);
    var montantBouclier,
      montantArmure,
      montantArme1,
      montantArme2,
      montantAccessDegat,
      montantAccessArmure,
      montantBlocP,
      montantEsq,
      montantBlocM;

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

    stuffs[1] = { ...(stuffs[1] || { nom: "", montant: "Dégât +0" }) };
    if (stuffs[1].nom.includes("Bouclier")) {
      console.log(stuffs[1]);
      montantBouclier = parseEqptValue("Dégât -", stuffs[1]);
      stuffs[1].montant = "Dégât +0";
    } else {
      montantBouclier = 0;
    }

    montantArme1 = parseEqptValue("Dégât +", stuffs[0]);
    montantArme2 = parseEqptValue("Dégât +", stuffs[1]);

    // Bonus de dégât par niveauu (20/11/23 : Fixe à 2 en +, exponentiel par niveau)
    this.degat = Math.round((2 + montantArme1 + montantArme2) * Math.pow(1.1, this.niv) + montantAccessDegat);

    montantArmure = parseEqptValue("Dégât -", stuffs[3]);

    // Bonus d'armure par niveau (20/11/23 : Fixe à 2 en +, exponentiel par niveau)
    // 02/12/23 : l'exponentiel du bouclier est réduit, car sinon trop cheat
    this.armure = Math.round(
      (2 + montantArmure) * Math.pow(1.1, this.niv) + montantBouclier * Math.pow(1.05, this.niv) + montantAccessArmure
    );

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
    // 03/12 Add Bloc/Esq (resistance) bonus according to stuff
    montantBlocP = parseEqptsByRegex(["Blocage +", "Blocage physique +"], stuffs).reduce((a, b) => a + b);

    montantEsq = parseEqptsByRegex(["Esquive +"], stuffs).reduce((a, b) => a + b);

    montantBlocM = parseEqptsByRegex(["Blocage +", "Blocage magique +"], stuffs).reduce((a, b) => a + b);

    const statsB = [persoData.forceB, persoData.dextéB, persoData.intelB, persoData.charismeB, persoData.espritB].map(
      (statB) => {
        const statBWithRegex = statB.replace(/[^\d.+-]/g, "");
        if (!!statB.match(/^[-+]\d+|\d*$/)[0]) return statBWithRegex;
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
  const regex = text.toLowerCase();
  if (!eqpt) return 0;
  const eqptValue = [eqpt.montant, eqpt.effet].map((eqptText) => {
    const hasValue = eqptText?.toLowerCase().split(regex)[1];
    if (!hasValue) return "0";
    return hasValue.split(",")[0].split(" ")[0];
  });
  // if (regex.includes("glace")) console.log(`(${regex})`, eqpt, eqptValue);
  return parseInt(eqptValue[0]) + parseInt(eqptValue[1]);
};

// text : string[], eqpts : eqpt[]
export const parseEqptsByRegex = (texts, eqpts) => {
  return eqpts.map((eqpt) => {
    if (!eqpt) return 0;
    // For each regex, parse Eqpt, and do the sum of each regex (.reduce)
    const result = texts.map((reg) => parseEqptValue(reg, eqpt)).reduce((total, item) => total + item);
    // console.log({ label: category.label, eqpt, result });
    return result;
  });
};

export const isTextInText = (mainText, subText) => {
  const mainTextUnformated = unformatText(mainText);
  const subTextUnformated = unformatText(subText);
  return mainTextUnformated.includes(subTextUnformated);
};

// Remove accents, upper case and spaces
export const unformatText = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
