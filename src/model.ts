// Use type instead of enum to easily handle types

// *********************
// #region Enums types
// *********************

export type Joueurs = "Victorine" | "Jérémy" | "Florian" | "Hugo" | "Rachel" | "Cyrille"

export type Classes =
  | "Guerrier"
  | "Chevalier"
  | "Templier"
  | "Chev Dragon"
  | "Voleur"
  | "Assassin"
  | "Danselame"
  | "Samouraï"
  | "Chasseur"
  | "Ingénieur"
  | "Corsaire"
  | "Juge"
  | "Clerc"
  | "Barde"
  | "Shaman"
  | "Sage"
  | "Magicien"
  | "Illusionniste"
  | "Démoniste"
  | "Luminary"

export type Races = "Humain" | "Ezelin" | "Ursun" | "Zumi" | "Anuran" | "Torturran" | "Drakai" | "Tuskar" | "Ogre"

export type Elements =
  | "contondant"
  | "tranchant"
  | "perçant"
  | "feu"
  | "glace"
  | "foudre"
  | "nature"
  | "lumière"
  | "ténèbres"

export type StatsShort = "force" | "dexté" | "intel" | "charisme" | "esprit"

export type StatsName = "Force" | "Dextérité" | "Intelligence" | "Charisme" | "Esprit"

// *********************
/* JSON interfaces */
// *********************

// #region JDR Global
// (Perso, Enemy, Equipment, Skill)

export interface MainElementPerso {
  classeP: Classes
  pvmax: number
  force: number
  dexté: number
  intel: number
  charisme: number
  esprit: number
  skills: string[] // JSON parse string -> string[]
}
export interface Perso extends MainElementPerso {
  nom: string
  race: Races
  classeP: Classes
  classeS: Classes
  xp: number
  niv: number
  awaken: Classes | ""
  pv: number
  stress: number
  pp: string
  forceB: string
  dextéB: string
  intelB: string
  charismeB: string
  espritB: string
  eqpts: string[] // JSON parse -> string[]
  inventaire: string
  argent: string
  personnalite: string
  background: string
  notes: string
  sticky: string
  passif10?: string
  passif12?: string
  passif14?: string
  isArchived: boolean
  joueur: Joueurs | ""
  guardian?: { type: "full" | "partial"; config: MainElementPerso[] }
}

export interface Enemy {
  visuel3D: string
  nom: string
  pvmax: number
  skills: [string, string, string, string]
  stats: string
  desc: string
  drop: string
  weaknesses: [string, string]
}

export interface EnemyGeneric {
  classes: {
    classe: Classes
    sorts: {
      nom: string
      stat: string
      montantFixe: string
      montantVariable: number
      type: string
      portee: "Mono" | "AoE"
      effet: string
      montantEffet: number
      duree: number
    }[]
  }[]
  races: { race: Races }[]
  rangs: {
    rang: string
    stat: number
    pv: number
    montantVariable: { Mono: number; AoE: number }
    montantEffet: { Mono: number; AoE: number }
    duree: number
  }[]
  guildes: {
    guilde: string
    stat?: number
    pv: number
    montantVariable: { Mono: number; AoE: number }
    montantEffet: { Mono: number; AoE: number }
    duree: number
  }[]
}

export type EquipmentType = "arme-1m" | "arme-2m" | "armure" | "access" | "monture"
export type ArmorType = "lourd" | "leger" | "magique"

interface BaseEquipment<T extends EquipmentType> {
  nom: string
  desc: string
  effet: string
  montant: string
  condition?: { type: "classe" | "race" | "panoplie"; value: (Classes | Races)[] | string; bonus: string }
  icone: string
  type: T
  access?: `D${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `A${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
}

export type Equipment<T extends EquipmentType = EquipmentType> = T extends "armure"
  ? BaseEquipment<T> & { armorTypes: ArmorType[] }
  : BaseEquipment<T>

export interface Skill {
  nom: string
  desc: string
  effet: string
  montant: string
  icone: string
  stat: StatsName
  classe: Classes[]
  race?: Races
}
export interface SkillsAwaken extends Partial<Skill> {
  nom: string
}

// #region Master
// + Stats Verification (From Excel File)

export interface MasterData {
  allow: boolean
  notes: string
}

export interface RaceClassStatsValue {
  Force: number
  Dextérité: number
  Intelligence: number
  Charisme: number
  Esprit: number
  PV: number
}
export interface RaceClassStats {
  classes: ({
    Classe: Classes
    armure: ArmorType
  } & RaceClassStatsValue)[]
  races: ({
    Race: string
  } & RaceClassStatsValue)[]
}

// #region Mini-jeu
// (Cards, Logs, Combat (Skills, Perso, Enemy) )

export interface Card {
  id: number
  value: 1 | 2 | 3
  kind: string
  name: string
  description: string
  kindId: string | number
  enemies?: number[]
  group?: 1 | 2 | 3
  hidden?: boolean
  maps?: number[]
}

export interface CombatCheatLog {
  date: string
  joueur: Joueurs
  perso: string
  enemy: string
  degat: number
  armure: number
  pvmax: number
  sumStats: (number | undefined)[]
}

export interface CombatLog {
  date: string
  joueur: Joueurs
  perso: string
  map: number
  cardRarity: number
  enemy: string
  earnedCoins: number
  winCards: [number, string][]
  turn: number
  pv: number
  epv: number
}

export type SkillType = "attaque" | "buff" | "soin" | "skill" | "defense"

export type CombatSkill<T extends SkillType> = {
  nom: string
  classes: Classes[]
  statUsed: StatsShort
  type: T
  montant: string
  montantFixe: number
  icone: string
} & (T extends "buff"
  ? {
      duree: number
      buffElem: (StatsShort | "degat" | "armure" | "degat/tour")[]
    }
  : object)

export interface CombatVariables {
  pv: number
  pvmax: number
  force: number
  dexté: number
  intel: number
  charisme: number
  esprit: number
  forceRes: number
  dextéRes: number
  intelRes: number
  degat: number
  armure: number
}

export interface PersoCombat extends CombatVariables {
  nom: string
  classeP: Classes
  classeS: Classes
  niv: number
}
export interface EnemyCombat extends CombatVariables {
  id?: string
  nom: string
  rarity?: "BOSS" | "ELITE" | "COMMUN"
  degatMin?: boolean
  degatMax?: boolean
}

// #region Profile/Quête
// (Player, PNJ, Map)

export interface Player {
  persos: number[]
  entries: number[]
  alpagaCoin: number
  alpagaCoinSpent: number
  cards: number[]
  date: string
}

export interface PNJ {
  id: string
  nom: string
  race: Races
  desc: string
  lang: string
}

export interface Map {
  name: string
  desc?: string
  wmap_x: number
  wmap_y: number
  wmap: number
  map_x: number | null
  map_y: number | null
  map_z: number | null
  map_r: number | null
  bgm: number | null
  mobs?: number[]
}

// #region Histoires
export interface Resume {
  groupe: 0 | 1 | 2 | 3
  seance: number | "epilogue"
  date: string
  titre: string
  personnages: string[]
  contexte: string
  key_events: string[]
  objectifs: string[]
}
