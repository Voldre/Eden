import {
  skillsJSON,
  eqptJSON,
  masterJSON,
  enemyJSON,
  enemyGenericJSON,
  statsJSON,
  persosJSON,
  getData,
  elements,
} from "./JDRstore.js"
import { Enemy, Equipment, Perso, Skill, StatsName } from "./model.js"
import {
  addChangeListener,
  addClickListener,
  callPHP,
  createElement,
  shortAndLongEventsOnClick,
  fillSelectOptions,
  inputElement,
  inputSelector,
  isTextInText,
  setCookie,
  toastNotification,
  unformatText,
} from "./utils/index.js"

const logged = !!document.querySelector(".admin")

// Show/Hide other pages of Eden
const buttonIframe = document.querySelector<HTMLButtonElement>("#buttonIframe")
if (buttonIframe)
  addClickListener(buttonIframe, (e) => {
    if (e.target.innerText === "Afficher le site") {
      e.target.innerText = "Masquer le site"
    } else {
      e.target.innerText = "Afficher le site"
    }
    document.querySelector("iframe")!.classList.toggle("hide")
  })

let allSlots: HTMLElement[]

// Main Elements

let ennemiEs = [...document.querySelectorAll<HTMLElement>(".infoEnnemi")!]
const persoEs = [...document.querySelectorAll<HTMLElement & { children: [HTMLInputElement] }>(".perso"!)]

const nbPE = inputSelector("#nbP", "number")

const tourE = inputSelector("#tour", "number")

// Update slots when 1) Enemy loaded, 2) Enemy slot added, 3) Perso selected
function updateSlots(): void {
  // Update enemy list
  ennemiEs = [...document.querySelectorAll<HTMLElement>(".infoEnnemi")!]

  const enemiesList = ennemiEs.filter((infoE) => !!infoE.querySelector<HTMLInputElement>("#pvmax")?.value)
  const persosList = persoEs.filter((persoE) => !!persoE.children[0].value)
  allSlots = [...enemiesList, ...persosList]
}

// Enemies Select Options
;[...document.querySelectorAll<HTMLSelectElement>(".ennemi")].forEach((selectEnnemiE) => {
  const allowedEnnemiesPart = ["Veyda", "Champi Baga"]

  const options = [
    { value: "0", innerText: "" },
    ...Object.entries(enemyJSON)
      .filter(
        // If logged : take all, else : take allowed enemies
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, enemy]) => logged || allowedEnnemiesPart.some((enemyPart) => enemy.nom.includes(enemyPart))
      )
      .map(([index, enemy]) => ({
        value: index,
        innerText: enemy.nom,
      })),
  ]

  fillSelectOptions(selectEnnemiE, options)

  // Change enemy selected

  addChangeListener(selectEnnemiE, (e) => {
    loadEnemy(e.target.value, e.target.closest(".infoEnnemi")!)
    toastNotification(`Chargement de l'ennemi réussi : ${e.target.value}`)
  })
})

function loadEnemy(indexEnemy: string, ennemiElement: HTMLElement, genericEnemy: Enemy | undefined = undefined): void {
  const enemyData = genericEnemy || enemyJSON[indexEnemy]

  const weaknessesE = ennemiElement.querySelector("#weaknesses")!
  weaknessesE.innerHTML = ""

  const descE = ennemiElement.querySelector<HTMLParagraphElement>("#desc")!
  const dropE = ennemiElement.querySelector<HTMLParagraphElement>("#drop")!
  const visuelE = ennemiElement.querySelector<HTMLParagraphElement>(".visuel")!
  const iconE = ennemiElement.querySelector<HTMLImageElement>(".icon")!
  const pvE = inputSelector("#pv", "number", ennemiElement)
  const pvMaxE = inputSelector("#pvmax", "number", ennemiElement)
  const forceE = inputSelector("#force", "string", ennemiElement)
  const dextéE = inputSelector("#dexté", "string", ennemiElement)
  const intelE = inputSelector("#intel", "string", ennemiElement)
  const charismeE = inputSelector("#charisme", "string", ennemiElement)
  const espritE = inputSelector("#esprit", "string", ennemiElement)

  if (!enemyData || !enemyData.pvmax) {
    const errorMessage = `${enemyData?.nom ?? indexEnemy} ${!enemyData.pvmax ? "has no HP !" : "is not an enemy (in the list)"}`
    toastNotification(errorMessage, 5000, true)
    console.error(errorMessage)
    // ennemiElement.querySelector('#nom').innerText = "";
    descE.innerText = ""
    dropE.innerText = ""
    visuelE.innerText = "Switch..."
    iconE.src = ""
    pvE.value = 0
    pvMaxE.value = 0

    forceE.value = ""
    dextéE.value = ""
    intelE.value = ""
    charismeE.value = ""
    espritE.value = ""
    ;[...ennemiElement.querySelectorAll<HTMLParagraphElement>(".competence")].forEach((e) => (e.innerText = ""))

    return
  }

  descE.innerText = enemyData.desc && `Desc : ${enemyData.desc}`

  enemyData.weaknesses
    ?.filter((w) => !!w)
    .forEach((element) =>
      weaknessesE.appendChild(
        createElement("img", undefined, {
          className: "skillRangeIcon",
          src: `images/layout/${unformatText(element)}.png`,
        })
      )
    )
  dropE.innerText = enemyData.drop && `Drop : ${enemyData.drop}`

  visuelE.innerText = enemyData.visuel3D
  if (enemyData.visuel3D !== "Switch...")
    iconE.src = `http://voldre.free.fr/Eden/images/monsters/${enemyData.visuel3D}.png`
  iconE.alt = enemyData.visuel3D.toLowerCase()
  pvE.value = enemyData.pvmax

  const bossIconE = ennemiElement.querySelector("#boss_icon")!

  if (enemyData.pvmax >= 200) bossIconE.classList.remove("hide")
  else bossIconE.classList.add("hide")

  const nbP = nbPE.value // new functionality 28/08/2023
  pvMaxE.value =
    nbP !== 3
      ? Math.round(enemyData.pvmax * (1 + (nbP - 3) * 0.33))
      : enemyData.pvmax >= 200 && logged
        ? enemyData.pvmax + 100
        : enemyData.pvmax

  // Stats
  forceE.value = enemyData.stats.split(",")[0]
  dextéE.value = enemyData.stats.split(",")[1]
  intelE.value = enemyData.stats.split(",")[2]
  charismeE.value = enemyData.stats.split(",")[3]
  espritE.value = enemyData.stats.split(",")[4]

  // Skills de l'ennemi
  enemyData.skills.forEach((skill, index) => {
    const competenceE = [...ennemiElement.querySelectorAll(".competence")][index]
    // innerHTML because enemy skill can have <br/>
    competenceE.innerHTML = skill
  })

  if (logged) updateSlots()
}

if (!logged) {
  document.querySelector("#pnjTurnE")!.addEventListener("click", () => {
    ;[...document.querySelector("#buffs")!.querySelectorAll<HTMLInputElement>('input[type="number"]')].forEach(
      (buffTurnE) => {
        const buffE = inputElement(buffTurnE, "number")
        if (buffE.value > 0) {
          buffE.value -= 1
        }
      }
    )
  })
  throw new Error("Not logged")
}

// load notes
const notesE = document.querySelector<HTMLInputElement>(".notes")!
notesE.value = masterJSON.notes

console.log("Enemy JSON", enemyJSON)

// Display all persos ID
console.log(
  "Persos JSON",
  Object.entries(persosJSON).map((perso) => {
    return { "n°": parseInt(perso[0]) + 1, p: perso[1].nom }
  })
)

if (window.location.href.includes("html")) {
  console.error("Page must not be read in .html, use .php instead")
  stop()
}

// Next turn
const allTurnE = [...document.querySelectorAll(".nextTurn")]

allTurnE.forEach((turnE) => turnE.addEventListener("click", () => nextTurn()))
document.addEventListener("keydown", (e) => {
  if (e.key === "²") nextTurn()
})

function nextTurn(): void {
  const currentTurnE = document.querySelector("#currentTurnE")
  const mainE = currentTurnE?.closest<HTMLElement>(".perso") || currentTurnE?.closest<HTMLElement>(".infoEnnemi")

  if (!allSlots || !currentTurnE || !mainE) {
    toastNotification("Impossible de passer le tour", 4000, true)
    return
  }

  let slotIndex = allSlots.indexOf(mainE) // From 0 (first enemy index) to allSlots.length- 1 (last enemy/perso index)

  // Slot index + 1 = length === last
  if (slotIndex !== undefined && allSlots.length === slotIndex + 1) {
    // If all done, new turn
    tourE.value += 1
    slotIndex = -1
  }

  // Turn of character done
  ;[...mainE.querySelector("#buffs")!.querySelectorAll<HTMLInputElement>('input[type="number"]')].forEach(
    (buffTurnE) => {
      const buffE = inputElement(buffTurnE, "number")
      if (buffE.value > 0) {
        buffE.value -= 1
      }
    }
  )

  currentTurnE.classList.add("hide")!
  currentTurnE.id = ""
  const nextTurnE = allSlots[slotIndex + 1]?.querySelector(".nextTurn")
  if (nextTurnE) {
    nextTurnE.classList.remove("hide")
    nextTurnE.id = "currentTurnE"
  }
}

// Disable the possibility of launching many audio simultaneously
const audiosE = document.getElementsByTagName("audio")
const currentMusicE = document.getElementById("currentMusic")!

document.addEventListener(
  "play",
  (e) => {
    for (let i = 0, len = audiosE.length; i < len; i++) {
      if (audiosE[i] !== e.target) {
        audiosE[i].pause()
        if (audiosE[i].currentTime < 30) {
          audiosE[i].currentTime = 0
        }
      }
    }

    const currentBGME = e.target instanceof HTMLElement && e.target.previousElementSibling
    if (currentBGME instanceof HTMLParagraphElement) {
      currentMusicE.innerText = `- ${currentBGME.innerText} ${currentBGME.id.includes("bgm") ? `(${currentBGME.id})` : ""}`
    }
  },
  true
)

const abnormalWeaknesses = Object.values(enemyJSON)
  .filter((enemy) => !enemy.nom.includes("Veyda") && enemy.pvmax < 500)
  .map((enemy) => {
    const weaknesses = elements.filter((element) => enemy.weaknesses?.includes(element))
    if (weaknesses.length !== 2) return { nom: enemy.nom, elements: weaknesses }
    return undefined
  })
  .filter((w) => !!w)

if (abnormalWeaknesses.length) console.warn("Abnormal weaknesses :", abnormalWeaknesses)

const elementsCount: { [key: string]: number } = {}
elements.forEach((element) => {
  const fullText = unformatText(JSON.stringify(Object.values(enemyJSON).map((enemy) => enemy.weaknesses)))
  // The g in the regular expression (meaning "g"lobal) says to search the whole string rather than just find the first occurrence
  const regex = new RegExp(unformatText(element), "g") // Regex for the element in global
  elementsCount[element] = (fullText.match(regex) || []).length
})
console.log("Enemies Weaknesses :", elementsCount)

// console.log("Pour trouver des ennemis par nom  : Object.values(enemyJSON).filter(enemy => enemy.nom.includes('rsun')");

addChangeListener(inputSelector("#filtre", "string"), (e) => {
  const filteredEnemiesE = document.querySelector("#filteredEnemies")!
  filteredEnemiesE.innerHTML = ""
  const enemiesList = Object.values(enemyJSON).filter((enemy) => isTextInText(enemy.nom, e.target.value))
  enemiesList.forEach((enemy) => {
    const liElem = createElement("li", `${enemy.nom} - ${enemy.visuel3D}`)
    filteredEnemiesE.append(liElem)
  })
})
;[...document.querySelectorAll<HTMLElement>(".enemyDesc")].forEach((descE) => {
  shortAndLongEventsOnClick(descE, () => toggleDesc(descE))
})

function toggleDesc(descE: HTMLElement): void {
  if (descE.style.maxHeight === "10px") {
    descE.style.backgroundColor = ""
    descE.style.maxHeight = "200px"
  } else {
    descE.style.backgroundColor = "rgba(36, 36, 106, 0.5)"
    descE.style.maxHeight = "10px"
  }
}

// loadEnemy (previously here)

// EQPTS
const equipementsE = document.querySelector(".equipements")!
// eqpts list
Object.values(eqptJSON).forEach((eqpt) => {
  const nomE = createElement("p", eqpt.nom, { className: "nom" })
  const descE = createElement("p", eqpt.desc, { className: "desc" })
  const effetE = createElement("p", eqpt.effet, { className: "effet" })
  const montantE = createElement("p", eqpt.montant, { className: "montant" })

  const iconeE = createElement("img", undefined, {
    className: "icone",
    src: eqpt.icone !== "?" ? `http://voldre.free.fr/Eden/images/items/${eqpt.icone}.png` : "",
  })

  const eqptE = createElement("div", [nomE, descE, effetE, montantE, iconeE], { className: "eqpt" })
  equipementsE.append(eqptE)
})

// Show/Hide eqpts
const buttonEqpt = document.querySelector<HTMLParagraphElement>("#buttonEqpt")!
buttonEqpt.addEventListener("click", () => {
  if (buttonEqpt.innerText === "Afficher") {
    buttonEqpt.innerText = "Masquer"
  } else {
    buttonEqpt.innerText = "Afficher"
  }
  equipementsE.classList.toggle("hide")
})

// Filter eqpts by name (08/02/2024)

const eqptNameFilter = inputSelector("#eqptNameFilter", "string")
const eqptEffectFilter = inputSelector("#eqptEffectFilter", "string")
const revertFilterNames = inputSelector("#revertNameFilter", "string")

;[eqptNameFilter, eqptEffectFilter].map((element) =>
  element.addEventListener("blur", () => {
    eqptFilter()
  })
)
revertFilterNames.addEventListener("change", () => {
  eqptFilter()
})

const eqptFilter = (): void => {
  // Update 02/05/2024 : Handle multiple filters if splited by coma, + revert filter
  // Filters (of same type) are defined by UNION (||), so we display any eqpt matching one of the filter
  const filterNames = eqptNameFilter.value ? eqptNameFilter.value.split(",") : []
  const filterEffects = eqptEffectFilter.value ? eqptEffectFilter.value.split(",") : []
  const isRevertFilterNames = revertFilterNames.checked

  let nbEqptsDisplayed = 0

  ;[...equipementsE.children].forEach((eqptE) => {
    const eqptName = eqptE.querySelector<HTMLParagraphElement>(".nom")!.innerText
    const eqptEffect = eqptE.querySelector<HTMLParagraphElement>(".effet")!.innerText
    const eqptMontant = eqptE.querySelector<HTMLParagraphElement>(".montant")!.innerText

    const filterNamesCondition =
      !filterNames.length || filterNames.find((filterName) => isTextInText(eqptName, filterName))
    const filtersConditionsMet =
      //         isRevertFilterNames ^= filterNamesCondition
      // The revert is only applied on filterNames
      (isRevertFilterNames ? !filterNamesCondition : filterNamesCondition) &&
      (!filterEffects.length ||
        filterEffects.find(
          (filterEffect) => isTextInText(eqptEffect, filterEffect) || isTextInText(eqptMontant, filterEffect)
        ))

    if (filtersConditionsMet) {
      eqptE.classList.remove("hide")
      nbEqptsDisplayed++
    } else eqptE.classList.add("hide")
  })

  document.querySelector<HTMLParagraphElement>("#nbEqptFiltered")!.innerText = `(${nbEqptsDisplayed})`
}

// Add new enemy (4th)

document.querySelector("#newEnemy")!.addEventListener("click", () => {
  const lastEnemy = ennemiEs[ennemiEs.length - 1]
  if (ennemiEs.length > 5) {
    lastEnemy.remove()

    // If last enemy has "current turn", make new turn because enemy will close
    const hasCurrentTurn = !!lastEnemy.querySelector("#currentTurnE")
    if (hasCurrentTurn) {
      tourE.value += 1
      const nextTurnE = allSlots[0].querySelector(".nextTurn")!
      nextTurnE.classList.remove("hide")
      nextTurnE.id = "currentTurnE"
    }
  } else {
    const newEnemyE = document.importNode(lastEnemy, true)

    newEnemyE.id = `e${ennemiEs.length}`

    const newEnemySelectE = newEnemyE.querySelector<HTMLSelectElement>(".ennemi")!
    newEnemySelectE.value = lastEnemy.querySelector<HTMLSelectElement>(".ennemi")!.value

    // Add event listeners
    // Classic enemy on select
    addChangeListener(newEnemySelectE, (e) => {
      loadEnemy(e.target.value, newEnemyE)
      toastNotification(`Chargement de l'ennemi réussi : ${e.target.value}`)
    })

    // Next turn button
    newEnemyE.querySelector(".nextTurn")!.addEventListener("click", () => nextTurn())

    // hide desc
    const descE = newEnemyE.querySelector<HTMLElement>(".enemyDesc")!
    descE.addEventListener("click", () => toggleDesc(descE))

    // Switch kind of enemy with visual text
    addClickListener(newEnemyE.querySelector<HTMLElement>(".visuel")!, (e) => {
      const enemyTypeE = e.target?.closest(".infoEnnemi")!.querySelector(".enemyType")
      if (enemyTypeE) [...enemyTypeE.children].map((child) => child.classList.toggle("hide"))
    })

    // Generic enemy on selects
    const genericE = newEnemyE.querySelector<HTMLElement & { children: HTMLSelectElement[] }>(".generic")!
    const selectElements = [...genericE.children]
    selectElements.forEach((selectE) => {
      selectE.addEventListener("change", () => handleGenericSelectChange(selectElements))
    })

    document.querySelector(".ennemis")!.append(newEnemyE)
  }
  // Update slots to avoid error
  updateSlots()
})

// Get and update players PV (new functionality 28/08/2023)
document.querySelector("#updatePInfo")!.addEventListener("click", () => {
  updateSlots()

  const pInfo = document.querySelector("#pInfo")!

  const newPersosJSON = getData<{ [key: string]: Perso }>("persos")

  const playerLabels = document.querySelector<HTMLInputElement>("#pList")!.value.split(",")!

  pInfo.innerHTML = ""

  Object.entries(playerLabels).forEach(([index, playerLabel]) => {
    const player = Object.values(newPersosJSON).find((perso) => isTextInText(perso.nom, playerLabel))
    if (!player) return // Can't continue

    if (persoEs[parseInt(index)]) persoEs[parseInt(index)].children[0].value = player.nom

    const liElem = createElement("li", `${player.nom} : ${player.pv}/${player.pvmax}`)
    pInfo.append(liElem)
  })
})

// Variateurs de PV et Dégâts selon le nombre de joueurs (new functionality 28/08/2023)

addChangeListener(nbPE, (e) => {
  const nbP = e.target.value
  document.querySelector<HTMLParagraphElement>("#variation")!.innerText =
    nbP >= 3 ? `+${(nbP - 3) * 33}%` : `-${(3 - nbP) * 33}%`
})

// Add new kind of enemy : Generic Enemy !

const genericElements = [
  ...document.querySelectorAll<
    HTMLElement & { children: [HTMLSelectElement, HTMLSelectElement, HTMLSelectElement, HTMLSelectElement] }
  >(".generic")!,
]
;[...document.querySelectorAll<HTMLElement>(".visuel")].forEach((visuelE) => {
  // On click, toggle hidden type
  addClickListener(visuelE, (e) => {
    const enemyTypeE = e.target.closest(".infoEnnemi")?.querySelector(".enemyType")
    if (enemyTypeE) [...enemyTypeE.children].map((child) => child.classList.toggle("hide"))
  })
})

genericElements.forEach((genericE) => {
  const selectElements = [...genericE.children]
  selectElements.forEach((selectE) => {
    const propName = selectE.className as "classe" | "race" | "rang" | "guilde"
    fillSelectOptions(selectE, [
      { value: "", innerText: "" },
      // @ts-expect-error e[propName] is not well handled with enemy generic type
      ...Object.values(enemyGenericJSON[`${propName}s`].map((e) => ({ value: e[propName], innerText: e[propName] }))),
    ])

    selectE.addEventListener("change", () => handleGenericSelectChange(selectElements))
  })
})

function handleGenericSelectChange(selectElements: HTMLSelectElement[]): void {
  const v: { [key: string]: string } = {}
  let hasEmptyValue = false
  selectElements.forEach((selectE) => {
    v[selectE.className] = selectE.value
    if (selectE.value === "") hasEmptyValue = true
  })

  if (hasEmptyValue) return

  const stats = statsJSON.classes.find((e) => e.Classe === v.classe)!
  const raceStats = statsJSON.races.find((e) => e.Race === v.race)!

  const classe = enemyGenericJSON.classes.find((e) => e.classe === v.classe)!
  const rang = enemyGenericJSON.rangs.find((e) => e.rang === v.rang)!
  const guilde = enemyGenericJSON.guildes.find((e) => e.guilde === v.guilde)!

  const skills: string[] = classe.sorts.map((s) => {
    const bonusMontantVar =
      s.portee === "Mono"
        ? rang.montantVariable.Mono + guilde.montantVariable.Mono
        : s.portee === "AoE"
          ? rang.montantVariable.AoE + guilde.montantVariable.AoE
          : 0
    const montantVarTot =
      s.type === "Buff" ? Math.round((s.montantVariable + bonusMontantVar) / 2) : s.montantVariable + bonusMontantVar

    const bonusMontantEffet =
      s.portee === "Mono"
        ? rang.montantEffet.Mono + guilde.montantEffet.Mono
        : s.portee === "AoE"
          ? rang.montantEffet.AoE + guilde.montantEffet.AoE
          : 0
    const montantEffetTot = unformatText(s.effet).includes("degat")
      ? s.montantEffet + Math.round(bonusMontantEffet * (unformatText(s.effet).includes("prochain degat") ? 2.5 : 1.5))
      : s.montantEffet + Math.round(bonusMontantEffet / 2)

    const duree = s.duree + rang.duree + guilde.duree

    return `${s.nom} : ${s.type} ${s.montantFixe}${s.montantFixe ? ` +${montantVarTot}` : ""}, ${s.effet}${
      s.montantEffet ? montantEffetTot : ""
    }${s.duree ? ` sur ${duree} tours` : ""} ${s.portee} : ${s.stat}`
  })

  const statsName: StatsName[] = ["Force", "Dextérité", "Intelligence", "Charisme", "Esprit"]
  const statsValues = statsName.map(
    (statName) => stats[statName] * 2 + raceStats[statName] + rang.stat + (guilde.stat || 0)
  )

  const enemyData = {
    visuel3D: "Switch...",
    nom: "",
    pvmax: stats.PV * 2 + raceStats.PV + rang.pv + guilde.pv,
    skills: skills as [string, string, string, string],
    stats: statsValues.join(","),
    desc: "",
    infos: "",
    drop: "",
    weaknesses: ["", ""] as [string, string],
  }

  loadEnemy("0", selectElements[0].closest(".infoEnnemi")!, enemyData)
}

// ALL SAVES
const allowSaveE = document.querySelector<HTMLElement>("#allowSave")!
// Allow save for users
const toggleButton = (): void => {
  allowSaveE.style.border = `3px solid ${masterJSON.allow ? "green" : "red"}`
}
toggleButton()

const masterSave = (): void => {
  masterJSON.notes = notesE.value
  setCookie("masterJSON", masterJSON)
  callPHP({ action: "saveFile", name: "master" })
}

allowSaveE.addEventListener("click", () => {
  masterJSON.allow = !masterJSON.allow
  toggleButton()

  masterSave()
  toastNotification("Autorisation modifiée")
})

document.querySelector("#save")!.addEventListener("click", () => {
  masterSave()
  toastNotification("Note modifiée")
})

document.querySelector("#saveBackup")!.addEventListener("click", () => {
  callPHP({ action: "saveBackup" })
  toastNotification("JDRpersos_backup.json et JDRplayer sauvegardés")
})

// Create skill & Save

document.querySelector("#createSkill")!.addEventListener("click", () => {
  const addSkill = document.querySelector<HTMLElement & { children: HTMLInputElement[] }>(".addSkill")!
  const skillID = parseInt(Object.keys(skillsJSON).reverse()[0]) + 1 || 1
  const newSkill: { [key: string]: Skill } = {}
  newSkill[skillID] = {
    nom: addSkill.children[0 + 1].value,
    desc: addSkill.children[2 + 1].value,
    effet: addSkill.children[4 + 1].value,
    montant: addSkill.children[6 + 1].value,
    icone: addSkill.children[8 + 1].value,
    stat: addSkill.children[10 + 1].value as StatsName,
    classe: addSkill.children[12 + 1].value.split(","),
  }
  console.log(newSkill)
  setCookie("skillsJSON", newSkill)

  callPHP({ action: "saveFile", name: "skills" })
  skillsJSON[skillID] = newSkill[skillID]
  toastNotification("Compétence créé")
})

// Create eqpt & Save

document.querySelector("#createEqpt")!.addEventListener("click", () => {
  const addEqpt = document.querySelector<HTMLElement & { children: HTMLInputElement[] }>(".addEqpt")!
  const eqptID = parseInt(Object.keys(eqptJSON).reverse()[0]) + 1 || 1
  const newEqpt: { [key: string]: Equipment } = {}
  newEqpt[eqptID] = {
    nom: addEqpt.children[0 + 1].value,
    desc: addEqpt.children[2 + 1].value,
    effet: addEqpt.children[4 + 1].value,
    montant: addEqpt.children[6 + 1].value,
    icone: addEqpt.children[8 + 1].value,
  }
  console.log(newEqpt)

  setCookie("eqptJSON", newEqpt)

  callPHP({ action: "saveFile", name: "eqpt" })
  eqptJSON[eqptID] = newEqpt[eqptID]
  toastNotification("Equipement créé")
})

// Create enemy & Save
const addEnemyE = document.querySelector<HTMLElement & { children: HTMLInputElement[] }>(".addEnemy")!
;[...addEnemyE.querySelectorAll("select")].forEach((selectE) => {
  selectE.style.fontSize = "12px"
  fillSelectOptions(selectE, [
    { value: "", innerText: "" },
    ...elements.map((element) => ({ innerText: element, value: element })),
  ])
})

document.querySelector("#createEnemy")!.addEventListener("click", () => {
  const enemyID = parseInt(Object.keys(enemyJSON).reverse()[0]) + 1 || 1
  const newEnemy: { [key: string]: Enemy } = {}
  newEnemy[enemyID] = {
    visuel3D: addEnemyE.children[0 + 1].value,
    nom: addEnemyE.children[2 + 1].value,
    pvmax: parseInt(addEnemyE.children[4 + 1].value),
    skills: [
      addEnemyE.children[6 + 1].value,
      addEnemyE.children[8 + 1].value,
      addEnemyE.children[10 + 1].value,
      addEnemyE.children[12 + 1].value,
    ],
    stats: addEnemyE.children[14 + 1].value,
    desc: addEnemyE.children[16 + 1].value,
    drop: addEnemyE.children[18 + 1].value,
    weaknesses: [...addEnemyE.querySelectorAll("select")].map((s) => s.value).filter((s) => !!s) as [string, string],
  }
  console.log(newEnemy)

  setCookie("enemyJSON", newEnemy)

  callPHP({ action: "saveFile", name: "enemy" })
  enemyJSON[enemyID] = newEnemy[enemyID]
  toastNotification("Ennemi créé")
})

document.querySelector("#randomBoss")!.addEventListener("click", () => {
  const bosses = Object.entries(enemyJSON).filter((e) => e[1].pvmax > 200)
  const randomIndex = Math.floor(Math.random() * bosses.length)
  loadEnemy(bosses[randomIndex][0], document.querySelector("#e0")!)
})

document.querySelector("#logout")!.addEventListener("click", async () => {
  const response = await callPHP({ action: "logout" })
  if (response)
    window.location.reload() // Force le reload depuis le serveur
  else toastNotification("Deconnexion échouée", 3000, true)
})
