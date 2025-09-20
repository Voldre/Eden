import { combatSkillsJSON, eqptJSON } from "../JDRstore"
import { Enemy, EnemyCombat, Equipment, Perso, PersoCombat, StatsShort } from "../model"
import { toastNotification } from "./elements"
import { getRandomBetween, isTextInText, sum, unformatText } from "./variables"

// #region Perso

export const newPerso = (persoData: Perso, inFight: boolean = true): PersoCombat => {
  const perso: Partial<PersoCombat> = {}
  perso.nom = persoData.nom

  perso.niv = persoData.niv
  // 25/11/23 Suite à hugo qui fait PvMax/Pv, j'introduis le fait de prendre le max des 2... xD
  // 14/05/24 : Maintenant que la case est mise en rouge en cas de mauvais montant des PV max, plus besoin
  perso.pvmax = perso.pv = persoData.pvmax

  // Calcul des dégâts fixes et de l'armure
  const stuffs = persoData.eqpts.map((eqptName: string) => {
    return Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) === unformatText(eqptName))
  })

  if (!stuffs[0]) {
    if (inFight) {
      toastNotification("Erreur : Le personnage n'est pas apte à se battre.", 8000, true)
      stop()
    } else {
      perso.degat = 0
      perso.armure = 0
    }
    return perso as PersoCombat
  }

  // Add 05/11/2023 : Accessories effects (Damage or Armor), according to access specificites
  const montantAccessD = stuffs
    .map((stuff) => {
      if (!stuff) return 0
      if (!!stuff.access && stuff.access[0] === "D") {
        return parseInt(stuff.access[1])
      }
      return 0
    })
    .reduce(sum)

  const montantAccessA = stuffs
    .map((stuff) => {
      if (!stuff) return 0
      if (!!stuff.access && stuff.access[0] === "A") {
        return parseInt(stuff.access[1])
      }
      return 0
    })
    .reduce(sum)

  // Récupération de tous les points de dégâts et armures naturels (valeur + bonus conditionnels)
  const stuffsDamages = parseEqptsByRegex(["Dégât +"], stuffs, persoData)
  const stuffsArmor = parseEqptsByRegex(["Dégât -", "Dégât reçu -"], stuffs, persoData)

  const montantBouclier = stuffsArmor[1]
  const montantArmure = stuffsArmor[3]
  const montantArme1 = stuffsDamages[0]
  const montantArme2 = stuffsDamages[1]

  const montantAccessDegatNat = stuffsDamages.slice(3).reduce(sum)
  const montantAccessArmureNat = stuffsArmor.reduce(sum) - montantBouclier - montantArmure

  console.log(`Stats ${persoData.nom} :`, {
    stuffsDamages,
    stuffsArmor,
    montantBouclier,
    montantArmure,
    montantAccessD,
    montantAccessDegatNat,
    montantAccessA,
    montantAccessArmureNat,
    montantArme1,
    montantArme2,
  })

  // Bonus de dégât par niveau (20/11/23 : Fixe à 2 en +, exponentiel par niveau)
  perso.degat = Math.round(
    // Limit the sum of 2 weapons to 13 (ex: Zhaïtan 15 Bultik)
    (2 + Math.min(montantArme1 + montantArme2, 13)) * Math.pow(1.09, perso.niv) + montantAccessD + montantAccessDegatNat
  )

  // Bonus d'armure par niveau (20/11/23 : Fixe à 2 en +, exponentiel par niveau)
  // 02/12/23 : l'exponentiel du bouclier est réduit, car sinon trop cheat
  perso.armure = Math.round(
    (2 + montantArmure) * Math.pow(1.09, perso.niv) +
      montantBouclier * Math.pow(1.06, perso.niv) +
      montantAccessA +
      montantAccessArmureNat
  )

  // *** Dégression des montants et équilibrage ! ***
  //
  // 21/11/23 : Si l'armure actuelle est trop haute, je la diminue !
  // Car l'armure dans le jeu c'est vraiment trop cheat !
  perso.armure -= Math.max(Math.floor((perso.armure - 15) / 5), -1)
  // et un peu pareil pour les dégâts, mais moins violent :
  perso.degat -= Math.max(Math.floor((perso.degat - 25) / 5), 0)

  // Réduction si la personne a du soin
  const classSoins = ["Clerc", "Barde", "Shaman", "Sage", "Templier"]
  if (classSoins.includes(persoData.classeP) || classSoins.includes(persoData.classeS)) {
    perso.armure -= 1
  }
  // ****

  // 25/11 Bonus if less skills than 4
  const nbSkills = combatSkillsJSON.filter(
    (skill) => skill.classes.includes(persoData.classeP) || skill.classes.includes(persoData.classeS)
  ).length
  if (nbSkills < 4) {
    perso.degat += 1
    perso.armure += 1
  }
  // 24/12 For Leyla and other
  if (nbSkills < 3) {
    perso.degat += 1
    perso.armure += 1
  }
  // **

  // 03/12 Add Bloc/Esq (resistance) bonus according to stuff
  const montantBlocP = parseEqptsByRegex(["Blocage +", "Blocage physique +"], stuffs, persoData).reduce(sum)

  const montantEsq = parseEqptsByRegex(["Esquive +"], stuffs, persoData).reduce(sum)

  const montantBlocM = parseEqptsByRegex(["Blocage +", "Blocage magique +"], stuffs, persoData).reduce(sum)

  const statsB = [persoData.forceB, persoData.dextéB, persoData.intelB, persoData.charismeB, persoData.espritB].map(
    (statB) => {
      const statBWithRegex = statB.replace(/[^\d.+-]/g, "")
      if (statB.match(/^[-+]\d+|\d*$/)?.[0]) return statBWithRegex.replaceAll("++", "").replaceAll("--", "")
      return ""
    }
  )

  perso.forceRes = montantBlocP
  perso.dextéRes = montantEsq
  perso.intelRes = montantBlocM
  ;(["force", "dexté", "intel", "charisme", "esprit"] as StatsShort[]).forEach((stat, i) => {
    perso[stat] = parseInt(
      eval(persoData[stat] + statsB[i])
        .toString()
        .slice(0, 2)
    )
  })

  // Classes du perso
  perso.classeP = persoData.classeP
  perso.classeS = persoData.classeS

  // @TODO Change this type mapping
  return perso as PersoCombat
}

// #region parseEqpts

// text : string, eqpt : eqpt
export const parseEqptValue = (text: string, eqpt: Equipment): number => {
  // Handle "+" in regex
  const regex = new RegExp(unformatText(text).replaceAll("+", "\\+"))
  if (!eqpt) return 0
  const eqptValue = [eqpt.montant, eqpt.effet].map((eqptText) => {
    // Update regex to handle "negative lookbehind assertion"
    const match = regex.exec(unformatText(eqptText))
    if (!match) return "0"
    const position = match.index + match[0].length

    return eqptText[position] + (eqptText[position + 1] ?? "")
  })
  // if (regex.includes("glace")) console.log(`(${regex})`, eqpt, eqptValue);
  return parseInt(eqptValue[0]) + parseInt(eqptValue[1])
}

// Shortcut function to make sum of access amounts (without passif, only access parts)
// Never send eqpts without access in parseEqptsByRegex, because "panoplies" with
// weapons/armor will not match (because equipments are not sent in the function) !
// So we need to slice AFTER
export const sumEqptsAsAccess = (texts: string[], eqpts: (Equipment | undefined)[], persoData: Perso): number =>
  parseEqptsByRegex(texts, eqpts, persoData, false).slice(4).reduce(sum, 0)

// text : string[], eqpts : eqpt[], persoData : Perso
export const parseEqptsByRegex = (
  texts: string[],
  eqpts: (Equipment | undefined)[],
  persoData: Perso,
  withPassif: boolean = true
): number[] => {
  // 24/05/2024 : Handle Passif level 12
  if (persoData.niv >= 12 && persoData.passif12 && withPassif) {
    eqpts = eqpts.concat({ montant: persoData.passif12 } as Equipment)
  }
  return eqpts.map((eqpt) => {
    if (!eqpt) return 0
    // For each regex, parse Eqpt, and do the sum of each regex (.reduce)
    const result = texts.map((reg) => parseEqptValue(reg, eqpt)).reduce((total, item) => total + item)

    // Handle condition bonus
    const bonus = parseEqptBonus(eqpt, texts, eqpts, persoData)
    // console.log("in parseEqptsByRegex : (result,bonus)", result, bonus);
    return result + bonus
  })
}

export const parseEqptBonus = (
  eqpt: Equipment,
  texts: string[],
  eqpts: (Equipment | undefined)[],
  persoData: Perso
): number => {
  // Check if bonus is corresponding to text and get the value
  const bonusValue = texts
    .map((text) => {
      if (!eqpt.condition) return 0
      const hasValue = unformatText(eqpt.condition.bonus)?.split(unformatText(text))[1]
      if (!hasValue) return 0
      return parseInt(hasValue.split(",")[0].split(" ")[0])
    })
    .reduce((total, item) => total + item)

  const bonus = eqptBonusQuantity(eqpt, eqpts, persoData) * bonusValue

  if (bonus)
    console.log(`Bonus déclenché (${texts[0]}${bonus}) pour ${persoData.nom} sur `, JSON.stringify(eqpt.condition))

  return bonus
}

export const eqptBonusQuantity = (eqpt: Equipment, eqpts: (Equipment | undefined)[], persoData: Perso): number => {
  let bonusQuantity = 0
  if (eqpt.condition) {
    switch (eqpt.condition.type) {
      case "classe": {
        // Check if the Primary or Secondary class are included in the class condition list
        const nbValidClass = [persoData.classeP, persoData.classeS].filter((pClasse) =>
          eqpt.condition?.value.includes(pClasse)
        ).length
        bonusQuantity = nbValidClass
        break
      }
      case "race": {
        bonusQuantity = eqpt.condition.value.includes(persoData.race) ? 1 : 0
        break
      }
      case "panoplie": {
        // Get eqptsName, excepted the selected eqpt (that can match panoplie, ex : Heldentod)
        const eqptsName = eqpts.map((eq) => eq && eq !== eqpt && unformatText(eq.nom))

        const eqptConditionValue = eqpt.condition?.value
        const panoplies = typeof eqptConditionValue === "string" ? eqptConditionValue.split(",") : eqptConditionValue
        const nbEqptsInPanop = eqptsName.filter((eqptName) =>
          // One of the listed panoplies is in the eqpt mane ?
          panoplies.some((panoplie) => eqptName && eqptName.includes(unformatText(panoplie)))
        ).length
        bonusQuantity = nbEqptsInPanop
        break
      }
      // There are 2 problems with PV condition effect :
      // 1) persoData.pv is read, so you need to save and refresh to see the synthesis updated
      // 2) If currently the perso met the condition, in the mini-game (jdr combat), the bonus will always be triggered, because "persoData" is low HP
      // This is why I didn't take into account this kind of data, "versatile data" like HP must not be used, for the moment !
      // case "PV":
      //   bonus = persoData.pv < Math.round(persoData.pvmax / parseInt(eqpt.condition.value)) && parseEqptBonus;
      // break;
      default:
        break
    }
  }
  return bonusQuantity
}

// #region Enemy

export function getNewEnemy(enemyData: Enemy): EnemyCombat {
  const loadingEnemy: Partial<EnemyCombat> = {}
  loadingEnemy.nom = enemyData.nom

  loadingEnemy.pvmax = loadingEnemy.pv = enemyData.pvmax

  const enemyStats = enemyData.stats.split(",")
  loadingEnemy.force = parseInt(enemyStats[0])
  loadingEnemy.dexté = parseInt(enemyStats[1])
  loadingEnemy.intel = parseInt(enemyStats[2])
  loadingEnemy.charisme = parseInt(enemyStats[3])
  loadingEnemy.esprit = parseInt(enemyStats[4])

  // Calcul des dégâts fixes
  const montantSkills = enemyData.skills
    // Ignorer les compétences passives, buff, soins, etc.
    .filter((skill) => !["passif", "esprit", "soin", "buff", "provocation"].some((text) => isTextInText(skill, text)))
    .map((skill) => {
      const skillText = skill.replaceAll(" ", "")
      // Trouver toutes les positions des "+"
      const plusPositions = [...skillText].map((char, i) => (char === "+" ? i : -1)).filter((i) => i !== -1)
      if (plusPositions.length === 0) return NaN

      // Calculer les montants après chaque "+"
      const amounts = plusPositions
        .map((pos) => {
          const value = parseInt(skillText.slice(pos + 1, pos + 3))
          // Don't count values with "D" for Dices, and "1,2,3,4" like "3D6"
          return isNaN(value) || value < 5 ? 0 : value
        })
        .filter((v) => !!v)
      const average = amounts.reduce((a, b) => a + b, 0) / amounts.length

      // In average, add Dices
      const dices = dicesAverageConversion(skillText)

      return average + dices
    })
    .filter((value) => !Number.isNaN(value))

  // Pour les ennemis, sachant que des sorts sont mal comptés (ex 1D8 +1D6 +4)
  // Je rajoute 50% de dégâts (contre x% par niveau pour les joueurs), que 50% pas 100% car les des (1D10,2D6,...) sont comptés !
  loadingEnemy.degat = Math.round((montantSkills.reduce(sum, 0) / montantSkills.length) * 1.5)
  // console.log(this.degat)

  return loadingEnemy as EnemyCombat
}

// #region Dices

export function dicesAverageConversion(skill: string): number {
  let dices = 0
  if (skill.includes("1D12")) {
    dices += 6.5
  }
  if (skill.includes("1D10")) {
    dices += 5.5
  }
  if (skill.includes("2D10")) {
    dices += 11
  }
  if (skill.includes("3D10")) {
    dices += 16.5
  }
  if (skill.includes("1D8")) {
    dices += 4.5
  }
  if (skill.includes("2D8")) {
    dices += 9
  }
  if (skill.includes("1D6")) {
    dices += 3.5
  }
  if (skill.includes("2D6")) {
    dices += 7
  }
  if (skill.includes("3D6")) {
    dices += 10.5
  }
  if (skill.includes("4D6")) {
    dices += 14
  }
  if (skill.includes("5D6")) {
    dices += 17.5
  }
  if (skill.includes("6D6")) {
    dices += 21
  }
  if (skill.includes("1D4")) {
    dices += 2.5
  }
  return dices
}

export function dicesConversion(skill: string): number {
  let dices = 0
  const roll = (number: 4 | 6 | 8 | 10 | 12): number => getRandomBetween(1, number)

  if (skill.includes("1D12")) {
    dices += roll(12)
  }
  if (skill.includes("1D10")) {
    dices += roll(10)
  }
  if (skill.includes("2D10")) {
    dices += roll(10) + roll(10)
  }
  if (skill.includes("3D10")) {
    dices += roll(10) * 2 + roll(10)
  }
  if (skill.includes("1D8")) {
    dices += roll(8)
  }
  if (skill.includes("2D8")) {
    dices += roll(8) + roll(8)
  }
  if (skill.includes("1D6")) {
    dices += roll(6)
  }
  if (skill.includes("2D6")) {
    dices += roll(6) + roll(6)
  }
  if (skill.includes("3D6")) {
    dices += roll(6) * 2 + roll(6)
  }
  if (skill.includes("4D6")) {
    dices += roll(6) * 3 + roll(6)
  }
  if (skill.includes("5D6")) {
    dices += roll(6) * 4 + roll(6)
  }
  if (skill.includes("6D6")) {
    dices += roll(6) * 5 + roll(6)
  }
  if (skill.includes("1D4")) {
    dices += roll(4)
  }
  return dices
}
