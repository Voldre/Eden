import { getData } from "../JDRstore.js"
import { setCookie } from "../utils/data.js"
import { closeButton, createElement, fillSelectOptions, initDialog, toastNotification } from "../utils/elements.js"
import { daysBetween, sum } from "../utils/variables.js"

// #region Interface + Utils
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MISSION_CATEGORIES = ["Gain", "Pénalité", "Achat"] as const
type MissionCategories = (typeof MISSION_CATEGORIES)[number]

interface MissionModel {
  nom: string
  description: string
  category: MissionCategories
  coins: number
}
const models: MissionModel[] = getData<MissionModel[]>("Models", false)

interface RawMission {
  id: number
  date: string
  model: MissionModel
  completed: boolean
}

interface Mission {
  id: number
  date: Date
  model: MissionModel
  completed: boolean
}

const dateToISOString = (date: Date): string => date.toISOString().split("T")[0]!
const today = new Date(dateToISOString(new Date()))

const callPHP = async (
  data:
    | { action: "saveFile"; name: string; toDelete: "0" | "1" }
    | { action: "login"; username: string; password: string }
    | { action: "logged" }
    | { action: "logout" }
): Promise<boolean> => {
  const result = await fetch(`http://voldre.free.fr/Eden/moymoy_missions/backend.php`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    method: "POST",
    body: new URLSearchParams(data),
    // For PHP session
    // credentials: "include",
  })
  console.log(`backend.php executed, data : `, data)

  if (!result.ok) throw new Error(`HTTP Error ${result.status}: ${result.statusText}`)
  const value = await result.text()
  return value === "1"
}

// #region Coins
const moymoyCoinE = document.querySelector<HTMLParagraphElement>(".moymoyCoin")!
const moymoyCoinSpentE = document.querySelector<HTMLParagraphElement>(".moymoyCoinSpent")!

const missionsDaysWrapper = document.querySelector("#missions-days-wrapper")!

type CoinElement = HTMLDivElement & { children: [HTMLDivElement, HTMLImageElement] }
const createCoinElement = (coins: number, generic: boolean): CoinElement => {
  const coinsE = createElement("div", coins > 0 ? `+${coins} ` : coins)
  const coinImgE = createElement("img", undefined, {
    src: "../images/layout/moymoyCoin.png",
    className: "alpagaCoinPic",
    alt: " pièces",
  })
  return createElement("div", [coinsE, coinImgE], {
    className: "coins-wrapper",
    style: generic ? { padding: "0", background: "transparent", borderTop: "0" } : undefined,
  }) as CoinElement
}

const getMissionsCoins = (missions: (RawMission | Mission)[]): number =>
  missions
    .filter((m) => m.completed)
    .map((m) => m.model.coins)
    .reduce(sum, 0)

let connected = false
const connectionPointE = document.querySelector(".connectionPoint")!
const isConnected = async (): Promise<boolean> => {
  connected = await callPHP({ action: "logged" })
  connectionPointE.classList.toggle("hide", !connected)
  return connected
}

// #region Display

const onClickMission = async (mission: Mission, dateCoinE: CoinElement, toDelete: boolean): Promise<void> => {
  const moymoyMissionsJSON: RawMission[] = getData<RawMission[]>("MoymoyMissions", false)

  const newMissionsJSON = moymoyMissionsJSON
    // Invert only completed state
    .map((m) => (m.id === mission.id ? { ...m, completed: !m.completed } : m))

  const newMissionJSON = newMissionsJSON.find((m) => m.id === mission.id)

  if (!newMissionJSON) {
    console.log({ moymoyMissionsJSON, mission })
    toastNotification("Erreur : l'élément n'existe plus", 3000, true)
    return
  }
  setCookie("MoymoyMissionsJSON", newMissionJSON)
  const res = await callPHP({ action: "saveFile", name: "MoymoyMissions", toDelete: toDelete ? "1" : "0" })
  if (!res) {
    toastNotification("Erreur : la sauvegarde a échouée", 3000, true)
    throw new Error("callPHP return false")
  }
  toastNotification("Sauvegarde effectuée")

  moymoyCoinE.innerText = `${getMissionsCoins(newMissionsJSON)}`

  const dateMissions = newMissionsJSON.filter((m) => m.date === dateToISOString(mission.date))
  dateCoinE.children[0].innerText = `${getMissionsCoins(dateMissions)}`
  document.querySelector(`#mission-${mission.id}`)!.classList.toggle("completed")

  if (toDelete) {
    displayMissions()
  }
}

const displayMissions = (): void => {
  missionsDaysWrapper.innerHTML = ""
  const moymoyMissionsJSON: Mission[] = getData<RawMission[]>("MoymoyMissions", false)
    .map((mission) => ({ ...mission, date: new Date(mission.date) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  moymoyCoinE.innerText = `${getMissionsCoins(moymoyMissionsJSON)}`
  moymoyCoinSpentE.innerText = ` (${moymoyMissionsJSON
    .filter((m) => m.completed && m.model.category === "Achat")
    .map((m) => -m.model.coins)
    .reduce(sum, 0)})`

  const missionsByDate = Object.groupBy(moymoyMissionsJSON, (m) => dateToISOString(m.date))

  Object.entries(missionsByDate).forEach(([date, missions]) => {
    if (!missions) return

    const earnedCoins = getMissionsCoins(missions)
    const dateCoinE = createCoinElement(earnedCoins, true)
    const dateHeaderE = createElement(
      "div",
      [createElement("div", `${date} —`, { style: { fontSize: "20px" } }), dateCoinE],
      {
        className: "header",
      }
    )

    const missionsE = createElement(
      "div",
      missions.map((mission) => {
        const checkboxE = createElement("input", undefined, {
          type: "checkbox",
          checked: mission.completed ? true : undefined,
        })
        // onClick does not work with prevent default
        checkboxE.addEventListener("click", async () => {
          connected = await isConnected()

          const reset = (): void => {
            checkboxE.checked = !checkboxE.checked
          }
          if (!connected) {
            if (mission.date > today) {
              toastNotification("Vous ne pouvez pas modifier les futures missions", 3000, true)
              reset()
              return
            } else if (daysBetween(today, mission.date) >= 3) {
              toastNotification("Vous ne pouvez pas modifier les anciennes missions", 3000, true)
              reset()
              return
            }
            if (mission.model.category === "Pénalité") {
              toastNotification("Vous ne pouvez pas modifier une pénalité", 3000, true)
              reset()
              return
            }
          }
          await onClickMission(mission, dateCoinE, false)
        })
        const statusE = createElement(
          "label",
          [checkboxE, createElement("span", undefined, { className: "checkmark" })],
          { className: "mission-checkbox" }
        )
        const nomE = createElement("p", mission.model.nom, { style: "text-decoration:underline;" })
        const descE = createElement("p", mission.model.description, { style: "white-space: break-spaces;" })

        const missionCoinsE = createCoinElement(mission.model.coins, false)

        const deleteE = createElement("button", "🗑️", {
          id: "delete",
          onClick: async () => {
            await onClickMission(mission, dateCoinE, true)
          },
          style: { float: "right" },
        })

        return createElement("div", [statusE, nomE, ...(connected ? [deleteE] : []), descE, missionCoinsE], {
          id: `mission-${mission.id}`,
          className: `mission ${mission.completed ? "completed" : ""}`,
        })
      }),
      { className: "missions-day" }
    )
    const wrapperE = createElement("div", [dateHeaderE, missionsE], {
      className: "missions-day-wrapper",
    })
    missionsDaysWrapper.append(wrapperE)
  })
}

window.addEventListener("load", async () => {
  initDialog({})
  await isConnected()

  displayMissions()
})

// #region Login

const dialog = document.querySelector<HTMLDialogElement>("dialog")!

const logoE = document.querySelector("#logo") as HTMLImageElement
logoE.addEventListener("click", async () => {
  dialog.innerHTML = ""

  connected = await isConnected()

  // Connexion
  if (!connected) {
    const usernameE = createElement("input", undefined, { type: "text", id: "username", required: true })
    const passwordE = createElement("input", undefined, { type: "password", id: "password", required: true })
    const submitE = createElement("input", undefined, { type: "submit", value: "Connexion" })
    const formE = createElement("form", [usernameE, passwordE, submitE])

    formE.addEventListener("submit", async (event) => {
      event.preventDefault()

      const logged = await callPHP({ action: "login", username: usernameE.value, password: passwordE.value })

      toastNotification(logged ? "Login success" : "Login fail", 2000, !logged)
      if (logged) dialog.close()
    })

    dialog.append(formE)
  } else {
    const logoutE = createElement("button", "Deconnexion", {
      onClick: async () => {
        await callPHP({ action: "logout" })
        dialog.close()
      },
    })
    dialog.append(logoutE)
  }

  dialog.append(closeButton(dialog))
  dialog.showModal()
})

// #region Form
const addEventE = document.querySelector("#add-event") as HTMLButtonElement

addEventE.addEventListener("click", async () => {
  dialog.innerHTML = ""

  connected = await isConnected()

  const dateE = createElement("input", undefined, {
    type: "date",
    required: true,
    className: connected ? "" : "hide",
  })
  dateE.value = dateToISOString(today)

  const selectE = createElement("select", undefined)
  const options = models
    .filter((m) => connected || m.category === "Achat")
    .map((model) => ({
      value: model.nom,
      innerText: `${model.nom} (${model.coins > 0 ? `+${model.coins} ` : model.coins})`,
    }))
  fillSelectOptions(selectE, options)
  const buttonE = createElement("button", "Valider")

  buttonE.addEventListener("click", async () => {
    const moymoyMissionsJSON: RawMission[] = getData<RawMission[]>("MoymoyMissions", false)

    const selectedModel = models.find((m) => m.nom === selectE.value)
    if (!selectedModel) {
      toastNotification("Erreur: model non trouvé", 3000, true)
      return
    }
    if (!dateE.value) {
      toastNotification("Erreur: date inconnue", 3000, true)
      return
    }
    if (getMissionsCoins(moymoyMissionsJSON) + selectedModel.coins < 0) {
      toastNotification("Erreur: pièces manquantes", 3000, true)
      return
    }
    const newMission: RawMission = {
      id: Math.max(...moymoyMissionsJSON.map((m) => m.id)) + 1,
      date: dateE.value,
      model: selectedModel,
      completed: selectedModel.category !== "Gain",
    }

    setCookie("MoymoyMissionsJSON", newMission)
    const res = await callPHP({ action: "saveFile", name: "MoymoyMissions", toDelete: "0" })
    if (!res) {
      toastNotification("Erreur : la sauvegarde a échouée")
      throw new Error("callPHP return false")
    }
    toastNotification("Évènement ajouté")
    displayMissions()
    dialog.close()
  })

  dialog.append("Nouvel évènement:")
  dialog.append(createElement("div", [dateE, selectE, buttonE]))

  dialog.append(closeButton(dialog))
  dialog.showModal()
})
