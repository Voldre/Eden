import { Equipment, Perso, Skill, Classes, Races, StatsName, RaceClassStatsValue } from "./model.js"
import {
  skillsJSON,
  skillsAwakenJSON,
  eqptJSON,
  persosJSON,
  galeryJSON,
  masterJSON,
  statsJSON,
  cardJSON,
  classes,
  iconsClasses,
  iconsEveil,
  elements,
  aoeDescInfo,
} from "./JDRstore.js"
import {
  callPHP,
  toastNotification,
  initDialog,
  parseEqptsByRegex,
  unformatText,
  capitalize,
  sum,
  sumEqptsAsAccess,
  isTextInText,
  dateToString,
  fillSelectOptions,
  setCookie,
  closeButton,
  createElement,
  inputSelector,
  addChangeListener,
  addClickListener,
  InputElement,
  SelectElement,
  eqptBonusQuantity,
  splitParenthesisText,
} from "./utils/index.js"
import { LoggerService } from "./utils/logger.js"

console.log("Skills JSON", skillsJSON)
console.log("Persos JSON", persosJSON)

const dialog = document.querySelector<HTMLDialogElement>("dialog")!

const buttonBuffs = document.querySelector<HTMLButtonElement>("#buttonBuffs")!

// Table Initialisation

console.log(
  "Combo de classes (Tableau X*Y) 20-20 :",
  classes.map((c1) => ({
    classe: c1,
    nb: classes.map(
      (c2) =>
        Object.values(persosJSON).filter(
          (p) => (p.classeP === c1 && p.classeS === c2) || (p.classeP === c2 && p.classeS === c1)
        )?.length ?? 0
    ),
  }))
)

const races: Races[] = ["Humain", "Ezelin", "Ursun", "Zumi", "Anuran", "Torturran", "Drakai", "Tuskar", "Ogre"]

const poids = ["Moyen", "Léger", "Lourd", "Léger", "Moyen", "Moyen", "Léger", "Lourd", "Lourd"]

const elementsCategories = elements.map((element) => {
  // Remove all accents (é,è,ç)
  const labelElement = unformatText(element)
  // Dégât xxx + || Dégât de xxx + ... ?
  return { regex: [`${element} +`], label: labelElement, img: true }
})

const statistiques: StatsName[] = ["Force", "Dextérité", "Intelligence", "Charisme", "Esprit"]

// Categories not in the synthesis, but used to calcule limits
const statsCategories = statistiques.map((stat) => {
  // Don't match "Résistance d'esprit" for "Esprit" stat
  const regex = stat === "Esprit" ? "(?<!résistance d')esprit" : stat
  return { regex: [`${regex} +`], label: unformatText(stat), img: false }
})

const synthesisCategories = [
  { regex: ["Dégât +"], label: "DGT", img: false },
  { regex: ["Faiblesse +"], label: "F", img: false },
  { regex: ["Soin +"], label: "S", img: false },
  { regex: ["Dégât physique +"], label: "P", img: false },
  ...elementsCategories.slice(0, 3),
  { regex: ["Dégât magique +", "Dégât élémentaire +"], label: "M", img: false },
  ...elementsCategories.slice(3),
  { regex: ["Dégât -", "Dégât reçu -"], label: "ARM", img: false },
]

// Main elements

const persoE = document.querySelector(".perso")!
let indexPerso: number = -1
let persoData: Perso | undefined

const nomE = document.querySelector<HTMLInputElement>("#nom")!

const classePElement = document.querySelector<SelectElement<Classes>>("#classeP")!
const classeSElement = document.querySelector<SelectElement<Classes>>("#classeS")!
const nivE = inputSelector("#niv", "number")

const pvmaxE = inputSelector("#pvmax", "number")
const pvE = inputSelector("#pv", "number")

const forceE = inputSelector("#force", "number")
const dextéE = inputSelector("#dexté", "number")
const intelE = inputSelector("#intel", "number")
const charismeE = inputSelector("#charisme", "number")
const espritE = inputSelector("#esprit", "number")

const forceBE = inputSelector("#forceB", "string")
const dextéBE = inputSelector("#dextéB", "string")
const intelBE = inputSelector("#intelB", "string")
const charismeBE = inputSelector("#charismeB", "string")
const espritBE = inputSelector("#espritB", "string")

const argentE = inputSelector("#argent", "string")
const personnaliteE = inputSelector(".personnalité", "string")
const backgroundE = inputSelector(".background", "string")

const notesE = inputSelector(".notes", "string")
const stickyE = inputSelector(".sticky", "string")

let persoEqpts: (Equipment | undefined)[] = []

const errorEqptE = document.querySelector<HTMLParagraphElement>("#errorEQPT")!

// RACES
const raceE = document.querySelector<SelectElement<Races>>("#race")!
addChangeListener(raceE, (e) => {
  const race = e.target.value
  document.querySelector<HTMLParagraphElement>(".poids")!.innerText = poids[races.indexOf(race)]
  // Verify stats repartition
  statsVerification()
})

// CLASSES
const allClassE = [classePElement, classeSElement]
const iconClassesEs = [...document.querySelector(".iconClasses")!.children] as HTMLImageElement[]

allClassE.forEach((classE, i) => {
  fillSelectOptions(
    classE,
    ["", ...classes].map((classe) => ({ value: classe, innerText: classe }))
  )

  const iconClassE = iconClassesEs[i] as HTMLImageElement

  addChangeListener(classE, (e) => {
    const selectedClass = e.target.value
    const selectedClassID = classes.indexOf(selectedClass)
    if (selectedClassID === -1) {
      console.log(`${selectedClass} is not a class (in the list)`)
      if (iconClassE) iconClassE.src = ""
    } else {
      if (iconClassE)
        iconClassE.src = `http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE${iconsClasses[selectedClassID]}.png`

      updateAvailableSkillsList()

      const classConfig = persoData?.guardian?.find((config) => config.classeP === selectedClass)

      if (classConfig) {
        classConfig.skills.forEach((skill, index) => {
          const competenceE = competenceEs[index]
          insertSkill(competenceE, skill)
        })

        // If guardian, apply for second class the primary class
        classeSElement.value = selectedClass

        updateAvailableSkillsList()

        const currentPv = (pvE.value / pvmaxE.value) * classConfig.pvmax
        pvE.value = Math.round(currentPv)
        pvmaxE.value = classConfig.pvmax

        // This syntaxe is 100% lighter than :
        // document.querySelector<HTMLInputElement>("#force")!.value = `${classConfig.force}`
        forceE.value = classConfig.force
        dextéE.value = classConfig.dexté
        intelE.value = classConfig.intel
        charismeE.value = classConfig.charisme
        espritE.value = classConfig.esprit
      }

      // Display armor type
      displayArmorTypes()

      statsVerification()
    }
  })
})

const displayArmorTypes = (): void => {
  const physicBorderClasses: Classes[] = ["Chevalier"]
  const magicBorderClasses: Classes[] = ["Sage", "Luminary"]

  const persoClasses = [allClassE[0].value, allClassE[1].value]
  const classesArmorTypes = persoClasses
    .map((classe) => statsJSON.classes.find((c) => c.Classe === classe))
    .filter((c) => !!c)

  let physicException = false
  let magicException = false

  physicBorderClasses.forEach((pClass) => {
    if (persoClasses.includes(pClass)) {
      physicException = true
    }
  })
  magicBorderClasses.forEach((pClass) => {
    if (persoClasses.includes(pClass)) {
      magicException = true
    }
  })

  let armorTypes = []

  if (physicException) {
    const otherClass = classesArmorTypes.filter((c) => !physicBorderClasses.includes(c.Classe))[0]
    armorTypes.push("lourd")
    if (!otherClass) {
      // Chevalier Chevalier
      armorTypes.push("leger")
    } else if (otherClass.armure !== "lourd") {
      armorTypes.push("leger")
      armorTypes.push(otherClass.armure)
    }
  } else if (magicException) {
    const otherClass = classesArmorTypes.filter((c) => !magicBorderClasses.includes(c.Classe))[0]
    armorTypes.push("magique")
    if (!otherClass) {
      // Sage Luminary - or one twice
      armorTypes.push("leger")
    } else if (otherClass.armure !== "magique") {
      armorTypes.push("leger")
      armorTypes.push(otherClass.armure)
    }
  } else
    armorTypes = classesArmorTypes.map((classStat) => classStat.armure).flat()
    // Display icons
  ;["magique", "leger", "lourd"].forEach((type) => {
    document.querySelector(`#${type}`)!.className = armorTypes.includes(type) ? "skillRangeIcon" : "hide skillRangeIcon"
  })
}

// CLASSES EVEILLES
iconClassesEs.forEach((iconClasseE, i) => {
  iconClasseE.addEventListener("click", () => {
    iconClassesEs.forEach((e2) => e2.classList.remove("awaken"))
    iconClassesEs[i].classList.add("awaken")

    const classe = allClassE[i].value

    defineAwaken(classe)
  })
})

const awakenSkillE = document.querySelector<HTMLElement & { id: Classes | "" }>(".awakenSkill")!

function defineAwaken(classe: Classes | ""): void {
  if (persoData?.guardian) return

  awakenSkillE.classList.add("hide")

  const stuffsName = equipementEs.map((eqptE) => eqptE.selectE.value.toLowerCase())
  const niv = nivE.value
  if (classe === "" || (niv < 10 && !stuffsName.includes("pistolet suspect"))) return

  awakenSkillE.classList.remove("hide")

  const nbUse = niv >= 15 ? 3 : niv >= 12 ? 2 : 1
  const nbTurns = nbUse === 1 ? "4" : "3"

  awakenSkillE.id = classe
  awakenSkillE.querySelector<HTMLParagraphElement>(".nom")!.innerText = `Eveil du ${classe}`
  awakenSkillE.querySelector<HTMLParagraphElement>(".effet")!.innerText = "Inactif"

  awakenSkillE.querySelector<HTMLParagraphElement>(".montant")!.innerText =
    `${nbUse} fois par combat : Eveil des compétences : Durée ${nbTurns} tours`

  const classeID = classes.indexOf(classe)
  awakenSkillE.querySelector<HTMLImageElement>(".icone")!.src =
    `http://voldre.free.fr/Eden/images/skillIcon/${iconsEveil[classeID]}.png`
  awakenSkillE.querySelector<HTMLParagraphElement>(".desc")!.innerText =
    `Eveil de la classe du ${classe}, ses compétences sont altérées et améliorées !`
}

// Click on awaken skill element
addClickListener(awakenSkillE, (e) => {
  if (e.target.id !== "awakenButton") {
    awakenSkillE.querySelector<HTMLParagraphElement>(".desc")!.classList.toggle("hide")
  }
})

addClickListener(document.querySelector<HTMLButtonElement>("#awakenButton")!, (e) => {
  let awakenClass // Classe à éveiller

  const nbUse = nivE.value >= 15 ? 3 : nivE.value >= 12 ? 2 : 1
  const nbTurns = nbUse === 1 ? "4" : "3"

  const buffTurnE = awakenSkillE.querySelector<HTMLElement & { children: [HTMLImageElement] }>(".buffTurn")!
  buffTurnE.style.cursor = "pointer"

  awakenClass = awakenSkillE.id as Classes

  const currentTurnE = buffTurnE.children[1] as HTMLParagraphElement | undefined
  if (e.target.innerText === "Inactif") {
    e.target.innerText = "Actif"
    e.target.style.color = "green"

    const turnOfBuffE = createElement("p", nbTurns)
    buffTurnE.append(turnOfBuffE)
    buttonBuffs.className = ""
  } else if (currentTurnE && parseInt(currentTurnE.innerText) > 1) {
    currentTurnE.innerText = `${parseInt(currentTurnE.innerText) - 1}`
  } else {
    e.target.innerText = "Inactif"
    e.target.style.color = "black"
    currentTurnE?.remove()
    buttonBuffs.className = "hide"
    awakenClass = undefined // Remove the awaken class for displayed skills
  }

  persoData?.skills.forEach((skill, index) => {
    insertSkill(competenceEs[index], skill, awakenClass)
  })
})

// PV
pvmaxE.addEventListener("change", () => statsVerification())

// Niv

const onChangeNiv = (niv: number): void => {
  updateSkillsSlots()

  // Nouveauté 15/08/23 : Calcul automatique du montant des stats, 12/05/24 : Add stats repertatition
  statsVerification()

  // Nouveauté 27/05/23 : 4eme accessoire au niveau 4
  if (niv >= 4) {
    equipementEs[equipementEs.length - 2].classList.remove("hide")
  } else {
    equipementEs[equipementEs.length - 2].classList.add("hide")
  }
  // Nouveauté 12/06/23 : 5eme accessoire au niveau 8
  if (niv >= 8) {
    equipementEs[equipementEs.length - 1].classList.remove("hide")
  } else {
    equipementEs[equipementEs.length - 1].classList.add("hide")
  }
  // Nouveauté 18/10/23 : Compétence éveillés
  if (persoData) defineAwaken(persoData.awaken)
  // Nouveauté 24/05/24 - 14/09/24 : Passif niveau 12 & 14
  setPassifs(niv)
}

const xpE = inputSelector("#xp", "number")!
addChangeListener(xpE, (e) => {
  const xp = e.target.value
  let niv
  // Update 02/04/24 : From lvl 10 to 15 : 200 xp instead of 150
  // Update 12/06/23 : From lvl 5 to 10 : 150 xp instead of 100
  if (xp >= 1150) {
    niv = Math.trunc((xp - 1150) / 200) + 10
  } else if (xp >= 400) {
    niv = Math.trunc((xp - 400) / 150) + 5
  } else {
    niv = Math.trunc(xp / 100) + 1
  }
  nivE.value = niv

  onChangeNiv(niv)
})

// Nouveauté 15/08 : Calcul automatique du montant des stats
function statsVerification(): void {
  const niv = nivE.value
  const sommeStats = statsValue(false).reduce(sum)
  const statsRequired = 61 + Math.trunc(niv / 5)

  document.querySelector<HTMLParagraphElement>("#errorStat")!.innerText =
    sommeStats !== statsRequired
      ? `/!\\ Attention : Erreur points de stats : ${sommeStats}, attendu : ${statsRequired}`
      : ""

  // 12/05/2024 Verify stats repartition according to race and classes
  if (!classePElement.value || !classeSElement.value || !raceE.value) return

  const { allStats } = getStats()
  // Rename stats name according to element
  allStats.Dexté = allStats.Dextérité
  allStats.Intel = allStats.Intelligence
  ;["force", "dexté", "intel", "charisme", "esprit"].forEach((statName) => {
    const statE = inputSelector(`#${statName}`, "number")
    // The maximum is 17
    if (statE.value < Math.min(allStats[capitalize(statName)], 17)) {
      statE.classList.add("wrong")
    } else {
      statE.classList.remove("wrong")
    }
  })
  // PV are always the right value (character cannot have more, stuff are handled)
  if (pvmaxE.value !== allStats.PVMax) {
    pvmaxE.classList.add("wrong")
  } else {
    pvmaxE.classList.remove("wrong")
  }
}

const statsE = inputSelector(".stats", "number")
statsE.addEventListener("change", () => {
  if (statsE.value > statsE.max) statsE.value = statsE.max

  statsVerification()

  getAllRes()
})

// STRESS
const stressE = inputSelector("#stress", "number")!

const updateStress = (): void => {
  document.querySelector<HTMLParagraphElement>("#stressImpact")!.innerText =
    stressE.value >= 50 ? `(Stats -${Math.trunc(stressE.value / 50)})` : ""
}
stressE.addEventListener("change", updateStress)

// COMPETENCES
// const competencesE = document.querySelector(".skills")!
// Map competence elements to easily interact with
type CompetenceE = HTMLElement & {
  selectE: HTMLSelectElement
  effetE: HTMLInputElement
  montantE: HTMLInputElement
  iconeWrapperE: HTMLElement & {
    children: [HTMLImageElement]
  }
  descE: HTMLInputElement
}

const competenceEs: CompetenceE[] = ([...document.querySelector(".skills")!.children] as HTMLElement[]).map(
  (competenceE) =>
    Object.assign(competenceE, {
      selectE: competenceE.children[0] as HTMLSelectElement,
      effetE: competenceE.children[1] as HTMLInputElement,
      montantE: competenceE.children[2] as HTMLInputElement,
      iconeWrapperE: competenceE.children[3] as HTMLElement & { children: [HTMLImageElement] },
      descE: competenceE.children[4] as HTMLInputElement,
    })
)

competenceEs.forEach((competenceE) => {
  // Click on skill element
  addClickListener(competenceE, (e) => {
    if (!e.target?.classList.contains("nom") && !e.target.classList.contains("buffTurn")) {
      // If click on select element, don't show/hide the desc ?
      competenceE.descE.classList.toggle("hide")
    }
  })
  // Selected skill
  addChangeListener(competenceE.selectE, (e) => {
    insertSkill(competenceE, e.target.value)
  })
})

function updateSkillsSlots(): void {
  // Display skils slots
  competenceEs.forEach((competenceE, index) => {
    const niv = nivE.value || 1
    const slotsAvailable = Math.trunc(niv / 2) + 3 // Update 17/05/23, 3 au lieu de 2, car 4 skills sur ~ 12-13 possibles
    if (index > slotsAvailable) {
      competenceE.classList.add("hide")
    } else if (index === competenceEs.length - 1) {
      // Update 29/01/25, passif 12 : +1 skill
      if (persoData?.passif12?.includes("+1 emplacement de sort")) {
        competenceE.classList.remove("hide")
      } else competenceE.classList.add("hide")
    } else {
      competenceE.classList.remove("hide")
    }
  })
}
function updateAvailableSkillsList(): void {
  // Depending on classes
  competenceEs.forEach((competenceE) => {
    // Skills list
    const selectedOption = competenceE.selectE.value

    const classeP = classePElement.value
    const classeS = classeSElement.value

    // Look at the First weapon name
    const weaponName = (document.querySelector(".arme")!.children[0] as HTMLInputElement).value

    // Liste des sorts des classes (+ arme)
    const options = Object.values(skillsJSON)
      .filter(
        (skill) =>
          skill.classe.includes(classeP) ||
          skill.classe.includes(classeS) ||
          skill.classe.some((mount) => isTextInText(weaponName, mount))
      )
      .map((skill) => ({ value: skill.nom, innerText: skill.nom }))

    fillSelectOptions(competenceE.selectE, options)
    competenceE.selectE.value = selectedOption
  })
}

function insertSkill(skillElement: CompetenceE, skillName: string, awakenClass?: Classes): void {
  const selectedSkill = Object.values(skillsJSON).find((skill) => unformatText(skill.nom) === unformatText(skillName))

  skillElement.selectE.value = skillName

  skillElement.classList.remove("awaken")

  const currentIconSrc = skillElement.iconeWrapperE.children[0].src

  if (!selectedSkill) {
    if (skillName !== "") {
      console.log(`${skillName} is not a skill (in the list)`)
    }
    skillElement.effetE.innerText = ""
    skillElement.montantE.innerText = ""
    skillElement.iconeWrapperE.children[0].src = ""
    skillElement.iconeWrapperE.children[0].title = ""
    skillElement.descE.innerText = ""
  } else {
    let selectedAwakenSkill
    if (awakenClass && selectedSkill.classe.includes(awakenClass)) {
      skillElement.classList.add("awaken")
      selectedAwakenSkill = Object.values(skillsAwakenJSON).find(
        (skill) => unformatText(skill.nom) === unformatText(skillName)
      )
    }

    const skillDesc = selectedAwakenSkill?.desc || selectedSkill.desc
    const skillMontant = selectedAwakenSkill?.montant || selectedSkill.montant

    const skillRange = selectedSkill.effet.split("AoE ")[1] ?? null // en bas [0] + "AoE"
    const selectedSkillEffet = skillRange ? selectedSkill.effet.split(" AoE")[0] : selectedSkill.effet
    skillElement.effetE.innerText = selectedSkillEffet

    if (skillRange) {
      const rangeI = aoeDescInfo.range.findIndex((x) => x === skillRange[0])
      const typeI = aoeDescInfo.type.findIndex((x) => x === skillRange[1])

      const skillRangeIconE = createElement("span", undefined, {
        title: `AoE en ${aoeDescInfo.rangeName[rangeI]} ${aoeDescInfo.typeName[typeI]}`,
        className: "skillRangeIcon",
        style: { backgroundImage: `url(http://voldre.free.fr/Eden/images/layout/${skillRange}.png)` },
      })

      const skillStatE = createElement("span", `/ ${selectedSkill.stat}`)

      skillElement.effetE.append(skillRangeIconE, skillStatE)
    } else {
      skillElement.effetE.innerText += ` / ${selectedSkill.stat}`
    }

    skillElement.montantE.innerText = skillMontant
    insertBuffInteraction(skillElement.iconeWrapperE, skillName, selectedSkill, skillMontant)
    skillElement.iconeWrapperE.children[0].src = `http://voldre.free.fr/Eden/images/skillIcon/${selectedSkill.icone}.png`
    skillElement.iconeWrapperE.title = skillDesc
    skillElement.descE.innerText = skillDesc

    // Update 29/07/2023, case de PV pour familiers
    const inputExists = skillElement.children.length >= 6
    if (inputExists) {
      // Check if it's same skill by icon
      const sameSkill = currentIconSrc.includes(selectedSkill.icone)
      if (sameSkill) return // No need to update
      skillElement.removeChild(skillElement.children[5]) // Update
    }

    if (selectedSkill.effet === "Invocation") {
      const pvPetE = createElement("input", undefined, { type: "number" })
      skillElement.append(pvPetE)
    }
    // Update 05/01/2024, add inputs to handle charges (light/dark)
    if (skillName === "Assaut du Chaos") {
      const textE = createElement("span", "Lum/Ten")
      const lumiereE = createElement("input", undefined, { type: "number", style: { width: "40px" } })
      const tenebresE = createElement("input", undefined, { type: "number", style: { width: "40px" } })

      const wrapperE = createElement("div", [textE, lumiereE, tenebresE], { style: { width: "max-content" } })
      skillElement.append(wrapperE)
    }

    // Update 14/01/2024, add inputs to handle number of hits
    if (skillName === "Euphorie") {
      const textE = createElement("span", "Coups")
      const hitsE = createElement("input", undefined, { style: { width: "40px" }, type: "number", max: "5" })
      const wrapperE = createElement("div", [textE, hitsE], { style: { width: "max-content" } })
      skillElement.append(wrapperE)
    }
  }
}

// Buff
const buffEs: (HTMLElement & {
  children: [InputElement<"number">, HTMLParagraphElement, HTMLParagraphElement]
})[] = [
  ...document.querySelectorAll<
    HTMLElement & { children: [InputElement<"number">, HTMLParagraphElement, HTMLParagraphElement] }
  >(".buffTurn"),
]

const malusEs = [...document.querySelector(".malus")!.children] as (HTMLElement & {
  children: [InputElement<"number">]
})[]

function insertBuffInteraction(
  buffTurnE: CompetenceE["iconeWrapperE"],
  skillName: string,
  selectedSkill: Skill,
  skillMontant: string
): void {
  const skillEffet = selectedSkill.effet
  buffTurnE.style.cursor = "pointer"

  const buffEvent = (): void => {
    if (buffTurnE.children[1]) {
      if (buffTurnE.children[1].innerText === "0") {
        buffTurnE.children[2]?.remove()
        buffTurnE.children[1].remove()
      } else {
        // Don't update, remove skill before
        return
      }
    }
    dialog.innerText = ""
    dialog.style.width = "60%"

    const turnText = createElement("p", "Tours ")

    const turnE = createElement("input", undefined, {
      type: "number",
      min: "1",
      max: "9",
      value: "3",
    })

    const confirmE = createElement("button", "Confirmer", {
      onClick: () => {
        const turnOfBuffE = createElement("p", turnE.value)
        const amountOfBuffE = createElement("p", hasAmount ? amountE.value : "")
        buffTurnE.append(turnOfBuffE, amountOfBuffE)
        buttonBuffs.className = "" // Show button
        dialog.close()
      },
    })

    // Event listener defined after createElement because confirmE is required
    addChangeListener(turnE, (e) => {
      confirmE.disabled = parseInt(e.target.value) < 1
    })

    const amountText = createElement("p", "Montants ")
    const amountE = createElement("input", undefined, { type: "number", min: "1", max: "20", value: "2" })

    const hasAmount = skillMontant.includes("1D") || skillMontant.includes("effet mode")

    const inputs = createElement("div", hasAmount ? [turnText, turnE, amountText, amountE] : [turnText, turnE], {
      style: { display: "flex", alignItems: "center" },
    })

    const name = createElement("p", skillName)
    const globalE = createElement("p", [name, inputs, confirmE, closeButton(dialog)], { className: "dialogBuff" })

    dialog.append(globalE)
    // Ouverture en "modal"
    dialog.showModal()
  }

  if (
    ["Provocation", "Buff", "Malus", "Transformation", "Status", "Invisible"].some((effet) =>
      skillEffet.includes(effet)
    )
  ) {
    buffTurnE.style.cursor = "url('images/layout/cursor-x.png'), auto"
    buffTurnE.addEventListener("click", buffEvent)
  }
}

buttonBuffs.addEventListener("click", () => {
  let buffExist = false
  buffEs.forEach((buffE) => {
    if (buffE.children.length > 1) {
      const turnLeftElement = buffE.children[1]
      if (turnLeftElement.innerText === "1") {
        buffE.children[2]?.remove()
        buffE.children[1].remove()
      } else {
        buffExist = true
        turnLeftElement.innerText = `${parseInt(turnLeftElement.innerText) - 1}`
      }
    }
  })
  malusEs.forEach((malusE) => {
    const turnLeftElement = malusE.children[0]
    const turnLeft = Math.max(0, turnLeftElement.value - 1)
    turnLeftElement.value = turnLeft
    if (turnLeft >= 1) {
      buffExist = true
    }
  })
  buttonBuffs.className = buffExist ? "" : "hide"
})

malusEs.forEach((malusE) => {
  addChangeListener(malusE.children[0], (e) => {
    if (e.target.value > 0) buttonBuffs.className = ""
  })
})
buffEs.forEach((buffE) => {
  buffE.addEventListener("click", () => {
    if (buffE.children.length > 1) {
      const turnLeftElement = buffE.children[1]
      if (turnLeftElement.innerText === "1") {
        buffE.children[2]?.remove()
        buffE.children[1].remove()
      } else {
        turnLeftElement.innerText = `${parseInt(turnLeftElement.innerText) - 1}`
      }
    }
  })
})

// EQUIPEMENTS

// Like competenceEs
type EquipmentE = HTMLElement & {
  selectE: HTMLSelectElement
  effetE: HTMLInputElement
  montantE: HTMLInputElement
  iconeE: HTMLImageElement
  descE: HTMLInputElement
}
const equipementEs: EquipmentE[] = ([...document.querySelector(".equipements")!.children] as HTMLElement[]).map(
  (equipementE) =>
    Object.assign(equipementE, {
      selectE: equipementE.children[0] as HTMLSelectElement,
      effetE: equipementE.children[1] as HTMLInputElement,
      montantE: equipementE.children[2] as HTMLInputElement,
      iconeE: equipementE.children[3] as HTMLImageElement,
      descE: equipementE.children[4] as HTMLInputElement,
    })
)
// Use function to get updated select value
const getPersoEqptsFromSelects = (): (Equipment | undefined)[] =>
  equipementEs.map((eqptE) =>
    Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) === unformatText(eqptE.selectE.value))
  )

equipementEs.forEach((equipementE) => {
  // Selected eqpt
  addChangeListener(equipementE.selectE, (e) => {
    const newEqpt = Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) === unformatText(e.target.value))
    insertEqpt(equipementE, newEqpt)

    // Update equipements variable on change
    persoEqpts = getPersoEqptsFromSelects()

    // Refresh all eqpt (for bonus condition)
    persoEqpts.forEach((eqpt, index) => {
      const eqptE = equipementEs[index]
      if (eqptE === equipementE) return // Don't update current eqpt again
      equipementEs[index].selectE.value = eqpt?.nom ?? ""
      insertEqpt(eqptE, eqpt)
    })
    getAllRes()
    createEquipmentSynthesis()
    updateAvailableSkillsList()
    statsVerification()
  })

  // Click on eqpt element
  addClickListener(equipementE, (e) => {
    if (!e.target.classList.contains("nom")) {
      // If click on select element, don't show/hide the desc ?
      equipementE.descE.classList.toggle("hide")
    }
  })
})

// selectedEqpt as an object eqpt
function insertEqpt(eqptElement: EquipmentE, selectedEqpt: Equipment | undefined): void {
  // Best update 18/08/2023 (finally !) : "la casse maj/min" the case (upper/lower) now doesn't matter !
  if (!selectedEqpt) {
    eqptElement.effetE.innerText = ""
    eqptElement.montantE.innerText = ""
    eqptElement.iconeE.src = ""
    eqptElement.iconeE.title = ""
    eqptElement.descE.innerText = ""
  } else {
    eqptElement.effetE.innerText = selectedEqpt.effet

    const bonusQuantity = persoData ? eqptBonusQuantity(selectedEqpt, persoEqpts, persoData) : 0
    const descParts = splitParenthesisText(selectedEqpt.montant)

    const conditionedDescE =
      !!bonusQuantity && !!descParts
        ? createElement("span", `(${descParts[1]})${bonusQuantity > 1 ? ` ×${bonusQuantity}` : ""} `, {
            style: { color: "goldenrod" },
          })
        : undefined

    eqptElement.montantE.innerHTML = "" // Reset
    eqptElement.montantE.append(
      ...(conditionedDescE ? [descParts![0], conditionedDescE, descParts![2]] : [selectedEqpt.montant])
    )

    eqptElement.iconeE.src = `http://voldre.free.fr/Eden/images/items/${selectedEqpt.icone}.png`
    eqptElement.iconeE.title = selectedEqpt.desc
    eqptElement.descE.innerText = selectedEqpt.desc

    // Update eqptElement 05/2024, case de PV pour monture
    if (eqptElement.children.length >= 6) {
      eqptElement.removeChild(eqptElement.children[5])
    }

    if (selectedEqpt.effet === "Monture de Combat") {
      const pvPetE = createElement("input", undefined, { type: "number" })
      eqptElement.append(pvPetE)

      const mountSkills = Object.values(skillsJSON).filter((skill) =>
        skill.classe.some((mount) => isTextInText(selectedEqpt.nom, mount))
      )

      eqptElement.descE.innerText += mountSkills.length
        ? `\nCompétences : ${mountSkills.map((skill) => skill.nom).join(", ")}`
        : ""
    }
  }
}

// INVENTAIRE
const inventaireE = document.querySelector<HTMLInputElement>(".inventaire")!

// Display items in the inventory
const getItemsInInventory = (inventory: string): void => {
  const inventoryUnformated = unformatText(inventory).replaceAll("bombes", "bombe").replaceAll("potions", "potion")

  const itemsInInventory = allItems.filter((item) => isTextInText(inventoryUnformated, item.title))

  const itemsE = document.querySelector(".items")!
  itemsE.innerHTML = ""

  itemsInInventory.forEach((item) => {
    const imgE = createElement("img", undefined, {
      src: item.src,
      title: `${item.title}\n${item.desc}\n${item.montant}`,
    })

    // Highlight equipments equipped
    if (persoEqpts.find((eqpt) => eqpt?.nom && isTextInText(eqpt.nom, item.title))) imgE.style.borderColor = "goldenrod"

    imgE.addEventListener("click", () => {
      dialog.innerText = ""

      const title = createElement("h2", item.title)

      const headerE = createElement("div", [document.importNode(imgE), title], { className: "itemHeader" })
      const desc = createElement("p", item.desc)

      dialog.append(headerE, desc)

      if (item.montant) {
        const montant = createElement("p", item.montant)
        const effet = createElement("p", item.effet)
        dialog.append(montant, effet)
      }

      dialog.append(closeButton(dialog))

      dialog.showModal()
    })

    itemsE.append(imgE)
  })
}

addChangeListener(inventaireE, (e) => getItemsInInventory(e.target.value))

//  PERSOS
const selectPersoE = document.querySelector<HTMLSelectElement>("#selectPerso")!
let selectedPerso = selectPersoE.value

const archiveE = document.querySelector<HTMLInputElement>("#archived")!

const persoOptions = Object.entries(persosJSON).map(([id, perso]) => ({
  value: `J${parseInt(id) + 1}`,
  innerText: perso.nom,
  hidden: perso.isArchived,
}))

const nbNewPersos = Object.values(persosJSON).filter((perso) => perso.joueur === undefined).length

// Default new slots for new characters (limited)
const newPersoOptions =
  nbNewPersos > 5
    ? []
    : [0, 1].map((i) => {
        const label = `J${Object.entries(persosJSON).length + i + 1}`
        return { value: label, innerText: label, hidden: false }
      })

if (!newPersoOptions.length) toastNotification("Limite de personnages temporaires atteinte", 2000, true)

fillSelectOptions(selectPersoE, [...persoOptions, ...newPersoOptions])

archiveE.addEventListener("change", () => {
  onArchive(archiveE.checked)
})

const onArchive = (isArchived: boolean): void => {
  Object.entries(persosJSON).forEach(([id, perso]) => {
    // Hidden if isArchived is matching
    selectPersoE.options[parseInt(id)].hidden = isArchived !== perso.isArchived
  })
  archiveE.checked = isArchived
}

//  LOADING
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has("perso")) {
    selectPersoE.value = `J${urlParams.get("perso")}`
    // loadFiche(urlParams.get('perso'));
    selectedPerso = selectPersoE.value
    indexPerso = selectPersoE.selectedIndex
    loadFiche()
    toastNotification(`Chargement réussi de ${selectedPerso}`)
  } else {
    indexPerso = 0
    loadFiche()
  }

  // Enable all buttons
  saveButton.disabled = false
  downloadButton.disabled = false
  screenshotButton.disabled = false

  callPHP({ action: "jdrGalerie" })

  // Fill galery
  if (!galeryJSON?.length) {
    toastNotification("Erreur : le chargement de la galerie à échouée", 4000, true)
  } else {
    galeryJSON.forEach((pic) => {
      if (pic.includes(".jpg") || pic.includes(".png") || pic.includes(".webp")) {
        const imgE = createElement("img", undefined, { src: `./images/jdrgalerie/${pic}` })
        galeryE.append(imgE)
      }
    })
  }
})

addChangeListener(selectPersoE, (e) => {
  const perso = e.target.value
  indexPerso = e.target.selectedIndex

  loadFiche()

  const newUrl = `${window.location.origin}${window.location.pathname}?perso=${indexPerso + 1}`
  window.history.pushState({}, perso, newUrl)
  toastNotification(`Chargement réussi de ${perso}`)
})

function loadFiche(): void {
  // Define perso
  persoE.id = indexPerso.toString()
  persoData = persosJSON[indexPerso]

  if (!persoData) return

  const guardian = persoData.guardian

  ;[...document.querySelectorAll(".guardianHide")].forEach((e) =>
    guardian ? e.classList.add("hide") : e.classList.remove("hide")
  )
  ;[...document.querySelectorAll(".guardianNotHide")].forEach((e) =>
    !guardian ? e.classList.add("hide") : e.classList.remove("hide")
  )

  fillSelectOptions(
    classePElement,
    ["", ...classes]
      // Filtre Gardien Eternel
      .filter((c) => !guardian || guardian?.find((config) => config.classeP === c))
      .map((classe) => ({ value: classe, innerText: classe }))
  )

  console.log(`N° de ${persoData.nom} : ${indexPerso + 1}`)

  nomE.value = persoData.nom
  nomE.title = `Perso n°${indexPerso + 1}`
  raceE.value = persoData.race
  classePElement.value = persoData.classeP
  classeSElement.value = persoData.classeS

  displayArmorTypes()
  xpE.value = persoData.xp
  nivE.value = persoData.niv

  onChangeNiv(persoData.niv)

  pvE.value = persoData.pv
  pvmaxE.value = persoData.pvmax

  stressE.value = persoData.stress
  updateStress()

  ppE.src = persoData.pp
  forceE.value = persoData.force
  dextéE.value = persoData.dexté
  intelE.value = persoData.intel
  charismeE.value = persoData.charisme
  espritE.value = persoData.esprit

  forceBE.value = persoData.forceB
  dextéBE.value = persoData.dextéB
  intelBE.value = persoData.intelB
  charismeBE.value = persoData.charismeB
  espritBE.value = persoData.espritB

  notesE.value = persoData.notes
  stickyE.value = persoData.sticky ?? ""

  onArchive(persoData.isArchived)

  // Classes du perso
  const classePID = classes.indexOf(persoData.classeP)
  const classeSID = classes.indexOf(persoData.classeS)

  iconClassesEs[0].id = persoData.classeP
  iconClassesEs[0].src = `http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE${iconsClasses[classePID]}.png`
  iconClassesEs[1].id = persoData.classeS
  iconClassesEs[1].src = guardian
    ? "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE20.png" // Messie
    : `http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE${iconsClasses[classeSID]}.png`

  // Nouveauté 18/10/23 : Compétence éveillés
  iconClassesEs.forEach((e) => e.classList.remove("awaken"))

  // Update equipements variable on load
  persoEqpts = persoData.eqpts.map((eqptName) =>
    Object.values(eqptJSON).find((eqpt) => unformatText(eqpt.nom) === unformatText(eqptName))
  )

  persoEqpts.forEach((eqpt, index) => {
    const eqptE = equipementEs[index]
    equipementEs[index].selectE.value = eqpt?.nom ?? ""
    insertEqpt(eqptE, eqpt)
  })

  getAllRes()
  statsVerification()

  createEquipmentSynthesis()

  updateAvailableSkillsList()

  // Fill skills
  persoData.skills.forEach((skill, index) => {
    const competenceE = competenceEs[index]
    insertSkill(competenceE, skill)
  })

  // Inventaire du perso
  inventaireE.value = persoData.inventaire

  getItemsInInventory(persoData.inventaire)

  document.querySelector<HTMLParagraphElement>(".poids")!.innerText = poids[races.indexOf(persoData.race)]

  argentE.value = persoData.argent

  personnaliteE.value = persoData.personnalite
  backgroundE.value = persoData.background
}

function statsValue(resistance: boolean): number[] {
  const statB = [forceBE, dextéBE, intelBE, charismeBE, espritBE]
  return [forceE, dextéE, intelE, charismeE, espritE].map((statE, index) => {
    const statMain = statE.value
    const statBWithRegex = statB[index].value.replace(/[^\d.+-]/g, "")

    const statsBValue = statBWithRegex.match(/^[-+]\d+|\d*$/)?.[0]
      ? parseInt(statBWithRegex.replace("+", "").replace("-", ""))
      : 0

    return resistance
      ? statsBValue !== 0
        ? statBWithRegex.includes("+")
          ? Math.ceil((statMain + statsBValue) / 2)
          : Math.ceil((statMain - statsBValue) / 2)
        : Math.ceil(statMain / 2)
      : statMain
  })
}
// SYNTHESE DES EQUIPEMENTS

function getAllRes(): void {
  if (!persoData) return
  const resAmount = statsValue(true)

  const montantBlocP = parseEqptsByRegex(["Blocage +", "Blocage physique +"], persoEqpts, persoData).reduce(sum, 0)
  const montantEsq = parseEqptsByRegex(["Esquive +"], persoEqpts, persoData).reduce(sum, 0)
  const montantBlocM = parseEqptsByRegex(["Blocage +", "Blocage magique +"], persoEqpts, persoData).reduce(sum, 0)
  const montantRes = parseEqptsByRegex(["Résistance d'esprit +"], persoEqpts, persoData).reduce(sum, 0)

  document.querySelector<HTMLParagraphElement>("#resForce")!.innerText =
    `Bloc ${resAmount[0]} ${montantBlocP ? `+ ${montantBlocP}` : ""}`
  document.querySelector<HTMLParagraphElement>("#resDexté")!.innerText =
    `Esq ${resAmount[1]} ${montantEsq ? `+ ${montantEsq}` : ""}`
  document.querySelector<HTMLParagraphElement>("#resIntel")!.innerText =
    `Bloc ${resAmount[2]} ${montantBlocM ? `+ ${montantBlocM}` : ""}`
  document.querySelector<HTMLParagraphElement>("#resEsprit")!.innerText =
    `Res ${resAmount[4]} ${montantRes ? `+ ${montantRes}` : ""}`
}

function createEquipmentSynthesis(): void {
  const eqptSynthesisE = document.querySelector(".equipements-synthese")!
  eqptSynthesisE.innerHTML = ""

  const accessValues: { label: string; value: number }[] = []

  const synthesisCategoryEs = synthesisCategories
    .map((category): [string, HTMLDivElement] | undefined => {
      if (!persoData) return undefined
      const eqptsValueList = parseEqptsByRegex(category.regex, persoEqpts, persoData)
      const eqptsValue = eqptsValueList.reduce(sum, 0)

      // 01/06/2024 : Get category over the defined limit for accessories (exclude passif)
      accessValues.push({
        label: category.label,
        value: sumEqptsAsAccess(category.regex, persoEqpts, persoData),
      })

      if (!eqptsValue || eqptsValue === 0) return undefined

      let categoryValue
      if (category.label === "DGT" && eqptsValueList[2]) {
        categoryValue = `${eqptsValue - eqptsValueList[2]} | ${eqptsValue - eqptsValueList[0] - eqptsValueList[1]}`
      } else {
        categoryValue = eqptsValue
      }

      const categoryValueE = createElement("p", `${categoryValue}`)

      const categoryHeaderE = category.img
        ? createElement("img", undefined, {
            title: category.label,
            src: encodeURI(`images/layout/${category.label}.png`),
          })
        : createElement("p", category.label)

      return [category.label, createElement("div", [categoryHeaderE, categoryValueE], { className: "synthese" })]
    })
    .filter((c) => !!c)

  // 01/06/2024 : Display category over the defined limit for accessories
  statsCategories.forEach((category) => {
    if (!persoData) return

    accessValues.push({
      label: category.label,
      value: sumEqptsAsAccess(category.regex, persoEqpts, persoData),
    })
  })

  if (!persoData) return

  const montantBlocP = sumEqptsAsAccess(["Blocage +", "Blocage physique +"], persoEqpts, persoData)
  const montantEsq = sumEqptsAsAccess(["Esquive +"], persoEqpts, persoData)
  const montantBlocM = sumEqptsAsAccess(["Blocage +", "Blocage magique +"], persoEqpts, persoData)
  const montantRes = sumEqptsAsAccess(["Résistance d'esprit +"], persoEqpts, persoData)

  const degatP = accessValues
    .filter((v) => ["DGT", "P"].includes(v.label))
    .map((v) => v.value)
    .reduce(sum, 0)
  const degatM = accessValues
    .filter((v) => ["DGT", "M"].includes(v.label))
    .map((v) => v.value)
    .reduce(sum, 0)
  const degatElems = accessValues.filter((v) => elements.map((e) => unformatText(e)).includes(v.label))

  console.log("Synthesis Access Values", accessValues)

  const accesLimitsByCategory = [
    { label: "Dégât (Phy)", limit: 6, value: degatP },
    { label: "Dégât (Mag)", limit: 6, value: degatM },
    ...degatElems.map((degatElem) => ({
      label: `Dégât (P|M) + ${degatElem.label}`,
      limit: 8,
      value: Math.max(degatP, degatM) + degatElem.value,
    })),
    { label: "Soin", limit: 6, value: accessValues.find((v) => v.label === "S")?.value },
    ...statsCategories.map((category) => ({
      label: category.label,
      limit: 2,
      value: accessValues.find((v) => v.label === category.label)?.value,
    })),
    { label: "Armure", limit: 5, value: accessValues.find((v) => v.label === "ARM")?.value },
    { label: "Blocage physique", limit: 3, value: montantBlocP },
    { label: "Esquive", limit: 3, value: montantEsq },
    { label: "Blocage magique", limit: 3, value: montantBlocM },
    { label: "Résistance d'esprit", limit: 3, value: montantRes },
  ]
  // console.log(accesLimitsByCategory);
  const eqptOverLimits = accesLimitsByCategory.filter((category) => category.value && category.value > category.limit)
  errorEqptE.innerText = eqptOverLimits.length ? "/!\\ Des montants dépassent les limites" : ""

  if (eqptOverLimits) {
    synthesisCategoryEs.forEach((synthesisCategoryE) => {
      if (
        eqptOverLimits.some(
          (category) =>
            (category.label.includes("Dégât")
              ? "DGT"
              : category.label.replace("Armure", "ARM").replace("Soin", "S")) === synthesisCategoryE[0]
        )
      ) {
        const categoryE = synthesisCategoryE[1]
        categoryE.id = "errorStat"
        eqptSynthesisE.append(categoryE)
      }
      eqptSynthesisE.append(synthesisCategoryE[1])
    })

    errorEqptE.addEventListener("click", () => showEqptErrors(eqptOverLimits))
  }
}

function showEqptErrors(
  eqptOverLimits: {
    label: string
    limit: number
    value: number | undefined
  }[]
): void {
  dialog.innerText = "La somme des montants des accessoires sont trop élevés sur les catégories suivantes :"
  const listE = createElement(
    "ul",
    eqptOverLimits.map((eqptLimit) =>
      createElement("li", `${eqptLimit.label} : ${eqptLimit.value} > ${eqptLimit.limit}`)
    )
  )

  dialog.append(listE)

  // Bouton de fermeture
  dialog.append(closeButton(dialog))
  dialog.showModal()
}

//  DOWNLOAD as FILE

// Function to download character data as file
const downloadButton = document.querySelector<HTMLButtonElement>("#download")!
downloadButton.addEventListener("click", () => {
  download(JSON.stringify(persosJSON[persoE.id]), `${persoData?.nom}_${dateToString(new Date())}.json`)
})

function download(data: string, filename: string): void {
  toastNotification("Téléchargement en cours ...", 3000)

  const file = new Blob([data], { type: "application/json" })

  // Créer une URL pour le Blob
  const url = URL.createObjectURL(file)

  // Créer un élément de lien, l'ajouter et le déclencher
  const link = createElement("a", undefined, { download: filename, href: url })
  link.click()
}

// Download a screenshot of the character page
const screenshotButton = document.querySelector<HTMLButtonElement>("#screenshot")!
screenshotButton.addEventListener("click", () => {
  screenshotButton.disabled = true
  toastNotification("Capture d'écran en cours ...", 5000)

  // @ts-expect-error Import in HTML file with : https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
  html2canvas(document.querySelector(".perso"), { backgroundColor: "rgb(36, 35, 35)" }).then(
    (canvas: HTMLCanvasElement) => {
      const link = createElement("a", undefined, {
        download: `screenshot ${persoData?.nom} ${dateToString(new Date())}.png`,
        href: canvas.toDataURL(),
      })
      link.click()
      screenshotButton.disabled = false
    }
  )
})

// PROFIL PICTURE
const ppE = document.querySelector<HTMLImageElement>("#pp")!
const galeryButtonE = document.querySelector("#galerieButton")!
const galeryE = document.querySelector(".galerie")!

// Change Profil Picture
ppE.addEventListener("click", () => {
  // console.log('pp clicked')
  galeryButtonE.classList.toggle("hide")
})
galeryButtonE.addEventListener("click", () => {
  galeryE.classList.remove("hide")
})

// Choosed picture
galeryE.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLImageElement)) return

  if (e.target.src.includes(".jpg") || e.target.src.includes(".png")) {
    ppE.src = e.target.src
    galeryE.classList.add("hide")
    galeryE.classList.add("hide")
  }
})

// ALL SAVE

// Save persos
const saveButton = document.querySelector<HTMLButtonElement>("#save")!

saveButton.addEventListener("click", () => {
  if (!masterJSON.allow) {
    toastNotification("Les sauvegardes sont bloquées par le MJ")
    return
  }
  const newPerso = savePerso()
  // Save to JSON...
  // Only store persosJSON current user (perso id)
  if (!newPerso) {
    toastNotification("Erreur : ID Perso ou Nom invalide", 4000, true)
    return
  }
  const result = setCookie("persosJSON", newPerso)
  if (result) {
    callPHP({ action: "saveFile", name: "persos" })
    toastNotification("Sauvegarde effectuée")
  } else {
    LoggerService.logError(`Plus de place sur la fiche de ${Object.values(newPerso)[0].nom}`)
    toastNotification("ECHEC : Plus de place disponible sur la fiche !", 10000, true)
  }
})

function savePerso(): {
  [x: string]: Perso
} | null {
  const skillsName = competenceEs.map((competenceE) => competenceE.selectE.value)

  const persoId = persoE.id
  const name = nomE.value

  if (!persoId || parseInt(persoId) < 0 || !name) return null

  const mainElement = {
    classeP: classePElement.value,
    pvmax: pvmaxE.value,
    force: forceE.value,
    dexté: dextéE.value,
    intel: intelE.value,
    charisme: charismeE.value,
    esprit: espritE.value,
    skills: skillsName,
  }

  persosJSON[persoId] = {
    nom: name,
    race: raceE.value,

    classeS: persosJSON[persoId]?.guardian ? classePElement.value : classeSElement.value,
    xp: xpE.value,
    niv: nivE.value,

    awaken: nivE.value >= 10 ? awakenSkillE.id : "",

    pv: pvE.value,

    stress: stressE.value,

    pp: ppE.src,

    ...mainElement,

    forceB: forceBE.value,
    dextéB: dextéBE.value,
    intelB: intelBE.value,
    charismeB: charismeBE.value,
    espritB: espritBE.value,

    eqpts: getPersoEqptsFromSelects().map((eqpt) => eqpt?.nom ?? ""),
    inventaire: inventaireE.value,
    argent: argentE.value,
    personnalite: personnaliteE.value,
    background: backgroundE.value,
    notes: notesE.value,
    sticky: stickyE.value,
    passif10: persosJSON[persoId]?.passif10 ?? undefined,
    passif12: persosJSON[persoId]?.passif12 ?? undefined,
    passif14: persosJSON[persoId]?.passif14 ?? undefined,
    isArchived: persosJSON[persoId]?.isArchived ?? false,
    joueur: persosJSON[persoId]?.joueur ?? null,
    guardian: persosJSON[persoId]?.guardian
      ? [
          // Save
          ...persosJSON[persoId].guardian.filter((config) => config.classeP !== classePElement.value),
          mainElement,
        ]
      : undefined,
  }

  console.log(persosJSON[persoId])

  // Update persoData
  persoData = persosJSON[persoId]

  // const newPerso: {
  //   [key: string]: Perso
  // } = {}
  // newPerso[persoId] = persosJSON[persoId]
  // console.log(newPerso)

  // Is equivalent to :
  return { [persoId]: persosJSON[persoId] }
}

// Global Save

// Show/Hide other pages of Eden
const buttonIframe = document.querySelector<HTMLButtonElement>("#buttonIframe")!
addClickListener(buttonIframe, (e) => {
  if (e.target.innerText === "Afficher le site") {
    e.target.innerText = "Masquer le site"
  } else {
    e.target.innerText = "Afficher le site"
  }
  document.querySelector("iframe")!.classList.toggle("hide")
})

function syntheseDesc(): string {
  let description = `La synthèse résume les montants de dégâts et d'armures issus des équipements.<br/> 
  Les montants conditionnels (panoplie, classe, ...) sont pris en compte (07/04/24), voici la légende :<br/>`
  synthesisCategories.forEach((category) => {
    if (category.img) {
      description += `<br/><img src='http://voldre.free.fr/Eden/images/layout/${category.label}.png'/> = Dégât de ${category.label}`
    } else {
      description += `<br/>${category.label} : ${category.regex[0].replace("+", "").replace("Soin", "Soin effectué")}`
    }
  })
  return description
}

const passifPoints12Desc = `1 point :<ul><li>Dégât +1</li><li>Soin +1</li><li>Dégât reçu -1</li><li>PV +7.5</li><li>Familier : Dégât et Soin +1</li></ul>
2 points :<ul><li>Blocage Physique +1</li><li>Esquive +1</li><li>Blocage Magique +1</li><li>Résistance d'esprit +1</li><li>Montant des sorts +1</li><li>Une statistique +1</li></ul>`

const passifPoints34Desc = `3 points :<ul><li>+1 emplacement de sort</li></ul>
4 points :<ul><li>Durée des sorts +1</li></ul>`

const passifWarning = `<span style="color: lightcoral;">/!\\ Attention : vous ne pourrez plus facilement changer votre passif après avoir choisi !</span><br/>
A noter : ces montants ne comptent pas dans la limite des stuffs (voir "Equipements - Infos")`

const labelsDescription = {
  force:
    "Permet d'utiliser des attaques lourdes, de pousser, de soulever.<br/>Si la stat est à 1 ou 2 : Impossible de tenir une arme. 0 : Immobile. <br/>Permet de bloquer des coups physiques (Dé/2)<br/><br/> Un blocage à 20 inflige 5 dégâts de plus. <br/>Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.<br/>Le blocage est limité à 13.",
  dexté:
    "Permet d'utiliser des attaques agiles et rapide, de se mouvoir, courir.<br/>Si la stat est à 1 ou 2 : Impossible de se déplacer. 0 : Immobile. <br/>Permet d'esquiver des attaques mono-cible (Dé/2) et quelques AoE selon le contexte (voir Infos JDR).<br/><br/> Une esquive à 20 inflige 5 dégâts de plus. <br/> Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.<br/>L'esquive est limité à 13.",
  intel:
    "Permet d'utiliser des attaques magiques, de tester son érudition, sa réflexion.<br/>Si la stat est à 1 ou 2 : Impossible de réfléchir, action directe. 0 : Immobile. <br/>Permet de bloquer des coups magiques (Dé/2)<br/><br/> Un blocage à 20 inflige 5 dégâts de plus.<br/> Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.<br/>Le blocage est limité à 13.",
  charisme:
    "Permet d'intéragir avec les autres personnes dans différents contexte :<br/> éloquence, persuasion, négociation, menace, distraction, ... <br/><br/> Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.",
  esprit:
    "Permet d'utiliser des buffs, des débuffs et des invocations.<br/>Si la stat est à 3 ou 4 : Immobile, 1 ou 2 : Evanouissement. 0 : Mort cérébrale. <br/> Permet aussi de résister (Dé/2) à des envoûtements (contrôle d'esprit, peur) <br/><br/> Les stats sont limitées à 17, et 17 (+1) avec buff/stuff.<br/>La résistance est limitée à 13.",
  niv: "Augmente automatiquement tous les 100 points d'expériences du Niveau 1 à 5, puis tous les 150 de 6 à 10, puis 200.<br/> Tous les niveaux paire (2,4,6,8), vous obtenez une compétence.<br/> Au Niveau 5 vous avez +1 en Esprit.<br/> Au Niveau 10 et 15, c'est +1 où vous voulez.",
  pv: "Statistique des PV, augmente de 5 par niveau.",
  stress:
    'Fatigue/Stress max : 200%. Chaque 50%, les stats diminue de 1 (4 max).<br/> La fatigue s\'accumule au fur et à mesures des combats (sauf tour des cieux). Le stress uniquement dans les zones dédiées.<br/><br/>Le stress "accentué" augmente de 50%, la "réduction" diminue de 33%.',
  infoEQPT:
    "Changer d'arme en combat (si équipée) se fait en début de tour (action instantanée).<br/>Sinon, échanger d'arme ou d'accessoire prend 1 tour.<br/><br/>Porter une armure non adapté (magique, léger, lourd) implique des malus de stats (voir page \"Infos JDR\", section \"Armure\").<br/><br/>Le montant total de l'ensemble des stuffs est limité : <ul><li>+2 de montant des sorts</li><li> +1 durée des sorts</li><li> -1 durée des malus</li><li>+50% PV soin reçu</li><li>+50% de dégât critique</li><li>Chance d'être visé (+ compétence) : 90% / -90%</li></ul><br/>Le montant fixe total (hors %) des accessoires est limité : <ul><li>+2 par stat</li><li>+3 blocage/esquive</li><li>Soins (infligé, reçu) : 6</li><li>Dégâts infligés (Soi, Pet) : 6 (+2 si bonus élémentaire)</li><li>Dégâts reçu (armure) : 5</li></ul>",
  //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
  synthese: syntheseDesc(),
  passif10: `Le passif niveau 10 consiste en un ajout de montant de stats.<br/>Vous avez 2 points à répartir dans les montants suivant :<br/>${passifPoints12Desc}${passifWarning}`,
  passif12: `Le passif niveau 12 consiste en un ajout de montant de stats.<br/>Vous avez 4 points à répartir dans les montants suivant (max 2 points par montant, sauf montant 3 & 4) :<br/>${passifPoints12Desc}${passifPoints34Desc}${passifWarning}`,
  passif14: `Le passif niveau 14 octroi au personnage une nouvelle capacité unique, il peut s'agir d'un passif ou d'une aptitude.
  <br/>Ces capacités sont similaires à celles des boss, car le niveau 14+ reflète un très haut niveau de puissance.
  <br/>Voici la liste des capacités...
  <br/><br/>Capacités utilisables 2 fois par séance : 
  <ul>
  <li>Survivaliste : Survie à 1 PV à un coup fatal, et immunise au prochain coup reçu (s'il y en a un) ce même tour (ne fonctionne pas 2 fois le même tour)</li>
  <li>Propagation : Change la portée d'un sort Mono en AoE courte-portée, ou AoE courte en grande, si sort de buff/malus : durée -1 tour
    <ul><li>Exception sur la durée : Parasite, Blessure Douloureuse, Silence et Scellement dure entre 2 et 3 tours. Dédoublement dure 1 tour max.</li></ul>
  </li>
  <li>Amplification : Augmente de 50% tout les effets (stat, bloc, montant, ...) des sorts de buff (sauf sort d'atk/malus, et indéfni). Les sorts Buff et Soin, la partie Soin n'est pas amplifiée.
    <ul><li>Exception : Les stats du Sacrifice d'Ombre ne sont boostés que de +1.</li><li>Les sorts boostés par les éveils (ex : Aura : Bouclier Protecteur, Intégration) sont limités à +4 max (au lieu de +5)</li></ul>
  </li>
  </ul>
  Capacités utilisables 3 fois par séance :
  <ul>
  <li>Seconde Chance : Relance de dé (sauf si échec critique)</li>
  <li>Adaptation : Changement de stuff en combat sans contrepartie, poids supportable augmenté</li>
  <li>Attaque Chargé : 1 tour d'incantation (sans 1er jet de dé), l'attaque aura +33% de dégât et l'ennemi -3 Bloc/Esq/Res</li>
  </ul>
  Capacité activée en permanence : 
  <ul>
  <li>Constitution Supérieure : Esprit +1 et +3 points à choisir sur le Passif 12, toujours avec la limite totale de 2 points par montant.</li>
  </ul>
  A noter : Les capacités liés aux sorts ne sont pas consommées en cas d'échec, sauf en cas de critique (19,20)`,
  guardianFatigue:
    "En tant que Gardien Eternel, vous avez la possibilité de Switcher de classe. Mais cela n'est pas sans coût.<br/>- Chaque switch augmente votre fatigue (entre 50 et 10 selon votre niveau).<br/>- Avant le niveau 10, le switch consomme votre tour. Au-delà, le switch devient une action instantanée.",
}

initDialog(labelsDescription)

// Display information about all basic stats of the character (race, class, level)

const infoStatsE = document.querySelector("#infoStats")!

infoStatsE.addEventListener("click", () => {
  // Calculation of all stats
  const niv = nivE.value

  if (!classePElement.value || !classeSElement.value || !raceE.value) return
  const { sumStats, allStats, pvStuff } = getStats()

  // Reset dialog
  dialog.innerText = ""
  dialog.style.width = "75%"

  const titleE = createElement("h2", "Statistique de référence")

  const pvElem = createElement(
    "p",
    `PV : ${allStats.PVMax} = ${allStats.PV} (base) + ${5 * (niv - 1)} (niveau) + ${pvStuff} (stuff)`
  )

  // Count stats over 17
  const statOver = statistiques.map((statName) => Math.max(allStats[statName] - 17, 0)).reduce(sum)

  const statsElem = createElement(
    "div",
    statistiques.map((statName) => {
      const statNameE = createElement("p", statName)

      const over = Math.max(allStats[statName] - 17, 0)
      return createElement("div", [statNameE, `${allStats[statName]}${over > 0 ? ` (-${over})` : ""}`], {
        className: "stat",
      })
    }),
    { className: "stats" }
  )

  const nbStatsToChoose = 60 - sumStats + Math.max(Math.ceil((niv - 9) / 5), 0)
  const nivInfoE = createElement("p", `+ ${nbStatsToChoose + statOver} stat(s) au choix, car niveau ${niv}`)

  const globalE = createElement("p", [titleE, pvElem, statsElem, nivInfoE], { className: "dialogStats" })

  if (60 - sumStats > 1) {
    const classWithPointsToChoose = createElement(
      "p",
      "L'ingénieur et le Chevalier Dragon ont chcaun 1 point en plus à répartir"
    )
    globalE.append(classWithPointsToChoose)
  }

  globalE.append(closeButton(dialog))

  dialog.append(globalE)
  // Ouverture en "modal"
  dialog.showModal()
})

const getStats = (): {
  sumStats: number
  allStats: { [key: string]: number }
  pvStuff: number
} => {
  const race = raceE.value
  const classeP = classePElement.value
  const classeS = classeSElement.value
  const niv = nivE.value

  const classesStats = statsJSON.classes.filter((e) => [classeP, classeS].includes(e.Classe))

  const raceStats = statsJSON.races.find((e) => e.Race === race)

  const pvStuff = persoData ? parseEqptsByRegex(["PV +"], persoEqpts, persoData).reduce(sum, 0) : 0

  const allStats = raceStats
    ? sumObjectsByKey<RaceClassStatsValue>(classesStats[0], classesStats[1] ?? classesStats[0], raceStats)
    : sumObjectsByKey<RaceClassStatsValue>(classesStats[0], classesStats[1] ?? classesStats[0])

  const sumStats =
    allStats.Force + allStats["Dextérité"] + allStats.Intelligence + allStats.Charisme + (allStats.Esprit - 2)

  // Esprit is "- 1" under level 5
  allStats.Esprit += niv < 5 ? -1 : 0
  allStats.PVMax = allStats.PV + 5 * (niv - 1) + pvStuff

  return { sumStats, allStats, pvStuff }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sumObjectsByKey<T extends { [key: string]: any }>(...objs: T[]): Record<string, number> {
  const objsWithValue = objs.map((obj) => {
    const filteredObj: Record<string, number> = {}

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "number") {
        filteredObj[key] = value
      }
    }
    return filteredObj
  })
  return objsWithValue.reduce(
    (a, b) => {
      for (const k in b) {
        a[k] = (a[k] || 0) + (b?.[k] || 0)
      }
      return a
    },
    {} as Record<string, number>
  )
}

function setPassifs(niv: number): void {
  const perso = persosJSON[persoE.id]

  const passif10E = document.querySelector("#passif10")!
  const passif12E = document.querySelector("#passif12")!
  const passif14E = document.querySelector("#passif14")!
  ;[passif10E, passif12E, passif14E].forEach((passifE, i) => {
    passifE.innerHTML = ""
    if (niv >= 10 + i * 2) {
      passifE.classList.remove("hide")
    } else passifE.classList.add("hide")
  })

  if (niv >= 10 && perso.guardian) {
    const li = createElement(
      "li",
      `Passif 10 (Gardien Eternel) ${perso.passif10 ? `: ${perso.passif10}` : "à définir : 2 points à répartir (cliquez)"}`
    )
    passif10E.append(li)
  }

  if (niv >= 12) {
    const li = createElement(
      "li",
      `Passif 12 ${perso.passif12 ? `: ${perso.passif12}` : "à définir : 4 points à répartir (cliquez)"}`
    )
    passif12E.append(li)
  }

  if (niv >= 14) {
    const li = createElement("li", `Passif 14 "${perso.passif14 ? `: ${perso.passif14}` : " à définir (cliquez)"}`)
    passif14E.append(li)
  }

  // Set fatigue cost for guardian
  let fatigueCost
  if (niv < 5) {
    fatigueCost = 50
  } else if (niv < 9) {
    fatigueCost = 40
  } else if (niv < 12) {
    fatigueCost = 30
  } else if (niv < 15) {
    fatigueCost = 20
  } else {
    fatigueCost = 10
  }

  document.querySelector<HTMLParagraphElement>("#guardianFatigue")!.innerText =
    `${fatigueCost} ${niv >= 10 ? "(Instant)" : "(1 tour)"}`
}

const getCards = Object.values(cardJSON)
  .filter((card) => card.kind === "composant")
  .map((card) => ({
    title: card.name,
    desc: card.description,
    montant: "",
    effet: card.value.toString(),
    src: `http://voldre.free.fr/Eden/images/items/${card.kindId}.png`,
  }))

const getEqpts = Object.values(eqptJSON).map((eqpt) => ({
  title: eqpt.nom,
  desc: eqpt.desc,
  montant: eqpt.montant,
  effet: eqpt.effet,
  src: `http://voldre.free.fr/Eden/images/items/${eqpt.icone}.png`,
}))

const allItems = [...getCards, ...getEqpts]
