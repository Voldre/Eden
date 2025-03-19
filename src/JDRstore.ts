import {
  Card,
  RaceClassStats,
  CombatSkill,
  Enemy,
  Equipment,
  Map,
  MasterData,
  Perso,
  Player,
  PNJ,
  Skill,
  SkillsAwaken,
  Classes,
  Elements,
  Joueurs,
  EnemyGeneric,
  CombatCheatLog,
  Resume,
  Races,
} from "./model"

const xhReq = new XMLHttpRequest()

// console.log(window.location.href)

// JDR main data

export const persosJSON = getData<{ [key: string]: Perso }>("persos")

export const skillsJSON = getData<{ [key: string]: Skill }>("skills")
export const skillsAwakenJSON = getData<{ [key: string]: SkillsAwaken }>("skillsAwaken")
export const eqptJSON = getData<{ [key: string]: Equipment }>("eqpt")

export const enemyJSON = getData<{ [key: string]: Enemy }>("enemy")

export const galeryJSON = getData<string[]>("galery")

export const masterJSON = getData<MasterData>("master")

export const enemyGenericJSON = getData<EnemyGeneric>("enemyG")
export const statsJSON = getData<RaceClassStats>("stats")

// JDR combat main data

// eslint-disable-next-line no-unused-vars
export const playerJSON = getData<{ [key in Joueurs]: Player }>("player")

export const cardJSON = getData<Card[]>("card")

export const mapsJSON = getData<{ [key: string]: Map }>("maps", false)

export const pnjJSON = getData<{ [key: string]: PNJ }>("pnj")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const combatSkillsJSON = getData<CombatSkill<any>[]>("combatS")

// combat logs are too heavy to be fetched, get last id instead
// export const logsJSON = getData<{ [key: string]: CombatLog }>("combatLogs")
export const cheatJSON = getData<{ [key: string]: CombatCheatLog }>("combatCheat")

export const resumeJSON = getData<Resume[]>("resume")

export function getData<T>(filename: string, JDR = true): T {
  try {
    if (window.location.href.includes("http")) {
      if (JDR) {
        xhReq.open("GET", `./JDR${filename}.json?${new Date().getTime()}`, false)
      } else {
        xhReq.open("GET", `./${filename}.json?${new Date().getTime()}`, false)
      }
      xhReq.send(null)
      return JSON.parse(xhReq.responseText)
    }
    throw new Error("Not in HTTP location")
  } catch (e) {
    console.error(e)
    return {} as T
  }
}

// Enum as variables

export const races: Races[] = ["Humain", "Ezelin", "Ursun", "Zumi", "Anuran", "Torturran", "Drakai", "Tuskar", "Ogre"]

// prettier-ignore
export const classes : Classes[] = [ "Guerrier", "Chevalier", "Templier", "Chev Dragon", "Voleur", "Assassin", "Danselame", "Samouraï", "Chasseur", "Ingénieur", "Corsaire", "Juge", "Clerc", "Barde", "Shaman", "Sage", "Magicien", "Illusionniste", "Démoniste", "Luminary",];
// prettier-ignore
export const iconsClasses = [ "01", "02", "03", "18", "04", "05", "06", "16", "07", "08", "09", "59", "10", "11", "12", "17", "13", "14", "15", "19",];
// prettier-ignore
export const iconsEveil = [ "J009", "J011", "J013", "j043", "J015", "J017", "J019", "j039", "J021", "J023", "J025", "j087", "J027", "J029", "J031", "j041", "J033", "J035", "J037", "j045"];

// prettier-ignore
export const elements : Elements[] = ["contondant","tranchant", "perçant", "feu", "glace", "foudre", "nature", "lumière", "ténèbres"];

export const aoeDescInfo = {
  range: ["L", "R"],
  type: ["-", "+"],
  rangeName: ["Ligne de", "Rond de"],
  typeName: ["Courte portée", "Longue portée"],
  typeMalus: ["Esquivable Malus 4 si proche, 2 si éloigné", "Esquivable seulement de loin, Malus 3-4"],
}
