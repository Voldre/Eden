import { combatSkillsJSON, eqptJSON } from "./JDRstore.js"
import { Equipment, Perso, PersoCombat, StatsShort } from "./model.js"

export const callPHP = async (data: { action: string; name?: string }): Promise<string> => {
  const result = await fetch("jdr_backend.php", {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    method: "POST",
    body: new URLSearchParams(data),
  })
  console.log("jdr_backend.php executed, data : ", data)

  return result.text()
  // Later content-type JSON, body JSON.stringify, and retrieve result.json() ?
  // If that, also change jdr_backend to json_decode input url parameters
}

let currentTimeout: NodeJS.Timeout | undefined

export const toastNotification = (text: string, duration = 3000, error = false): void => {
  const toaster = document.getElementById("toast")!

  if (error) toaster.classList.add("error")
  else toaster.classList.remove("error")

  if (toaster.getAttribute("listener") !== "true") {
    toaster.addEventListener("click", () => {
      toaster.classList.remove("show")
    })
  }

  if (!toaster.classList.contains("show") || error) {
    // Clear timeout if defined
    clearTimeout(currentTimeout)
    toaster.classList.add("show")
    toaster.innerText = text
    currentTimeout = setTimeout(() => {
      toaster.classList.remove("show")
    }, duration)
  }
}

export const aoeDescInfo = {
  range: ["L", "R"],
  type: ["-", "+"],
  rangeName: ["Ligne de", "Rond de"],
  typeName: ["Courte portée", "Longue portée"],
  typeMalus: ["Esquivable Malus 4 si proche, 2 si éloigné", "Esquivable seulement de loin, Malus 3-4"],
}

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
      perso.degat = undefined
      perso.armure = undefined
    }
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
    (2 + montantArme1 + montantArme2) * Math.pow(1.1, perso.niv) + montantAccessD + montantAccessDegatNat
  )

  // Bonus d'armure par niveau (20/11/23 : Fixe à 2 en +, exponentiel par niveau)
  // 02/12/23 : l'exponentiel du bouclier est réduit, car sinon trop cheat
  perso.armure = Math.round(
    (2 + montantArmure) * Math.pow(1.1, perso.niv) +
      montantBouclier * Math.pow(1.05, perso.niv) +
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
      if (statB.match(/^[-+]\d+|\d*$/)?.[0]) return statBWithRegex
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

export const initDialog = (labelsDescription: { [key: string]: string }): void => {
  const dialog = document.querySelector<HTMLDialogElement>("dialog")!
  document.querySelectorAll("label").forEach((label) => {
    if (!labelsDescription[label.htmlFor]) return // Si le label n'a pas de description

    label.addEventListener("click", () => {
      dialog.innerText = ""

      const desc = document.createElement("p")
      // Don't use util createElement function because HTML insert
      desc.innerHTML = labelsDescription[label.htmlFor] // description
      dialog.append(desc)

      dialog.append(closeButton(dialog))

      // Ouverture en "modal"
      dialog.showModal()
    })
  })

  // Allow user to close Modal (Dialogue) by clicking outside
  dialog.addEventListener("click", (e) => {
    const dialogDimensions = dialog.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close()
    }
  })
  // dialog.show() // Opens a non-modal dialog
}

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
        const nbEqptsInPanop = eqptsName.filter(
          (eqptName) => eqptName && eqptName.includes(unformatText(eqpt.condition?.value as string))
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

export const splitParenthesisText = (text: string): [string, string, string] | null => {
  const result = text.match(/(.*)\((.*?)\)(.*)/)
  // result[0] is the whole string, then we have before, inside and after
  return result ? [result[1], result[2], result[3]] : null
}

export const isTextInText = (mainText: string, subText: string): boolean => {
  const mainTextUnformated = unformatText(mainText)
  const subTextUnformated = unformatText(subText)
  return mainTextUnformated.includes(subTextUnformated)
}

// Remove accents, upper case and spaces
export const unformatText = (text: string): string =>
  (text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()

export const sum = (a: number, b: number): number => a + b

export const countEachOccurences = (list: string[]): { [key: string]: number } =>
  list.reduce(
    (acc, curr) => {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
    },
    {} as { [key: string]: number }
  )

export const capitalize = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1)

export const sameDay = (first: Date, second: Date): boolean =>
  first.getUTCFullYear() === second.getUTCFullYear() &&
  first.getUTCMonth() === second.getUTCMonth() &&
  first.getUTCDate() === second.getUTCDate()

export const dateToString = (date: Date, full: boolean = false): string => {
  const stringDate = date.toLocaleString("fr-FR")
  return full ? stringDate : stringDate.split(" ")[0]
}

export const stringToDate = (stringDate: string): Date => {
  const splitDate = stringDate.split("/")
  // console.log(splitDate, new Date(splitDate[2], parseInt(splitDate[1]) - 1, splitDate[0]));

  // Date(year,month-1,day,hours) : hours = 2 to Handle converison locale string FR
  return new Date(parseInt(splitDate[2]), parseInt(splitDate[1]) - 1, parseInt(splitDate[0]), 2)
}

export const readCookie = (key: string): string | undefined => {
  const cookieString = document.cookie.split("; ").find((row) => row.startsWith(`${key}=`))
  return cookieString ? cookieString.split("=")[1] : undefined
}

export const setCookie = (name: string, value: object | boolean): boolean => {
  const stringValue = JSON.stringify(value).replaceAll("+", "%2B").replaceAll(";", "%3B")
  document.cookie = `${name}=${stringValue}; SameSite=Strict`

  if (name === "persosJSON") {
    console.log(`Cookie length : ${stringValue.length}/4000`)
  }
  return stringValue.length < 4000
}

export const fillSelectOptions = (
  selectE: HTMLSelectElement,
  options: (Partial<HTMLOptionElement> & { innerText: string })[]
): void => {
  selectE.innerHTML = "" // Remove previous options
  options.forEach((option) => {
    const optionE = createElement("option", option.innerText, {
      value: option.value,
    })
    if (option.hidden) optionE.hidden = true
    selectE.appendChild(optionE)
  })
}

export type SelectElement<T> = Omit<HTMLSelectElement, "value"> & { value: T }

export type InputElement<T> = Omit<HTMLInputElement, "value" | "min" | "max"> & {
  value: T extends "number" ? number : string
  min: T extends "number" ? number : string
  max: T extends "number" ? number : string
}

export const inputSelector = <T extends "string" | "number">(
  selector: string,
  type: T,
  parent: Document | HTMLElement | Element = document
): InputElement<T> => {
  const el = parent.querySelector(selector) as HTMLInputElement

  return inputElement(el, type)
}

export const inputElement = <T extends "string" | "number">(input: HTMLInputElement, type: T): InputElement<T> => {
  // Utilisation de defineProperty pour redéfinir les propriétés value, min, et max

  // Object.defineProperty(rest, "value", {
  //   get() {
  //     // Convertir en entier (utiliser `parseInt` pour une conversion en nombre entier)
  //     return type === "number" ? parseInt(el.getAttribute("value") || "0", 10) : String(el.getAttribute("value"))
  //   },
  //   set(val: number) {
  //     // Définir la valeur sous forme de chaîne
  //     el.setAttribute("value", String(val))
  //   },
  //   enumerable: true,
  //   configurable: true,
  // })

  // +1000 tentatives :'(

  //

  // Création d'un Proxy pour intercepter les appels aux propriétés et méthodes de l'élément input
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === "value") {
        // Retrieve value has number or string
        return type === "number" ? parseFloat(input.value) || 0 : input.value
      }

      // Intercepter les méthodes comme addEventListener, removeEventListener, etc.
      if (typeof target[prop] === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (...args: any[]) => {
          return target[prop](...args)
        }
      }

      // Retourne la propriété normalement si elle n'est pas redéfinie
      return target[prop]
    },

    set(target, prop, value) {
      if (prop === "value") {
        // Convertir la valeur en nombre
        target.value = value.toString()
      } else {
        target[prop] = value
      }
      return true
    },
  }

  // Crée un Proxy qui remplace l'input HTMLInputElement et prend en charge les méthodes de 'Element'
  const wrapper = new Proxy(input, handler)

  return wrapper
}

export const addChangeListener = <T extends HTMLElement>(
  element: T,
  listener: (_event: Event & { target: T }) => void
): void => {
  element.addEventListener("change", (event) => {
    listener(event as Event & { target: T })
  })
}

export const addClickListener = <T extends HTMLElement>(
  element: T,
  listener: (_event: MouseEvent & { target: T extends HTMLButtonElement | HTMLSelectElement ? T : HTMLElement }) => void
): void => {
  element.addEventListener("click", (event) => {
    listener(event as MouseEvent & { target: T extends HTMLButtonElement | HTMLSelectElement ? T : HTMLElement })
  })
}

// Only some attributes can be defined (partial)
type HTMLAttributes<K extends keyof HTMLElementTagNameMap> = Partial<Omit<HTMLElementTagNameMap[K], "style">>
// Partial events
type EventAttributes = {
  onClick?: (_event: MouseEvent) => void
  onChange?: (_event: Event) => void
}
// Partial style
type CSSStyles = { style?: Partial<CSSStyleDeclaration> }

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  children: undefined | HTMLElement | string | number | (HTMLElement | string)[],
  attributes?: HTMLAttributes<K> & EventAttributes & CSSStyles
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag)

  for (const key in attributes) {
    const value = attributes[key as keyof typeof attributes]
    if (key.startsWith("on") && typeof value === "function") {
      // Pour les événements (par exemple "onClick"), on enlève le "on" et on l'ajoute en minuscule
      element.addEventListener(key.substring(2).toLowerCase(), value as EventListenerOrEventListenerObject)
    } else if (key === "style" && typeof value === "object") {
      // Applique chaque propriété de style si `style` est un objet
      Object.assign(element.style, value)
    } else if (value !== undefined) {
      // Autres attributs standard
      element.setAttribute(key.replace("className", "class"), String(value))
    }
  }

  if (children)
    [...(Array.isArray(children) ? children : [children])].forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        element.appendChild(document.createTextNode(`${child}`))
      } else {
        element.appendChild(child)
      }
    })
  return element
}

// Bouton de fermeture
export const closeButton = (dialog: HTMLDialogElement): HTMLButtonElement =>
  createElement("button", "Fermer", {
    id: "close",
    onClick: () => {
      dialog.close()
    },
  })

export const eventOnClick = (element: Element, fastEvent: () => void, longEvent?: () => void): void => {
  let clickStartTime: number | undefined
  const longClickDuration = 500 // Durée en ms pour considérer un clic comme "maintenu"

  element.addEventListener("mousedown", () => {
    clickStartTime = Date.now()
  })

  element.addEventListener("mouseup", () => {
    const clickDuration = Date.now() - (clickStartTime ?? 0)

    if (clickDuration >= longClickDuration) longEvent?.()
    else fastEvent()
  })
}
