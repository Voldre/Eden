import { aoeDescInfo, classes, iconsClasses, races, skillsAwakenJSON, skillsJSON } from "./JDRstore.js"
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

const classesDesc = [
  "Les guerriers possèdent de solides aptitudes au combat ainsi que de lourdes armures résistantes. Peut effrayer les ennemis et motiver ses alliés.",
  "Les chevaliers incarnent le courage. Esquivant et bloquant les coups, ils attaquent sans relâche jusqu’à obtenir la victoire. Ils aiment les duels et sont très précis et rapide.",
  "Stimulés par leur noble croyance, les templiers invoquent le pouvoir divin pour punir le mal. Tout comme les clercs, ce sont des fervants de l'église et agisse pour elle.",
  "Après avoir passé un pacte avec un terrible dragon, les DK (Dragon Knight) ont reçu des pouvoirs proche de l'immortalité. Leurs visages intimident leurs ennemis. Mieux vaut ne pas leur chercher des noises.<br/><b>Contrainte : Être un descendant indirect de l'empereur \"Heldentod Ier\" (l'avoir comme ascendant sachant qu'il est mort il y a plus de 200 ans).</b>",
  "Tapis dans l'ombre, Le voleur rusé et silencieux tire profit de sa vitesse pour prendre les ennemis de court lors des combats. Très discret.",
  "Les assassins maîtrisent l’art de supprimer leurs adversaires, sans laisser de traces. Grâce à leurs techniques de combat avancées, ils peuvent également affronter leurs adversaires en face à face.",
  "Les danselames sont avant tout des artistes, ils savent jouer de leur charme et ont une grande agilité pour se mouvoir dans l'environnement, les rendants imprévisibles. Ils préfèrent cependant éviter les combats car ils ne résistent pas beaucoup. Enchaîne des mouvements en combo.",
  "Un samouraï ne fait confiance qu’à son katana. Au bout d’années d’entraînement, même le plus lourd des katanas semble léger comme une plume. Leur code d'honneur est sans faille. Ils cherchent en permanence leur voie. Attaque beucoup à mi-distance. <br/><b>Contrainte : Croit et applique le code d'honneur des Samouraïs : Honnête, Courageux, Respectueux, Loyal : Servir une Cause pour Protéger.</b>",
  "Les chasseurs utilisent leurs compétences de tir et leurs félins pour immobiliser leurs ennemis à distance, avant de déclencher des tirs mortels. Peuvent poser des pièges",
  "Les ingénieurs aiment utiliser des explosifs et autres machines pour prouver l’utilité de la technologie au combat. Ils peuvent crafter différents objets et se mécaniser. <br/><b>Contrainte : Être intéressé par la technologie.</b>",
  "Les corsaires étudient attentivement l’ennemi pour repérer ses faiblesses et les éventuelles ouvertures avant d'attaquer à distance. Attaques en rafale à distance.",
  "les juges sont des pourfendeurs se battant avec une faux. Ils combattent à la fois au corps à corps et à distance et utilise la peur pour entraver leurs ennemis. <br/><b>Contrainte : Servir une cause (à choisir), avec pour engagement de devoir Tuer/Condamner.</b>",
  "Les clercs invoquent le pouvoir divin pour soigner les blessures et protéger les alliés. Ce sont des fervents de l'église de la Curie Métérole, ils sont généralement missionnés par le pape.",
  "Les bardes sont des artistes qui utilisent les rimes, les sons et les ballades pour influer sur l’ambiance d’une bataille. Très doué pour soutenir et soigner les alliés, ils se complètent avec les danselames.",
  "Les shamans invoquent la nature et les anciens esprits pendant le combat, ils utilisent leur pouvoir pour soutenir leurs alliés et affaiblir leurs ennemis. Ils peuvent communiquer avec les esprits.<br/><b>Contrainte : Être proche de la nature, la préserver.</b>",
  "Les sages sont des érudits de l'église, ils se battent généralement avec un marteau, sont capables de bénir l'équipement de leurs alliés et d'enchanter des gemmes.<br/><b>Contrainte : Travail pour la Curie Métérole ou l'Ordre des Chevaliers de la Rose : obligation de participer à des rites et évènements, de travailler la semaine et de poser des congés.</b>",
  "Les magiciens sont spécialisés dans le contrôle des éléments, utilisant ces particularités pour vaincre leurs ennemis. Ils maîtrisent généralement 2 éléments différents.",
  "Les illusionnistes maîtrisent les arts de la tromperie, ils affectent l'état mental de leurs ennemis pour les vaincres, ils sont discrets et fourbes.",
  "Les démonistes empruntent le pouvoir des ténèbres, insouciants du danger que représente le mal. Ils peuvent ainsi réaliser des sacrifices pour attaquer, se renforcer ou affaiblir. Ils peuvent être possédé par un esprit démoniaque.",
  "Les Luminarys sont des guerriers-mages utilisant les opposées : les ténèbres et la lumière, pour anéantir leurs ennemis. Ils doivent cependant conserver cet équilibre pour ne pas vasciller dans le chaos.<br/><b>Contrainte : Doit s'équilibrer entre la lumière et les ténèbres pour éviter la folie, le chaos. <br/>Exception : Cette règle ne s'applique pas si le personnage n'a qu'un élément (jusqu'au niveau 5)</b>",
]

const classesSpe = [
  "Spécialisé contre les ennemis nombreux qui l'attaque",
  "Spécialisé contre les ennemis puissants et magiques",
  "Polyvalent dans chaque domaine, soigneur, efficace contre les ennemis faible à la magie",
  "Polyvalent en physique et en magique, capable de tenir comme d'affaiblir",
  "Spécialisé contre les ennemis mono-cible",
  "Spécialisé contre les ennemis buffés",
  "Spécialisé dans la communication et la négociation",
  "Spécialisé contre les ennemis nombreux ou imposant",
  "Spécialisé dans le combat face à un ennemi, accompagné de familiers",
  "Très polyvalent face à tout type d'ennemis, pour les blesser, les affaiblir, etc...",
  "Spécialisé pour découvrir/explorer et se sortir de situation critique",
  "Spécialisé contre les ennemis très physiques et/ou sans esprit",
  "Spécialisé dans les soins, adaptés pour les grands groupes.",
  "Spécialisé dans les soutiens de groupe, adaptés pour les grands groupes.",
  "Polyvalent et peut changer de rôle rapidement dans le combat",
  "Spécialisé dans tout type de soutiens, peut affaiblir les ennemis",
  "Spécialisé contre les ennemis très résistant et faible à la magie",
  "Spécialisé contre les ennemis sans esprit.",
  "Assez polyvalent et diablement efficace entouré des siens",
  "Spécialisé dans les dégâts purs face à tout type d'ennemis",
]

// Generate classes elements
const classesListE = document.querySelector(".classeslist")!
classes.forEach((classe, i) => {
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

// Show/Hide races
const buttonRace = document.querySelector("#buttonRace") as HTMLButtonElement
buttonRace.addEventListener("click", () => {
  if (buttonRace.innerText === "Afficher") {
    buttonRace.innerText = "Masquer"
  } else {
    buttonRace.innerText = "Afficher"
  }
  document.querySelector("#races")?.classList.toggle("hide")
})
// Show/Hide elements
const buttonElem = document.querySelector("#buttonElem") as HTMLButtonElement
buttonElem.addEventListener("click", () => {
  if (buttonElem.innerText === "Afficher") {
    buttonElem.innerText = "Masquer"
  } else {
    buttonElem.innerText = "Afficher"
  }
  document.querySelector("#elem")?.classList.toggle("hide")
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

  const effetDesc = skillRange ? skill.effet.split(" AoE")[0] : skill.effet
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
  classDesc.innerHTML = classesDesc[classes.indexOf(classe)]
  classDesc.append(createElement("p", classesSpe[classes.indexOf(classe)]))

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
classes.forEach((classe) => {
  const skillsClass = Object.values(skillsJSON).filter((skill) => skill.classe.includes(classe))
  const skillsClassStats = Object.values(skillsClass).map((skill) => skill.stat)
  const listSkillsByClassStats = countEachOccurences(skillsClassStats)
  allListSkillsByClassByStats[classe] = listSkillsByClassStats
})
console.log("Nb skills by class by stat", allListSkillsByClassByStats)

console.warn(
  "Skills without class",
  Object.values(skillsJSON).filter((skill) => !classes.find((classe) => skill.classe.includes(classe)))
)

// #region Race skills

const raceClassTable = document.querySelector<HTMLTableElement>("#raceClassTable")!
const bodyTable = raceClassTable.createTBody()
races.forEach((race) => {
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
    raceSkills.find((skill) => skill.classe.every((c) => classes.slice(4 * i, 4 * (i + 1)).includes(c)))
  )

  const cells = skills.map((skill) => {
    return createElement("td", skill ? getSkillElement({ ...skill, classe: [] }) : "")
  })

  const tr = bodyTable.insertRow()
  tr.append(raceImg, ...cells)
})

// #region Labels

function aoeDesc(): string {
  let description = "Il existe 4 types d'Attaques de Zone (AoE) :<br/>"
  for (let i = 0; i < 4; i++) {
    const rangeI = Math.floor(i / 2)
    const typeI = i % 2
    description += `<br/>
    <img class='skillRangeIcon' src='http://voldre.free.fr/Eden/images/layout/${aoeDescInfo.range[rangeI]}${aoeDescInfo.type[typeI]}.png'/> 
    Attaque en ${aoeDescInfo.rangeName[rangeI]} ${aoeDescInfo.typeName[typeI]} : 
    <br/>${aoeDescInfo.typeMalus[typeI]}.<br/>`
  }
  return description
}

const labelsDescription = {
  critique: `Les valeurs extrêmes des Dé (1, 20) sont des critiques et (2, 19) semi-critiques. Voici leurs effets :<br/> 
    <table>
    <thead>
      <tr>
        <th scope="col">Dé (+effet)</th>
        <th scope="col">Effet Attaques</th>
        <th scope="col">Effet Buffs</th>
        <th scope="col">Effet Bloc/Esq</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dé 0</td>
        <td>Montant max des dés +50%</td>
        <td>Montant max des dés +50% SINON Durée +2 tours</td>
        <td>Selon contexte</td>
      </tr>
      <tr>
        <td>Dé 1</td>
        <td>Montant max des dés</td>
        <td>Montant max des dés SINON Durée +1 tour</td>
        <td>Selon contexte</td>
      </tr>
      <tr>
        <td>Dé 2</td>
        <td>Selon contexte & stuffs</td>
      </tr>
      <tr>
        <td>Dé 19</td>
        <td>Selon contexte & stuffs</td>
      </tr>
      <tr>
        <td>Dé 20/21/22</td>
        <td>Mono : le lanceur prend les dégâts : 0 armure,<br/>AoE : les alliés dedans prennent, sinon : le lanceur</td>
        <td>Buff converti en Malus</td>
        <td>Dégât reçu +X</td>
      </tr>
      <tr>
        <td>Dé 20</td>
        <td>Dégât = Jet de dé, montant/2</td>
        <td>Durée divisée par 2</td>
        <td>Dégât reçu +5</td>
      </tr>
      <tr>
        <td>Dé 21</td>
        <td>Dégât = Jet de dé, montant total</td>
        <td>Durée totale</td>
        <td>Dégât reçu +10</td>
      </tr>
      <tr>
        <td>Dé 22</td>
        <td>Dégât max (zone AoE élargie)</td>
        <td>Durée totale, Effet *2</td>
        <td>Dégât reçu +50%</td>
      </tr>
    </tbody>
  </table>
  Pour rappel : les buffs convertis en malus par des échecs critiques ne sont pas annulables.
  `,
  aoe: `${aoeDesc()}<br/>Concernant l'esquive, tout sort mono-cible peut être esquivé, sauf les sorts d'esprits.`,
  bloquage:
    "Toutes les attaques peuvent être bloquées (physiquement (force) ou magiquement (intelligence))<br/>Bloquer plusieurs fois de suite donne des malus (Blocage -1 par coup), si le coup suivant est une attaque mono-cible, blocage -1 sur le coup.<br/>Cumule max : -4 blocage.<br/><br/>Même avec malus et autres effets, un Dé à 1 ou 2 génèrera tout le temps une réussite de blocage.",
  invisible:
    "Quand un personnage est invisible : au 1er tour, -3 de chance de le toucher (sauf AoE : 0); aux tours suivants (2+) : Chance/2 (sauf AoE : -3).<br/>&nbsp; A l'inverse, un personnage invisible qui frappe réduit les chances d'esquive/blocage/résistance de -2. <br/>&nbsp; Seuls les sorts d'Esprit (et Parasite Obscur) laissent invisible, SAUF les sorts qui infligent des dégâts ou des statuts (hypnose/dodo/...). Se prendre un coup fait sortir aussi.<br/><br/> A noter : il n'est pas possible de relancer un sort d'invisibilité tant qu'on l'est encore.",
  protege:
    "Un personnage peut protéger un allié d'une seule attaque par tour. Pour cela, il aura un malus de blocage selon la situation (2 ou +).<br/> Si un second ennemi attaque, la protection est impossible.<br/> Sur un échec critique, c'est la personne protégée qui se prend le coup. Dé 19 ou Dé 20 : 0 blocage.",
  incanter:
    "Un personnage peut incanter un sort sur plusieurs tours. Pendant ce temps, le personnage ne peut plus esquiver ni se déplacer.<br/> Sur un échec critique de blocage (voire une réussite critique de l'ennemi, selon le contexte), l'incantation est annulée.<br/><br/>Les effets des réussites critiques varient selon les incantations :<br/>- Incantation en 3 tours (3 dés) : le 1er supprime le 2nd tour, le 2nd tour augmente les dégâts de 5 (ou +?), le 3eme tour implique le montant maximum des dés,<br/>- Incantation en 2 tours (2 dés) : le 1er tour augmente les dégâts de 5 (ou +?), le 2nd tour implique le montant maximum des dés,<br/>- Incantation en 2 tours (1 dé) : le dé est au Tour 1 et implique le montant maximum des dés.",
  //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
  "coup-allié":
    "Lorsqu'on décide de se prendre un coup par un allié (joueur, familier), comme pour un blocage sur un dé 20 : le joueur prend les dégâts divisés par 2 et sans armure.",
  status:
    "Un status est un malus d'altération d'état qui est non annulable. Autrement dit, les sorts qui retire des malus comme \"Prévention\" ne fonctionnent pas.<br/><br/>Ils peuvent être retiré à chaque tour en suivant ce calcul pour la stat définie :<ul><li>Tour 1 (lorsqu'on subit le sort) : Stat/2,</li><li> Tour 2 : Stat*0.75,</li><li> Tour 3 et + : Stat</li></ul>Une nouvelle tentative (pour annuler) est possible si la personne est attaquée, le jet de dé change selon l'altération.<br/>Voici les trois altérations d'états qui existent :<br/><ul><li>Hypnose (Esprit) : Si frappé : Tentative égale au montant de la stat pour le Tour X (réussite +1 après chaque reçu, ne compte que sur le tour actuel).</li><li>Endormissement/Assomé (Esprit/Force) : Si frappé : Tentative égale à 17. Si sort d'esprit : Tentative égale à l'esprit. (-2 si 1er tour).</li><li>Entrave (Force) : Si frappé <b>par un allié en Mono</b> : Tentative égale à 17.</li></ul>A noter : L'énervement des ennemis (leur blessure) augmente leur <b>résistance d'esprit</b> face aux altérations d'Esprit (jusqu'à atteindre leur stat d'Esprit)",
  familier:
    "Il est possible d'invoquer jusqu'à 2 familiers simultanément, toutes sources confondues (compétences, équipements). Ils agissent pendant le tour du joueur comme un personnage (attaque, blocage, ...).",
  armure:
    "Il existe 3 types d'armures (magique, léger, lourd), chaque classe permet de porter l'un de ces types.<br/>Certaines classes combinées peuvent porter un type supplémentaire (Chevalier hors tank, Sage et Luminary hors mage)<br/><br/>Si le personnage porte une armure d'un type différent de ces classes, les malus suivants sont appliqués :<ul><li>Stuff non magique : Intelligence -2,</li><li>Stuff non léger : Dextérité -2,</li><li>Stuff non lourd : Force -2,</li></ul>Si le type d'armure est le même pour les 2 classes du personnage, le malus de la Stat est de -3.",
  montant:
    "Le montant des buffs augmente :<ul><li>Les dégâts infligés des buffs (A la charge, Magie extrême, Aura du Samouraï, ...),</li><li>Les dégâts reçus des buffs (Encouragement musical, Mur de Titan, Robotisation, ...)</li></ul>Les montants des malus sont également compris dans ce terme \"montant des buffs\" :<ul><li>Les dégâts infligés des malus (Parasite, Flèche empoisonnée, ...)</li><li>Les dégâts reçus des malus (Perce-Armure, Affablissement Mental, ...)</li></ul>Rappel : le montant des buffs de l'ensemble des stuffs est limité à +2<br/><br/>Pour la durée des sorts, le max est à +1 tour (2 si passif 12). Les capacités des équipements en bénéficient aussi, mais ne peuvent gagner qu'un tour max.",
  monture:
    "Une monture de combat est considérée comme : <br/>1) Une arme évolutive (emplacement d'arme) qui octroie des compétences au personnage (les compétences consomment le tour du perso), les autres emplacements d'armes n'affectent que le perso, pas la monture<br/>2) Un familier : il a ses PV, ses stats, et seuls les compétences et accessoires dédiés aux familiers agissent dessus.",
  instant:
    "Dans chaque tour d'un joueur, il est possible de faire 1 action (attaque, ...) et 1 action instantanée qui est facultative, voici la liste de ces actions :<ul><li>Changement d'armes parmi les 3 emplacements.<br/>/!\\ changer un équipement par un autre consomme le tour</li><li>Compétences instantanées : octroyées par certaines classes ou équipements.<br/>/!\\ Un même sort instantanée ne peut être utilisé que tous les 3 tours (anti-spam)</li><li>Utiliser un objet/gadget : 1 potion, 1 bombe, ...</li></ul>A noter : il est possible d'utiliser 2 actions instantanées en 1 tour, la seconde action consommera le tour.<br/>/!\\ Faire un échec critique (19, 20) sur une action instantanée fait perdre le tour.",
  degatPM:
    "Les dégâts physiques (P) englobe les dégâts réalisés par des attaques de Force, de Dextérité et de Charisme.<br/>Les dégâts magiques (M) englobe les dégâts réalisés par des sorts d'Intelligence et d'Esprit",
  survie:
    "Lorsqu'un joueur tombe KO, sa vie est en jeu. Son temps avant la mort est compté selon les cicronstances (lieu, contexte) et ses dégâts, soit <b>environ</b> :<ul><li>A 0 : 10 tours</li><li>A -25 : 8 tours</li><li>A -50 : 5 tours</li><li>A -75 : 3 tours</li><li>A -100 : 2 tours</li><li>Si les PV descendent à l'équivalent des PV max (ou -150 PV) : 0 tour (mort instantanée)</li></ul>A noter qu'il est possible d'être soigné (sort, potion) et blessé, et que franchir un seuil augmente/diminue les tours.<br/>De plus, pour chaque KO supplémentaire dans un laps de temps court, la survie est diminué de 2 tours.<br/><br/>Un jet de survie est lancé quand il reste 5, 2 puis 0 tours. Le jet de survie peut changer la durée de survie (en tour) : Dé 1 : +2 tours, Dé 2-5 : +1 et l'inverse en négatif.",
  "soin-recu":
    "Les bonus de soins reçus (montant fixe ou %), ne s'appliquent que sur les compétences et certains accessoires, mais pas sur les objets (gadgets, potions, ...).",
  lowStats: `Lorsqu'une statistique descend trop, des effets néfastes arrivent. Voici leurs effets :<br/> 
    <table>
    <thead>
      <tr>
        <th scope="col">Statistique</th>
        <th scope="col">2 (Esprit : 4 et 3)</th>
        <th scope="col">1 (Esprit : 2 et 1)</th>
        <th scope="col">0</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Force</td>
        <td>Impossible de tenir une arme</td>
        <td>Impossible de porter une armure</td>
        <td>Immobile</td>
      </tr>
      <tr>
        <td>Dextérité</td>
        <td>Déplacement extrêmement ralentit</td>
        <td>Impossible de se déplacer</td>
        <td>Immobile</td>
      </tr>
      <tr>
        <td>Intelligence</td>
        <td>Impossible de réfléchir, action immédiate</td>
        <td>Impossible d'utiliser une compétence</td>
        <td>Immobile</td>
      </tr>
      <tr>
        <td>Esprit</td>
        <td>Immobile</td>
        <td>Evanouis</td>
        <td>Mort Immédiate</td>
      </tr>
    </tbody>
  </table>
  `,
  eternalGuardian: `<img src="http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE20.png" style="float: left;  margin-right: 0.5rem;"/>
  Les Gardiens Eternels sont les élus d'une prophétie missionné pour sauver le monde. Ils naissent dans des Crystaux Bleus qui se forme naturellement et aléatoirement.<br/><br/>
  D'après la prophétie les Gardiens Éternels se réveillent quand ils sentent inconsciemment que le mal grandit, leur nombre dépend du niveau de menace qui pèse sur Ezur.<br/><br/>
  La singularité des Gardiens Eternels réside dans leur capacité à pouvoir s'adapter à toute situation en changeant leurs aptitudes de combat (aka changement de classe).<br/>
  Ainsi, ils sont capables à tout moment de switcher d'une classe à l'autre, ce qui les rends très polyvalent.
  <br/><br/>
  Il existe 2 types de Gardiens Eternels :<br/>
  - Partiel : Né d'un crystal défectueux (ou de façon prématuré), ces Gardiens possèdent un choix limité de classes,<br/>
  - Complet : Né au terme de leur croissance, ces Gardiens maîtrisent au fur et à mesure de leur gain d'expériences de nouvelles classes :
  <ul><li>Par défaut : les 5 premières classes de chaque catégorie</li>
  <li>Au niveau 5 : les 5 secondes classes de chaque catégorie</li>
  <li>Au niveau 8 : les 5 troisièmes classes de chaque catégorie</li>
  <li>Au niveau 10: additionné de la réussite d'une épreuve dédiée, l'une ou plusieurs des 5 quatrièmes classes</li></ul>
  Dernières particularités des Gardiens Eternels : <br/>- Chaque switch supprime les buffs actifs du personnage<br/>- Chaque switch augmente votre fatigue (entre 50 et 10 selon votre niveau).<br/>- Avant le niveau 10, le switch consomme votre tour. Au-delà, le switch devient une action instantanée.
  `,
}

initDialog(labelsDescription)
