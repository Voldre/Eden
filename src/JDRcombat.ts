import {
  cardJSON,
  persosJSON,
  enemyJSON,
  combatSkillsJSON,
  playerJSON,
  getData,
  classes,
  iconsClasses,
  cheatJSON,
} from "./JDRstore.js"
import {
  Card,
  Classes,
  CombatCheatLog,
  CombatLog,
  CombatSkill,
  CombatVariables,
  Enemy,
  EnemyCombat,
  Joueurs,
  PersoCombat,
  Player,
  SkillType,
  StatsShort,
} from "./model.js"
import {
  callPHP,
  createElement,
  dateToString,
  initDialog,
  inputElement,
  inputSelector,
  isTextInText,
  newPerso,
  readCookie,
  setCookie,
  sum,
  toastNotification,
} from "./utils.js"

console.log(combatSkillsJSON)

let perso: PersoCombat | undefined
let enemy: EnemyCombat | undefined

let turn = 0
let ingame = false
let indexPlayer: Joueurs | undefined
let joueurData: Player | undefined
let selectedEnemy: Enemy | undefined
let currentPersoEntries: number | undefined
const turnToCheck = 6 + Math.floor(Math.random() * 3)

const MIN_COMMON = 15
const MAX_COMMON = 29
const MIN_ELITE = 26
// Average Elite = 32,5
const MAX_ELITE = 39
const MIN_BOSS = 28
const MAX_BOSS = 52 // 49... + out of limite (+3)

let indexPerso: number | undefined
let nomPerso: string | undefined
let logID: number | undefined

let mapID: number | undefined
let enemyRarity: 1 | 2 | 3 = 1
let cardRarity: 1 | 2 | 3 = 1

const newCards: number[] = []

// Main Element

const turnE = document.querySelector<HTMLParagraphElement>("#turn")!
const instructionE = document.querySelector<HTMLParagraphElement>("#instruction")!

const pvE = inputSelector("#pv", "number")
const epvE = inputSelector("#epv", "number")

const lifebarE = document.querySelector<HTMLElement>(".lifebar")!

const buffEs = [...document.querySelectorAll<HTMLElement>(".buff")!]

// Load perso if URL parameter
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search)

  if (urlParams.has("perso")) {
    // Init parameters
    const map = urlParams.get("map")
    mapID = map ? parseInt(map) : undefined

    // Init Perso
    indexPerso = parseInt(urlParams.get("perso")!)
    nomPerso = persosJSON[indexPerso - 1].nom

    indexPlayer = Object.entries(playerJSON)
      .map((player) => {
        if (player[1].persos.includes(indexPerso!)) {
          return player[0] as Joueurs
        }
        return undefined
      })
      .filter((e) => !!e)[0]

    if (!cookieCheck() || !indexPlayer) return

    joueurData = playerJSON[indexPlayer]

    // Update to get current perso entries
    const persoIDforPlayer = joueurData.persos.indexOf(indexPerso)
    currentPersoEntries = joueurData.entries[persoIDforPlayer]

    // 29/11/23 : Add check of entries at the beginning of the fight (here)
    if (currentPersoEntries <= 0) {
      toastNotification("Erreur : Le personnage a déjà consommé toutes ses entrées.", 6000, true)
      endRediction()
      return
    }

    loadFiche()

    // 30/01/24 : Short security to handle abberation (like Nyx with more than 1 billion damage)
    if (!perso || perso.degat > 75 || perso.armure > 50 || perso.pvmax > 275) {
      toastNotification("Erreur : Le personnage a des statistiques hors-norme.", 6000, true)
      endRediction()
      return
    }

    // 27/04/24 : New logs : cheat log to handle potential cheat !
    const sumStats = perso.force + perso.dexté + perso.intel + perso.charisme + perso.esprit

    // Not Malvis, because she is overcheat with her damage
    if ((perso.degat > 52 && perso.nom !== "Malvis") || perso.armure > 35 || perso.pvmax > 200 || sumStats > 72) {
      console.log("new C log...")
      saveCheat(urlParams.get("enemy"))
    }
  } else {
    // Not in real fight
    const enemyCombatData = Object.entries(enemyJSON).map(([id, e]) => {
      const enemyStats = newEnemy(e)
      enemyStats.rarity = enemyStats.pvmax >= 200 ? "BOSS" : enemyStats.pvmax > 120 ? "ELITE" : "COMMUN"
      enemyStats.degatMin =
        (enemyStats.rarity === "BOSS" && enemyStats.degat < MIN_BOSS) ||
        (enemyStats.rarity === "COMMUN" && enemyStats.degat < MIN_COMMON)
      enemyStats.degatMax =
        (enemyStats.rarity === "BOSS" && enemyStats.degat > MAX_BOSS) ||
        (enemyStats.rarity === "COMMUN" && enemyStats.degat > MAX_COMMON)
      enemyStats.id = id
      return enemyStats
    })
    console.log(
      "Stats & Degats de tous les ennemis :",
      [...enemyCombatData].sort((a, b) => parseInt(a.id as string) - parseInt(b.id as string)),
      "Stats & Degats (tri par puissance) :",
      [...enemyCombatData]
        .sort((a, b) => b.degat - a.degat)
        .map((e) => ({
          nom: e.nom,
          id: e.id,
          degat: e.degat,
          pv: e.pv,
          stats: [e.force, e.dexté, e.intel, e.charisme, e.esprit].reduce(sum),
        })),
      "> JSON.stringify() > Copier l'objet > JSON to Excel"
    )
  }

  // Init Enemy

  selectedEnemy = urlParams.has("enemy")
    ? Object.values(enemyJSON).find((e) => e.nom === urlParams.get("enemy"))
    : chooseEnemy()

  if (!selectedEnemy) {
    toastNotification("Erreur : L'ennemi n'a pas été trouvé.", 5000, true)
    endRediction()
    return
  }

  loadEnemy(selectedEnemy, urlParams.has("isElite"))

  if (selectedEnemy.pvmax >= 200) {
    enemyRarity = Math.trunc(selectedEnemy.pvmax / 100) + 1
  } else if (selectedEnemy.pvmax > 120) {
    enemyRarity = 2
  } else {
    enemyRarity = 1
    // Handle enemy with "elite mode"
    enemyRarity += urlParams.has("isElite") ? 1 : 0
  }
  cardRarity = Math.min(enemyRarity, 3) as 1 | 2 | 3

  // First turn
  newturn()
})

function cookieCheck(): boolean {
  if (readCookie("loadJDRcombat") !== "true") {
    toastNotification("Erreur : Lancez un combat à partir d'une quête", 6000, true)
    endRediction()
    return false
  }
  console.log("Allowed")
  // Remove permission for next attempt
  setCookie("loadJDRcombat", false)
  return true
}

function loadFiche(): void {
  const indexP = (indexPerso ?? 0) - 1
  document.querySelector(".perso")!.id = indexP.toString()

  const persoData = persosJSON[indexP]

  if (!persoData) return

  perso = newPerso(persoData)

  inputSelector("#nom", "string").value = perso.nom

  inputSelector("#niv", "number").value = perso.niv
  pvE.value = perso.pv
  inputSelector("#pvmax", "number").value = perso.pvmax

  inputSelector("#degat", "number").value = perso.degat

  inputSelector("#armure", "number").value = perso.armure

  document.querySelector<HTMLImageElement>("#pp")!.src = persoData.pp
  inputSelector("#force", "number").value = perso.force
  inputSelector("#resForce", "string").innerText = `Bloc +${perso.forceRes}`
  inputSelector("#dexté", "number").value = perso.dexté
  inputSelector("#resDexté", "string").innerText = `Esq +${perso.dextéRes}`
  inputSelector("#intel", "number").value = perso.intel
  inputSelector("#resIntel", "string").innerText = `Bloc +${perso.intelRes}`
  inputSelector("#charisme", "number").value = perso.charisme
  inputSelector("#esprit", "number").value = perso.esprit

  // Classes du perso
  const classePID = classes.indexOf(perso.classeP)
  const classeSID = classes.indexOf(perso.classeS)

  loadSkills(perso.classeP, perso.classeS)

  const iconClasses = document.querySelector<HTMLElement & { children: [HTMLImageElement, HTMLImageElement] }>(
    ".iconClasses"
  )!
  iconClasses.children[0].src = `http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE${iconsClasses[classePID]}.png`
  iconClasses.children[1].src = `http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE${iconsClasses[classeSID]}.png`
}

function loadSkills(c1: Classes, c2: Classes): void {
  Object.entries([...document.querySelectorAll<HTMLElement>(".skillCombat")!]).forEach(([i, skillE]) => {
    const id = parseInt(i)
    const skills = combatSkillsJSON.filter((skill) => skill.classes.includes(c1) || skill.classes.includes(c2))
    if (!skills[id]) return
    inputElement(skillE.querySelector(".skillName")!, "string").value = skills[id].nom
    skillE.querySelector<HTMLParagraphElement>(".skillStat")!.innerText = skills[id].statUsed

    const skillMontantE = skillE.querySelector<HTMLParagraphElement>(".montant")!

    if (skills[id].type === "buff") {
      const skill = skills[id] as CombatSkill<"buff">
      skillE.querySelector<HTMLParagraphElement>(".montant")!.innerText =
        `${skill.type} : ${skill.buffElem} +` +
        `${skill.montant ? `${skill.montant}+` : ""}${skill.montantFixe}, 
        ${skill.duree} tours`
      skillMontantE.innerText = skillMontantE.innerText.replaceAll(",", ", ")
    } else if (!skills[id].montantFixe) {
      skillMontantE.innerText = `${skills[id].type} : ${skills[id].montant}`
    } else {
      skillMontantE.innerText = `${skills[id].type} : ${skills[id].montant}+${skills[id].montantFixe}`
    }
    skillE.querySelector<HTMLImageElement>(".icone")!.src =
      `http://voldre.free.fr/Eden/images/skillIcon/${skills[id].icone}.png`

    skillE.addEventListener("click", () => {
      // Bug fix Victorine 26/11/2023 : check if button disabled
      // Because the Event Listener is the whole skill Element, not only the button
      if (!skillE.querySelector<HTMLButtonElement>(".skillName")!.disabled) turnExecution(skills[id], skillE)
    })
  })
}

function loadEnemy(enemyData: Enemy, isElite: boolean = false): void {
  ingame = true
  turn = 0

  // Useless with new chooseEnemy() function
  // document.querySelector(".enemies").id = indexEnemy;
  // var enemyData = enemyJSON[indexEnemy];

  if (!enemyData) return

  enemy = newEnemy(enemyData)

  // Apply "isElite" only if not an elite or a boss
  if (isElite && enemy.pvmax <= 120) {
    enemy.nom += " (ELITE)"
    // Value clipped between min and max
    enemy.pvmax = enemy.pv = Math.round(Math.max(130, Math.min(enemy.pvmax * 1.5, 180)))
    enemy.degat = Math.max(MIN_ELITE, Math.min(Math.round(enemy.degat * 1.1) + 5, MAX_ELITE))
  }

  inputSelector("#enom", "string").value = enemy.nom

  epvE.value = enemy.pvmax
  inputSelector("#epvmax", "number").value = enemy.pvmax
  lifebarE.style.width = `${enemy.pvmax}px`

  const eppE = document.querySelector<HTMLImageElement>("#epp")!
  eppE.src = `http://voldre.free.fr/Eden/images/monsters/${enemyData.visuel3D}.png`
  eppE.alt = enemyData.visuel3D

  document.querySelector<HTMLParagraphElement>("#desc")!.innerText = enemyData.desc

  inputSelector("#edegat", "number").value = enemy.degat
}

function newEnemy(enemyData: Enemy): EnemyCombat {
  enemy = undefined

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
  enemy = loadingEnemy as EnemyCombat
  return enemy as EnemyCombat
}

// var enemyGenerated = Object.values(enemyJSON).map((enemy) => {
//   return new Enemy(enemy);
// });
// console.log(enemyGenerated);

// ***********
// @TODO Obsolete function : to remove ? update ?
function chooseEnemy(category = null): Enemy {
  // prettier-ignore
  const forbidden = ["82","85","101","104","109"];
  // console.log(forbidden.map(f => enemyJSON[f]))

  // prettier-ignore
  const boss = ["24","29","45","46","50","54","56","57","59","61","62","67","70","71","74","75","76","77","80","82","84","85","89","90","101","106","109","111","113","114","115","116","117","118","121","122"];

  let enemyList: [string, Enemy][] = [...Object.entries(enemyJSON)].filter((e) => !forbidden.includes(e[0]))

  if (category === "boss") {
    enemyList = enemyList.filter((e) => boss.includes(e[0]))
  }

  const randomEnemy = Math.floor(Math.random() * enemyList.length)

  return enemyList[randomEnemy][1]
}
// ***********

function dicesAverageConversion(skill: string): number {
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

function dicesConversion(skill: string): number {
  let dices = 0
  if (skill.includes("1D12")) {
    dices += Math.floor(Math.random() * 12 + 1)
  }
  if (skill.includes("1D10")) {
    dices += Math.floor(Math.random() * 10 + 1)
  }
  if (skill.includes("2D10")) {
    dices += Math.floor(Math.random() * 10 + 1) + Math.floor(Math.random() * 10 + 1)
  }
  if (skill.includes("3D10")) {
    dices += Math.floor(Math.random() * 10 + 1) * 2 + Math.floor(Math.random() * 10 + 1)
  }
  if (skill.includes("1D8")) {
    dices += Math.floor(Math.random() * 8 + 1)
  }
  if (skill.includes("2D8")) {
    dices += Math.floor(Math.random() * 8 + 1) + Math.floor(Math.random() * 8 + 1)
  }
  if (skill.includes("1D6")) {
    dices += Math.floor(Math.random() * 6 + 1)
  }
  if (skill.includes("2D6")) {
    dices += Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1)
  }
  if (skill.includes("3D6")) {
    dices += Math.floor(Math.random() * 6 + 1) * 2 + Math.floor(Math.random() * 6 + 1)
  }
  if (skill.includes("4D6")) {
    dices += Math.floor(Math.random() * 6 + 1) * 3 + Math.floor(Math.random() * 6 + 1)
  }
  if (skill.includes("5D6")) {
    dices += Math.floor(Math.random() * 6 + 1) * 4 + Math.floor(Math.random() * 6 + 1)
  }
  if (skill.includes("6D6")) {
    dices += Math.floor(Math.random() * 6 + 1) * 5 + Math.floor(Math.random() * 6 + 1)
  }
  if (skill.includes("1D4")) {
    dices += Math.floor(Math.random() * 4 + 1)
  }
  return dices
}

// FIGHT

function newturn(): void {
  // Correcting inExecution
  inExecution = false
  isEnded()

  turn++
  turnE.innerText = turn.toString()

  // Update 26/11/23 : Pour éviter la triche de "j'enregistre que si j'ai gagné"
  // J'ai décidé de consommer l'entrée du personnage (en sauvegardant) à partir de 6 à 8 tours de combat
  // 6-8 tours représente un engagement "Je réalise le combat jusqu'au bout"

  // Bug Fix 28/11/23 : Ajout condition "ingame". Car si on a déjà gagné (isEnded => victory() / defeat), on a déjà
  // log toutes les informations (avec winCards + earnedcoins), donc pas besoin de re-log !
  if (turn === turnToCheck && ingame) {
    const urlParams = new URLSearchParams(window.location.search)

    if (!urlParams.has("perso") || !joueurData) return

    saveLog(0, undefined)
    savePlayer()
  }

  toastNotification(`Tour n°${turn}, choisissez une action`)
  instructionE.innerText = "Choisissez une action"

  updateBuff()

  unlockInputs(true)
}

async function isEnded(): Promise<void> {
  if (ingame && perso && enemy && (enemy.pv <= 0 || perso.pv <= 0)) {
    ingame = false
    const isVictory = enemy.pv <= 0
    toastNotification(isVictory ? "Victoire !" : "Défaite")
    instructionE.innerText = isVictory ? "Victoire !" : "Défaite"
    updateDesc(`Vous avez ${isVictory ? "vaincu" : "perdu contre"} ${enemy.nom}`)

    if (!joueurData) {
      toastNotification("Erreur : Pas de joueur détecté, sauvegarde impossible", 6000, true)
      return
    }

    try {
      if (isVictory) {
        await victory()
      } else {
        await saveLog(0, undefined)
        await savePlayer()
      }
      toastNotification("Sauvegarde effectuée, redirection ...", 6000)
    } catch (e) {
      console.error(e)
      toastNotification(
        `Erreur : le combat n'a pas pu être sauvegardé :${e instanceof Error ? e.message : e}`,
        6000,
        true
      )
    }
  }

  if (!ingame) {
    endRediction()
  }
}

async function victory(): Promise<void> {
  const e = Object.entries(enemyJSON).find((e) => e[1] === selectedEnemy)

  const enemyID = e ? parseInt(e[0]) : undefined

  if (!joueurData) return

  const newJoueurData: Player = { ...joueurData }
  const winCards = []

  // Map card
  if (mapID) {
    const mapCard = cardJSON.find((card) => card.kind === "map" && card.kindId === mapID && card.value === cardRarity)
    newJoueurData.cards = addCard(newJoueurData.cards, mapCard)
    if (mapCard) winCards.push(mapCard)
  }
  // Boss card
  if (cardRarity === 3) {
    const bossCard = cardJSON.find(
      (card) => card.kind === "boss" && card.kindId.toString().toLowerCase() === selectedEnemy?.visuel3D.toLowerCase()
    )
    newJoueurData.cards = addCard(newJoueurData.cards, bossCard)
    if (bossCard) winCards.push(bossCard)
  }

  // Compo card
  const cardsCompo = cardJSON.filter((card) => card.kind === "composant")
  const compoCardID = Math.floor(Math.random() * cardsCompo.length)
  const compoCard = cardsCompo[compoCardID]
  newJoueurData.cards = addCard(newJoueurData.cards, compoCard)
  if (compoCard) winCards.push(compoCard)

  // Anecdote card (50% chance to get)
  if (Math.random() * 2 <= 1) {
    const anecdoteCardsList = cardJSON.filter(
      (card) =>
        card.kind === "anecdote" &&
        ((mapID && card.maps?.includes(mapID)) || (enemyID && card.enemies?.includes(enemyID)))
    )

    // Choose 1 between all possibilities
    const randomAnecdoteCardID = Math.floor(Math.random() * anecdoteCardsList.length)
    const anecdoteCard = anecdoteCardsList[randomAnecdoteCardID]

    newJoueurData.cards = addCard(newJoueurData.cards, anecdoteCard)
    if (anecdoteCard) winCards.push(anecdoteCard)
  }
  // Coins
  newJoueurData.alpagaCoin = addCoins(newJoueurData.alpagaCoin, winCards)

  // Security 30/12 : Bug when update files, cookies of player are like "corrupted" and enemy data doesn't work well
  if (!newJoueurData.alpagaCoin) {
    toastNotification("Erreur : Données corrompues : Supprimez vos cookies.", 12000, true)
    stop()
  }

  // Save fight in log
  const earnedCoins = newJoueurData.alpagaCoin - joueurData.alpagaCoin

  // Update player data
  joueurData = newJoueurData

  await saveLog(earnedCoins, winCards)
  await savePlayer()

  // Show rewards (cards)
  showCardsAndCoins(winCards, earnedCoins)
}

async function saveCheat(enemyName: string | null): Promise<void> {
  const cheatID = parseInt(Object.keys(cheatJSON).reverse()[0]) + 1 || 1

  const newCheatLog: { [key: string]: Partial<CombatCheatLog> } = {}
  newCheatLog[cheatID] = {
    date: dateToString(new Date(), true),
    joueur: indexPlayer,
    perso: nomPerso,
    enemy: enemyName ?? undefined,
    degat: perso?.degat,
    armure: perso?.armure,
    pvmax: perso?.pvmax,
    sumStats: [perso?.force, perso?.dexté, perso?.intel, perso?.charisme, perso?.esprit],
  }

  setCookie("combatCheatJSON", newCheatLog)
  await callPHP({ action: "saveFile", name: "combatCheat" })
}

async function saveLog(earnedCoins: number, winCards: Card[] | undefined): Promise<void> {
  const logsJSON = getData<{ [key: string]: CombatLog }>("combatLogs")

  if (logID === undefined) logID = parseInt(Object.keys(logsJSON).reverse()[0]) + 1 || 1

  const newLog: { [key: string]: Partial<CombatLog> } = {}
  newLog[logID] = {
    date: dateToString(new Date(), true),
    joueur: indexPlayer,
    perso: nomPerso,
    map: mapID,
    cardRarity,
    enemy: selectedEnemy?.nom,
    earnedCoins,
    winCards: winCards?.map((w) => [w.id, w.name]) || [],
    turn: parseInt(turnE.innerText),
    pv: perso?.pv,
    epv: enemy?.pv,
  }

  // console.log(newLog);

  setCookie("combatLogsJSON", newLog)
  // console.log("saveFile done : combatLogs, jdr_backend.php executed");
  await callPHP({ action: "saveFile", name: "combatLogs" })
}

async function savePlayer(): Promise<void> {
  if (!indexPerso || !joueurData) {
    toastNotification("Erreur : Le personnage n'a pas été identifié.", 6000, true)
    return
  }
  // Last control before save : if entries are negative, don't save !
  const persoIDforPlayer = joueurData.persos.indexOf(indexPerso)

  // Glitch Bug fixes : Victorine 27/11/23 "Infini combat si tu gagnes avant T6-8 !"
  // En effet, l'entrée n'était pas décomptée/consommée si tu finissais avant, mtn dès la save je la compte
  if (currentPersoEntries === joueurData.entries[persoIDforPlayer]) joueurData.entries[persoIDforPlayer] -= 1

  if (!indexPlayer || joueurData.entries[persoIDforPlayer] <= -1) {
    toastNotification("Erreur : Le personnage a déjà consommé toutes ses entrées.", 6000, true)
    return
  }

  const newPlayer: { [key: string]: Player } = {}
  newPlayer[indexPlayer] = joueurData
  // console.log(newPlayer);

  setCookie("playerJSON", newPlayer)
  await callPHP({ action: "saveFile", name: "player" })
}

function addCard(joueurDataCards: number[], card: Card | undefined): number[] {
  if (card && !joueurDataCards.includes(card.id)) {
    newCards.push(card.id)
    joueurDataCards.push(card.id)
  }
  return joueurDataCards
}
function addCoins(alpagaCoin: number, winCards: Card[]): number {
  const cardsValue = winCards?.map((card) => (card ? card.value : 0) as number).reduce(sum) || enemyRarity
  if (cardRarity === 2) {
    // 13/12/23 : Add 1 alpaga Coin for Elite !
    alpagaCoin += 1
  }
  return alpagaCoin + cardsValue + Math.max(enemyRarity - 3, 0)
}

function showCardsAndCoins(winCards: Card[], newCoins: number): void {
  // console.log("Earned : " + newCoins.toString() + ", New sold : " + (newCoins + joueurData.alpagaCoin).toString());
  // console.log(winCards.map((card) => card?.name));
  // winCards.forEach((card) => {
  //   if (!oldJoueurData.cards.includes(card.id)) {
  //     console.log(card.name + " is a new Card !");
  //   }
  // });

  const dialog = document.querySelector("dialog")!
  // Disable outside click to close dialog
  dialog.style.pointerEvents = "none"
  document.querySelector<HTMLParagraphElement>("#coins")!.innerText = newCoins.toString()

  const cardsE = document.querySelector("#cards")!

  winCards.forEach((card) => {
    const li = createElement("li", `${card.name}${newCards.includes(card.id) ? " (NEW)" : ""}`, {
      style: newCards.includes(card.id) ? { color: "gold" } : {},
    })

    const imgEndPoint = "images/"
    let imgSrc
    switch (card.kind) {
      case "map": {
        imgSrc = `${imgEndPoint}loadingframe/Loading_${card.kindId}.png`
        break
      }
      case "boss": {
        imgSrc = `${imgEndPoint}monsters/${card.kindId}.png`
        break
      }
      case "composant": {
        imgSrc = `${imgEndPoint}items/${card.kindId}.png`
        break
      }
      case "anecdote": {
        imgSrc = `${imgEndPoint + card.kindId}.png`
        break
      }
      default:
        console.log(`Erreur, type non reconnu : ${card.kind}`)
    }

    const imgCardE = createElement("img", undefined, { src: imgSrc })
    const div = createElement("div", [li, imgCardE])

    cardsE.append(div)
  })

  // Ouverture en "modal"
  dialog.showModal()
}

function endRediction(): void {
  setTimeout(() => {
    window.location.href = `jdr_profil.html?joueur=${indexPlayer}`
  }, 5500)
}

// Dice

function rollDice<T extends SkillType>(user: EnemyCombat | PersoCombat, type: T, statName: StatsShort): string {
  const duration = 500 // in ms

  const section = user === perso ? document.querySelector(".playerAction")! : document.querySelector(".enemyAction")!

  const stat = user[statName]
  // console.log(user,statName,stat)

  const dice = section.querySelector<HTMLParagraphElement>(".dice")!

  let success

  const statNameE = section.querySelector<HTMLParagraphElement>(".statName")!

  // Stat name section + Success amount
  if (["attaque", "skill", "soin", "buff"].includes(type)) {
    statNameE.innerText = statName
    // 24/11/23 : Max success is 18 (because user can have 19,20, ... !)
    success = Math.min(stat, 18)
  } else {
    // Defense
    statNameE.innerText = `${statName}/2`
    // 24/11/23 : Max success is 13 (because user can have more !)
    const resBonus =
      statName === "force" || statName === "dexté" || statName === "intel" ? (user[`${statName}Res`] ?? 0) : 0
    success = Math.min(Math.ceil(stat / 2) + resBonus, 13)

    // console.log("Defense " + statName + " : " + success);
  }

  // Result (correction 20/11/23 : change round to floor to have nice repartition)
  const diceValue = Math.floor(Math.random() * 20 + 1)

  let result
  if (diceValue > success) {
    result = "fail"
    if (diceValue === 20) result = "crit fail"
  } else {
    result = "success"
    if (diceValue === 1) result = "crit success"
  }
  // Display result

  if (!dice.classList.contains("show")) {
    dice.classList.add("show")
    setTimeout(() => {
      dice.classList.remove("show")
      dice.innerText = diceValue.toString()

      switch (result) {
        case "fail":
          dice.style.filter = "drop-shadow(1px 1px 10px darkred)"
          break
        case "crit fail":
          dice.style.filter = "drop-shadow(1px 1px 15px red)"
          break
        case "success":
          dice.style.filter = "drop-shadow(1px 1px 10px green)"
          break
        case "crit success":
          dice.style.filter = "drop-shadow(1px 1px 15px yellow)"
          break
        default:
      }
    }, duration)
  }

  return result
}

function resetDices(): void {
  ;[...document.querySelectorAll<HTMLParagraphElement>(".dice")].forEach((dice) => {
    dice.style.filter = ""
    dice.innerText = ""
  })
  ;[...document.querySelectorAll<HTMLParagraphElement>(".instruction")].forEach((desc) => {
    desc.innerText = ""
  })
  updateDesc("")
}

const statsButton: StatsShort[] = ["force", "dexté", "intel"]
statsButton.forEach((buttonStat) => {
  document.querySelector(`#b${buttonStat}`)!.addEventListener("click", () => {
    turnExecution(enemySkill(buttonStat))
  })
})

// *** Turn execution ***
const enemySkill = (stat: StatsShort): CombatSkill<"attaque"> => ({
  nom: "Attaque ennemi",
  type: "attaque",
  montant: "Dégât +1D10",
  montantFixe: 0,
  statUsed: stat,
  classes: [],
  icone: "",
})

let inExecution = false
function turnExecution<T extends SkillType>(persoSkill: CombatSkill<T>, skillE?: HTMLElement | undefined): void {
  // Bug fix Victorine 26/11/2023 : If already clicked (in execution), then cancel
  // Because if not, can spam x skills and kill enemy in 1 turn !
  if (inExecution) return
  inExecution = true

  if (!ingame || !perso) {
    toastNotification(`Le combat est terminé ${!perso ? " : Pas de perso détecté" : ""}`, 4000, !perso)
    return
  }

  // Déroulement du tour
  unlockInputs(false)

  executeAction(perso, persoSkill)

  setTimeout(() => {
    enemyTurn()
  }, 3000)

  setTimeout(() => {
    newturn()

    // Add 05/11/2023 : Can't use same skill 2 times
    if (skillE) {
      inputElement(skillE.querySelector(".skillName")!, "string").disabled = true
      // 25/11/2023 : Can't use heal 2 times (too cheat)
      if (document.querySelector<HTMLParagraphElement>(".montant")!.innerText.includes("soin")) {
        Object.values([...document.querySelectorAll(".skillCombat")]).forEach((sE) => {
          if (sE.querySelector<HTMLParagraphElement>(".montant")!.innerText.includes("soin")) {
            sE.querySelector<HTMLInputElement>(".skillName")!.disabled = true
          }
        })
      }
    }
  }, 6000)
}

// Enemy Turn

function enemyTurn(): void {
  isEnded()

  if (!ingame || !enemy) {
    toastNotification(`Le combat est terminé ${!enemy ? " : Pas d'ennemi détecté" : ""}`, 4000, !enemy)
    return
  }

  toastNotification("Au tour de l'ennemi...")
  instructionE.innerText = "Au tour de l'ennemi..."

  // CHOIX DE STAT : Stat choisi par l'ennemi : que l'une des 2 meilleures
  const { force, dexté, intel } = enemy
  // Sort stats from upper to lower
  const stats = (
    [
      ["force", force],
      ["dexté", dexté],
      ["intel", intel],
    ] as [StatsShort, number][]
  ).sort((a, b) => b[1] - a[1])

  const sumStatsATK = stats[0][1] + stats[1][1]

  // enemy.force+enemy.dexté+enemy.intel;
  const randValue = Math.round(Math.random() * sumStatsATK)

  const statName: StatsShort = randValue < stats[0][1] ? stats[0][0] : stats[1][0]

  executeAction(enemy, enemySkill(statName))
}

function executeAction<T extends SkillType>(user: EnemyCombat | PersoCombat, userSkill: CombatSkill<T>): void {
  // console.log(userSkill);
  const type = userSkill.type
  const statName = userSkill.statUsed

  resetDices()

  const opponent = user === perso ? enemy! : perso!

  const userResult = rollDice(user, type, statName)
  let montant = 0

  // Montant des dégâts
  if (userResult === "crit success") {
    montant = dicesAverageConversion(userSkill.montant) * 2 + (userSkill.montantFixe || 0)
  } else if (userResult === "success") {
    montant = dicesConversion(userSkill.montant) + (userSkill.montantFixe || 0)
  }

  // console.log("montant : ", montant);

  if (type === "attaque") {
    if (userResult === "crit success") {
      hit(opponent, user.degat + montant)
      updateDesc("Touché critique !")
    } else if (userResult === "success") {
      setTimeout(() => {
        const opponentResult = rollDice(opponent, "defense", statName)
        if (opponentResult === "fail") {
          updateDesc("Touché !")
          hit(opponent, user.degat + montant)
        } else if (opponentResult === "crit fail") {
          hit(opponent, user.degat + 5 + montant)
          updateDesc("Touché !")
        } else {
          updateDesc("Bloqué / Esquivé")
        }
      }, 1500)
    }
  } else if (type === "soin") {
    if (userResult === "crit success") {
      // Update 26/11/23 : Nerf du heal qui est trop cheat
      // "Heal autant que ton montant de dégâts, ce n'est pas normal"
      // 0 de dégâts transformé en heal, ce n'est pas normal non plus
      // Test d'une première version où 2/3 dégâts == Heal
      // heal(user, (user.degat * 4) / 5 + montant);
      heal(user, Math.floor(user.degat * 0.9) + montant)
      updateDesc("Soin critique !")
    } else if (userResult === "success") {
      // heal(user, Math.floor((user.degat * 4) / 5) + montant);
      heal(user, Math.floor(user.degat * 0.9) + montant)
      updateDesc("Soin !")
    }
  } else if (type === "buff") {
    if (userResult === "crit success") {
      buff(userSkill as CombatSkill<"buff">, montant)
      updateDesc("Buff critique !")
    } else if (userResult === "success") {
      buff(userSkill as CombatSkill<"buff">, montant)
      updateDesc("Buff !")
    }
  }

  if (userResult === "fail") {
    updateDesc("Echec")
  } else if (userResult === "crit fail") {
    // Update 05/01/2024 : Pour les ennemis, sachant qu'ils n'ont pas d'armure, ils ont une
    // réduction égale à 1/8 des dégâts.
    // Exemple joueur (32 dégâts, 20 armures) : (32/2 = 16) + (20/2 =10) = 26, 26 - 20 (armure) = 6 sur un échec critique
    // Si on a dégâts <= armures, alors on prend 0
    // Exemple ennemi (40 dégâts) : (40/2 = 20) + (-40/8 = -5) = 15, 15 - 0 (armure) = 15 sur un échec critique
    hit(user, Math.trunc(user.degat / 2) + Math.trunc(user.armure / 2 || -user.degat / 8))
    updateDesc("Echec critique")
  }
}

function hit(user: EnemyCombat | PersoCombat, amount: number): void {
  const damage = amount - (user.armure || 0)
  if (damage > 0) {
    // Si <0 == Big armure, mal chance, etc... donc 0 mais ça ne soigne pas
    user.pv -= damage
  }
  if (user === perso) {
    pvE.value = user.pv
  } else {
    epvE.value = user.pv
    // document.querySelector(".lifebar").style.width = `${Math.max(39 * (user.pv / user.pvmax), 0)}%`;
    lifebarE.style.width = `${Math.max(user.pv, 0)}px`
  }
}

function heal(user: EnemyCombat | PersoCombat, amount: number): void {
  // Bug Fixes Victorine 20/11/23 : Take min between "max HP and healed HP" x)
  // ++ Reduce the heal by 1 point (because too cheat)
  user.pv = Math.min(user.pvmax, user.pv + amount - 1)

  // min() permet de gérer si les PV soignés sont > aux PV max
  pvE.value = user.pv
}

function buff(userSkill: CombatSkill<"buff">, amount: number): void {
  buffEs.every((buffE) => {
    const buffDurationsEs = buffE.querySelector<
      HTMLElement & { children: [HTMLParagraphElement, HTMLParagraphElement] }
    >(".duree")!
    // Second security check to don't update Euphorie, which increase each turn
    if (buffE.id === userSkill.nom && buffE.id !== "Euphorie") {
      // if already applied, update buff time
      buffDurationsEs.children[0].innerText = `${userSkill.duree + 1}` // +1 car tour actuel à ne pas compter !
      buffDurationsEs.children[1].innerText = `${userSkill.duree}`
      return false
    }

    if (buffDurationsEs.children[0].innerText !== "") return true

    buffDurationsEs.children[0].innerText = `${userSkill.duree + 1}` // +1 car tour actuel à ne pas compter !
    buffDurationsEs.children[1].innerText = `${userSkill.duree}`
    buffE.querySelector<HTMLParagraphElement>(".montant")!.innerText = `${amount}`

    const buffIconE = buffE.querySelector<HTMLImageElement>(".icone")!
    buffIconE.src = `http://voldre.free.fr/Eden/images/skillIcon/${userSkill.icone}.png`

    buffIconE.title = userSkill.buffElem.toString()

    buffE.id = userSkill.nom

    userSkill.buffElem.forEach((bE) => {
      if (!perso) return

      const statbE = bE.replace("/tour", "") as keyof CombatVariables
      perso[statbE] += amount
      inputElement(document.querySelector(`#${statbE}`)!, "number").value = perso[statbE]
    })

    return false
  })
}

function updateDesc(desc: string): void {
  setTimeout(() => {
    document.querySelector<HTMLParagraphElement>("#actionDescription")!.innerText = desc
  }, 1000)
}

// Skills and stats buttons
const skillsButton = [
  ...document.querySelectorAll<HTMLElement & { children: [HTMLButtonElement] }>(".skillCombat"),
].map((skillE) => skillE.children[0])

function unlockInputs(bool: boolean): void {
  statsButton.forEach((buttonStat) => {
    document.querySelector<HTMLButtonElement>(`#${buttonStat}`)!.disabled = !bool
  })

  skillsButton.forEach((buttonSkill) => {
    buttonSkill.disabled = !bool

    // Bug Fix 27/11/23 (Grâce aux logs <3, et à la triche de Sekhmet # Battu Ochak Oo)
    if (buttonSkill.value === "Euphorie") {
      buffEs.forEach((buffE) => {
        if (buffE.id === "Euphorie") {
          buttonSkill.disabled = true
        }
      })
    }
  })
}

function updateBuff(): void {
  buffEs.forEach((buffE) => {
    if (!perso) return

    const dureeE = buffE.querySelector<HTMLElement & { children: [HTMLParagraphElement, HTMLParagraphElement] }>(
      ".duree"
    )!
    const buffIconE = buffE.querySelector<HTMLImageElement>(".icone")!
    const buffMontant = buffE.querySelector<HTMLParagraphElement>(".montant")!
    const buffElem = buffIconE.title.split(",")

    if (dureeE.children[0].innerText === "") return

    if (dureeE.children[0].innerText !== "1") {
      dureeE.children[0].innerText = `${parseInt(dureeE.children[0].innerText) - 1}`

      // If buff per turn (ex : Euphorie), apply buff
      if (buffIconE.title.includes("/tour")) {
        const buffVar = buffElem[0].replace("/tour", "") as keyof CombatVariables
        perso[buffVar] += parseInt(buffMontant.innerText)
        inputElement(document.querySelector(`#${buffVar}`)!, "number").value = perso[buffVar]
      }
      // Else, if last turn
    } else {
      if (buffIconE.title.includes("/tour")) {
        // If buff each turn, we remove the whole buff (amount * duration)
        const buffVar = buffElem[0].replace("/tour", "") as keyof CombatVariables
        perso[buffVar] -= parseInt(buffMontant.innerText) * (parseInt(dureeE.children[1].innerText) + 1)
        inputElement(document.querySelector(`#${buffVar}`)!, "number").value = perso[buffVar]
      } else {
        ;(buffElem as (keyof CombatVariables)[]).forEach((bE) => {
          if (!perso) return
          perso[bE] -= parseInt(buffMontant.innerText)
          inputElement(document.querySelector(`#${bE}`)!, "number").value = perso[bE]
        })
      }

      dureeE.children[0].innerText = ""
      dureeE.children[1].innerText = ""

      buffMontant.innerText = ""
      buffIconE.src = ""
      buffIconE.title = ""
      buffE.id = ""
    }
  })
}

// Modal (Dialog) des informations de bases des labels

const labelsDescription = {
  niv: "Augmente automatiquement tous les 100 points d'expériences du Niveau 1 à 5, puis tous les 150.<br/> Tous les niveaux paire (2,4,6,8), vous obtenez une compétence.<br/> Au Niveau 5 vous avez +1 en Esprit.<br/> Au Niveau 10, c'est +1 où vous voulez.",
  pv: "Statistique des PV, augmente de 5 par niveau.",
  degat:
    "Les dégâts sont calculés en faisant la somme du montant des 2 premières armes. Puis +10% par niveau. Ex : Armes : 4+5, niveau 6 : 9*1.1^6 = 16<br/> Chaque coup est additionné de 1D10 de dégâts.",
  armure:
    "L'armure vaut le montant de l'armure (dégât reçu -x). Puis +10% par niveau. Ex : Armure : 4, niveau 6 : 9*1.1^6 = 7",
  //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
}

initDialog(labelsDescription)
