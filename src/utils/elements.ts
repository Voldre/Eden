// #region Notif + Dialog

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

// #region Select

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

// #region Input

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

// #region Event Listener

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

export const shortAndLongEventsOnClick = (element: Element, fastEvent: () => void, longEvent?: () => void): void => {
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

// #region Global

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
