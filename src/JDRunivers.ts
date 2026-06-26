import { CLASSES, iconsClasses, RACES, rulesJSON, skillsAwakenJSON, skillsJSON, statsJSON } from "./JDRstore.js"
import { Classes, Skill } from "./model.js"
import {
  countEachOccurences,
  createElement,
  shortAndLongEventsOnClick,
  initDialog,
  closeButton,
  unformatText,
  capitalize,
} from "./utils/index.js"

const dialog = document.querySelector<HTMLDialogElement>("dialog")!

// #region Page info

const renderInformationLinks = (): void => {
  const informationsE = document.querySelector(".informations")!

  Object.entries(rulesJSON.universLabels).forEach(([id, information]) => {
    const labelE = createElement("label", information.label)
    labelE.htmlFor = id

    informationsE.append(createElement("li", labelE))
  })
}

const createRacesContent = (): HTMLDivElement =>
  createElement(
    "div",
    statsJSON.races.map((race) => {
      const raceImgE = createElement("img", undefined, { src: race.image, alt: race.Race })
      const traitsE = createElement(
        "ul",
        race.traits.map((trait) => createElement("li", trait))
      )
      return createElement(
        "div",
        [
          createElement("h4", race.Race),
          createElement("div", [raceImgE, traitsE], { className: "flex" }),
          ...race.description.map((description) => createElement("p", description)),
        ],
        { className: "race" }
      )
    }),
    { className: "racesList" }
  )

const createElementsContent = (): HTMLDivElement => {
  const description = Array.isArray(rulesJSON.elementsInfo.description)
    ? rulesJSON.elementsInfo.description
    : [rulesJSON.elementsInfo.description]

  return createElement("div", [
    ...description.map((text) => createElement("p", text)),
    createElement(
      "ul",
      rulesJSON.elementsInfo.elements.map((element) =>
        createElement("li", [
          createElement("img", undefined, { className: "skillRangeIcon", src: element.icon }),
          createElement("span", [createElement("b", capitalize(element.element)), ` ${element.description}`]),
        ])
      ),
      { style: { gap: "0.5rem", display: "flex", flexDirection: "column" } }
    ),
  ])
}

const openUniversModal = (title: string, content: HTMLElement): void => {
  dialog.innerText = ""
  dialog.style.width = "min(1000px, 90%)"
  dialog.style.padding = "0.75rem"
  dialog.append(createElement("h3", title), content, closeButton(dialog))
  dialog.showModal()
  dialog.scrollTop = 0
}

renderInformationLinks()

// Generate classes elements
const classesListE = document.querySelector(".classeslist")!
CLASSES.forEach((classe, i) => {
  const nomE = createElement("p", classe === "Chev Dragon" ? "C. Dragon" : classe)
  const iconeE = createElement("img", undefined, {
    src: `http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE${iconsClasses[i]}.png`,
  })

  const classeE = createElement("div", [nomE, iconeE], { id: classe })

  classeE.addEventListener("click", () => {
    showClassSkills(classe)
  })

  classesListE.append(classeE)
})

document.querySelectorAll<HTMLButtonElement>("[data-univers-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.universModal === "races") {
      openUniversModal("Races", createRacesContent())
    } else if (button.dataset.universModal === "elements") {
      openUniversModal("Eléments", createElementsContent())
    }
  })
})

// #region Skill Element

const getSkillElement = (skill: Skill, isAwaken?: boolean, updateAwakenButton?: () => void): HTMLDivElement => {
  const nomE = createElement("p", skill.nom, { className: "nom" })

  const awakenSkill = Object.values(skillsAwakenJSON).find((s) => s.nom === skill.nom)

  const descE = createElement("p", isAwaken && awakenSkill?.desc ? awakenSkill.desc : skill.desc, {
    className: "desc",
  })
  const montantE = createElement("p", isAwaken && awakenSkill?.montant ? awakenSkill.montant : skill.montant, {
    className: "montant",
  })

  const iconeE = createElement("img", undefined, {
    className: "icone",
    src: `http://voldre.free.fr/Eden/images/skillIcon/${skill.icone}.png`,
  })

  const skillRange = skill.effet.split("AoE ")[1] ?? null // en bas [0] + "AoE"

  const effetDesc = skillRange ? (skill.effet.split(" AoE")[0] ?? "") : skill.effet
  const skillRangeIconE =
    skillRange &&
    createElement("span", undefined, {
      className: "skillRangeIcon",
      style: { backgroundImage: `url(http://voldre.free.fr/Eden/images/layout/${skillRange}.png)` },
    })
  const statDesc = ` / ${skill.stat} ${skill.classe.length ? ` / ${skill.classe.join(", ")}` : ""}`

  const effetE = createElement("p", skillRangeIconE ? [effetDesc, skillRangeIconE, statDesc] : [effetDesc, statDesc], {
    className: "effet",
  })

  const skillE = createElement("div", [nomE, descE, effetE, montantE, iconeE], {
    className: `skill ${isAwaken ? "awaken" : ""}`,
  })

  // Add manually event for fastClick
  const fastClickEvent = (): void => {
    skillE.classList.toggle("awaken")

    const selectedAwakenSkill = skillE.classList.contains("awaken")
      ? Object.values(skillsAwakenJSON).find((s) => s.nom === skill.nom)
      : undefined

    descE.innerText = selectedAwakenSkill?.desc || skill.desc
    montantE.innerText = selectedAwakenSkill?.montant || skill.montant

    updateAwakenButton?.()
  }
  shortAndLongEventsOnClick(skillE, fastClickEvent)

  return skillE
}

// #region Skills list
const showClassSkills = (classe: Classes): void => {
  // Display all skills, except race skills
  const skillsList = Object.values(skillsJSON).filter((skill) => skill.classe.includes(classe) && !skill.race)

  const updateAwakenButtonTriggered = (): void => {
    const isAllSkillsAwaken = [...skillsListE.children].every((child) => child.classList.contains("awaken"))
    awakenButton.src = `images/otherIcon/function02${isAllSkillsAwaken ? 5 : 4}.png`
  }

  // Skills elements
  const skillsEs = (isAwaken: boolean): HTMLDivElement[] =>
    skillsList.map((skill): HTMLDivElement => getSkillElement(skill, isAwaken, updateAwakenButtonTriggered))

  // #region Modal

  // Reset dialog
  dialog.innerText = ""
  dialog.style.width = "min(1200px,90%)"
  dialog.style.padding = "0.75rem"

  const wallpaper = createElement("img", undefined, {
    src: `http://voldre.free.fr/Eden/images/wallpaper/classes/${capitalize(unformatText(classe))}.png`,
    style: { borderBlockEnd: "1px solid gold", width: "100%", aspectRatio: "16/7" },
  })

  const classDesc = createElement("div", undefined, { className: "classeDesc" })
  const classStats = statsJSON.classes.find((stats) => stats.Classe === classe)!

  // @TODO Improve with react
  classDesc.innerHTML = classStats.description
  classDesc.append(createElement("p", classStats.specialisation))

  const awakenButton = createElement("img", undefined, {
    id: "awakenButton",
    className: "skillRangeIcon",
    src: "images/otherIcon/function024.png",
    title: "Compétences Eveillés !",
  })

  awakenButton.addEventListener("click", () => {
    // If all skills are awaken, remove awaken. Else add it.
    const isAwaken = awakenButton.src.includes("25")

    skillsListE.innerHTML = ""
    skillsListE.append(...skillsEs(!isAwaken))
    updateAwakenButtonTriggered()
  })

  const skillsHeader = createElement("h4", ["Compétences ", awakenButton])

  const skillsListE = createElement("div", skillsEs(false), { className: "skillslist" })

  const globalE = createElement("div", [wallpaper, classDesc, skillsHeader, skillsListE, closeButton(dialog)])

  dialog.append(globalE)
  // Ouverture en "modal"
  dialog.showModal()
  dialog.scrollTop = 0
}

// #region Analyze

// ANALYZE :  Counts which stats are most used for skills
console.log("Skills JSON", Object.values(skillsJSON))
// Nb skills by stats
const skillsJSONStat = Object.values(skillsJSON).map((skill) => skill.stat)
const occurrences = JSON.stringify(countEachOccurences(skillsJSONStat))

document.querySelector<HTMLParagraphElement>(".statsBySkills")!.innerText = occurrences.replaceAll(",", ", ")

// Nb skills by effect
const skillsJSONEffect = Object.values(skillsJSON).map((skill) => skill.effet)
const listEffects = countEachOccurences(skillsJSONEffect)

console.log("Nb skills by effect", listEffects)

// Nb skills by class
const skillsJSONClassGroup = Object.values(skillsJSON).map((skill) => skill.classe.toString())
const listSkillsByClassGroup = countEachOccurences(skillsJSONClassGroup)

// Split class group (eg: Guerrier,Chevalier => [Guerrier,Chevalier])
const skillsJSONClassIndiv = skillsJSONClassGroup.map((s) => s.split(",")).flat()
const listSkillsByClassIndiv = countEachOccurences(skillsJSONClassIndiv)

console.log("Nb skills by class (Group)", listSkillsByClassGroup)
console.log(
  "Nb skills by class (Indiv)",
  Object.entries(listSkillsByClassIndiv).sort((a, b) => b[1] - a[1])
)

// Nb skills by class by stat
const allListSkillsByClassByStats: { [key: string]: { [key: string]: number } } = {}
CLASSES.forEach((classe) => {
  const skillsClass = Object.values(skillsJSON).filter((skill) => skill.classe.includes(classe))
  const skillsClassStats = Object.values(skillsClass).map((skill) => skill.stat)
  const listSkillsByClassStats = countEachOccurences(skillsClassStats)
  allListSkillsByClassByStats[classe] = listSkillsByClassStats
})
console.log("Nb skills by class by stat", allListSkillsByClassByStats)

console.warn(
  "Skills without class",
  Object.values(skillsJSON).filter((skill) => !CLASSES.find((classe) => skill.classe.includes(classe)))
)

// #region Race skills

const raceClassTable = document.querySelector<HTMLTableElement>("#raceClassTable")!
const bodyTable = raceClassTable.createTBody()
RACES.forEach((race) => {
  const raceImg = createElement(
    "td",
    createElement("img", undefined, {
      src: `http://voldre.free.fr/Eden/images/jdrgalerie/Race_${race}.webp`,
      width: 120,
      height: 120,
    })
  )

  const raceSkills = Object.values(skillsJSON).filter((skill) => skill.race === race)

  const skills = [...Array(5).keys()].map((i) =>
    // Get skills of each kind of classes
    raceSkills.find((skill) => skill.classe.every((c) => CLASSES.slice(4 * i, 4 * (i + 1)).includes(c)))
  )

  const cells = skills.map((skill) => {
    return createElement("td", skill ? getSkillElement({ ...skill, classe: [] }) : "")
  })

  const tr = bodyTable.insertRow()
  tr.append(raceImg, ...cells)
})

// #region Labels

const labelsDescription = Object.fromEntries(
  Object.entries(rulesJSON.universLabels).map(([id, information]) => [id, information.description])
)

initDialog(labelsDescription)
