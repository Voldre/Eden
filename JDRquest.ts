import { playerJSON, mapsJSON, pnjJSON, persosJSON, enemyJSON } from "./JDRstore.js"
import { Enemy, Joueurs, Map, Perso, Player, PNJ } from "./model.js"
import { createElement, isTextInText, setCookie, toastNotification } from "./utils.js"

const apiUrl = "https://api.openai.com/v1/chat/completions"

const responseElement = document.querySelector<HTMLParagraphElement>("#response")!

let rarity = 0
let pnjEnemy: Enemy | undefined
let indexPlayer: Joueurs | undefined
let mapId: string | undefined
let indexPerso: string | undefined

// Main Elements

const gameE = document.querySelector<HTMLElement>(".game")!

// Load perso if URL parameter
window.addEventListener("load", async () => {
  const urlParams = new URLSearchParams(window.location.search)
  if (!urlParams.has("perso")) {
    responseElement.innerText =
      "Erreur : vous devez saisir dans l'URL un numéro de personnage (jdr_quest?perso=4) par exemple."
    stop()
    document.querySelector(".loading")!.remove()
    return
  }

  indexPerso = urlParams.get("perso") ?? undefined
  ;(Object.entries(playerJSON) as [Joueurs, Player][]).forEach(([index, player]) => {
    if (indexPerso && player.persos.includes(parseInt(indexPerso))) {
      indexPlayer = index
    }
  })
  const joueurData = indexPlayer && playerJSON[indexPlayer]
  console.log(joueurData, indexPerso)

  if (!joueurData || !indexPerso || joueurData.entries[joueurData.persos.indexOf(parseInt(indexPerso))] <= 0) {
    responseElement.innerText = "Erreur : Le personnage a déjà fait ses 3 entrées, veuillez en choisir un autre !"
    console.log("Erreur : Le personnage a déjà fait ses 3 entrées, veuillez en choisir un autre !")
    stop()
    document.querySelector(".loading")!.remove()
    return
  }

  const persoData = persosJSON[(parseInt(indexPerso) - 1).toString()]

  mapId = urlParams.get("map") ?? undefined
  const enemyData = chooseEnemy()

  if (!enemyData) {
    toastNotification("Erreur : aucun ennemi n'existe sur cette map", 6000, true)
    return
  }
  initializeEnemy(enemyData)

  const randomPNJ = Math.floor(Math.random() * Object.entries(pnjJSON).length + 1)
  console.log("randomPNJ :", randomPNJ)
  const pnjData = pnjJSON[randomPNJ]

  pnjEnemy = Object.values(enemyJSON).find((e) => isTextInText(e.visuel3D, pnjData.id))

  // 10 pour le moment en desc
  mapId = urlParams.get("map") || Math.round(Math.random() * 7 + 3).toString()
  const mapData = mapsJSON[mapId]

  gameE.style.backgroundImage = `url('./images/loadingframe/Loading_${mapId}B.jpg')`

  document.querySelector<HTMLParagraphElement>("#mapName")!.innerText = mapData.name

  initializeActions(enemyData)

  document.querySelector<HTMLImageElement>("#pnj")!.src = `./images/PNJ/${pnjData.id}.png`
  document.querySelector<HTMLParagraphElement>("#persoName")!.innerText = persoData.nom
  document.querySelector<HTMLImageElement>("#perso")!.src = persoData.pp.replace("http://voldre.free.fr/Eden", ".")

  // CHAT GPT PROMPT

  const instruction = `Consignes à respecter : Tu dois parler pour demander de l'aide à ${persoData.nom}. 
  Ton discours contient 120 mots (soit 6 phrases) avec des paragraphes et saute des lignes à chaque phrase. 
  Enfin : ${pnjData.lang}`

  const message = writeMessage(persoData, pnjData, mapData, enemyData)
  const apiKey = await getChatGPTKey()

  // Update 20/03/24 : Trigger Chat GPT request only on click
  document.querySelector("#fetch_gpt")!.addEventListener("click", () => {
    responseElement.innerText = "Chargement..."
    gameE.classList.add("loading")
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: instruction },
          { role: "user", content: message },
        ],
        // eslint-disable-next-line camelcase
        max_tokens: 350,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.error) {
          throw new Error(`ChatGPT code : ${data.error.code}`)
          // responseElement.innerHTML = "Erreur ChatGPT. Motif : " + data.error.code;
        }
        const response = data.choices[0].message.content
        responseElement.innerHTML = response.replaceAll("\n", "<br/>")
        gameE.classList.remove("loading")
      })
      .catch((error) => {
        responseElement.innerText = `Erreur lors de la requête à l'API. ${error.toString()}`
        console.error("Erreur lors de la requête à l'API. ", error)
        gameE.classList.remove("loading")
      })
  })
})

async function getChatGPTKey(): Promise<string | undefined> {
  try {
    const result = await fetch("jdr_backend.php", {
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      method: "POST",
      body: new URLSearchParams({ action: "chatGpt" }),
    })
    return result.text()
  } catch (error) {
    console.log(error)
    responseElement.innerHTML = `Echec de la récupération de la clé de l'API ChatGPT :${JSON.stringify(error)}`
    gameE.classList.remove("loading")
  }
  return undefined
}

function writeMessage(persoData: Perso, pnjData: PNJ, mapData: Map, enemyData: Enemy): string {
  const pnjDesc = `Ton personnage est ${pnjData.nom}. Tu es : ${pnjData.desc}`
  const mapDesc = `Tu vies au (à la) ${mapData.name}${mapData.desc ? `, description : ${mapData.desc}` : ""}`
  const enemyDesc = `Là où tu vies, vous avez des problèmes avec : ${enemyData.nom}, cette personne est : ${enemyData.desc}`
  const persoDesc = `La personne a qui tu parles, et à qui tu vas demander de l'aide s'appelle ${persoData.nom}, 
  voici sa personnalité : ${persoData.personnalite}`
  // ". Et voici son histoire : " +persoData["background"];

  return `Tu incarnes un personnage dans l'univers de Eden Eternal.  ${pnjDesc}.\n ${mapDesc}.\n ${enemyDesc}.\n ${persoDesc}.\n`
}

function chooseEnemy(category: "boss" | "mob" | undefined = undefined): Enemy | undefined {
  // prettier-ignore
  const forbidden = ["82","101","104","109"];

  let enemyListId = Object.keys(enemyJSON).filter((eID) => !forbidden.includes(eID))

  // prettier-ignore
  const boss = ["24","29","45","46","50","54","56","57","59","61","62","67","70","71","74","75","76","77","80","82","84","85","86","89","90","101","106","109","111","113","114","118","119"];

  if (category === "boss") {
    enemyListId = enemyListId.filter((eID) => boss.includes(eID))
  } else if (category === "mob") {
    enemyListId = enemyListId.filter((eID) => !boss.includes(eID))
  }

  if (mapId) {
    if (!mapsJSON[mapId].mobs) {
      responseElement.innerText = "Erreur : Aucun n'ennemi n'existe pour le moment sur cette carte, désolé !"
      return undefined
    }
    enemyListId = enemyListId.filter((eID) => mapsJSON[mapId!].mobs?.includes(parseInt(eID)))

    // If map choosed for fight, filter by rarity !
    rarity = Math.floor(Math.random() * 3) + 1

    if (rarity <= 2) {
      // Handle ennemy rarity 1 & 2 (Common & Rare)
      enemyListId = enemyListId.filter((eID) => enemyJSON[eID].pvmax < 200)
    } else if (enemyListId.filter((eID) => enemyJSON[eID].pvmax >= 200).length === 0) {
      rarity = 2
    } else {
      enemyListId = enemyListId.filter((eID) => enemyJSON[eID].pvmax >= 200)
    }
  }

  const randomId = Math.floor(Math.random() * enemyListId.length)
  const enemyData = enemyJSON[enemyListId[randomId]]
  return enemyData
}

function initializeEnemy(enemyData: Enemy): void {
  if (!enemyData) return
  const rarityE = document.querySelector<HTMLImageElement>("#rarity")!
  if (rarity === 1) {
    rarityE.src = "images/layout/combat_mob.png"
    rarityE.alt = "Monstre Commun"
  }
  if (rarity === 2 || (enemyData.pvmax > 120 && enemyData.pvmax < 200)) {
    rarityE.src = "images/layout/combat_elite.png"
    rarityE.alt = "Elite"
  }
  if (rarity === 3) {
    rarityE.src = "images/layout/combat_boss.png"
    rarityE.alt = "Boss"
  }

  const enemyE = document.querySelector<HTMLImageElement>("#enemy")!
  enemyE.src = `./images/monsters/${enemyData.visuel3D}.png`
  enemyE.alt = enemyData.visuel3D
  enemyE.title = enemyData.nom
}

function initializeActions(enemyData: Enemy): void {
  const actionsE = document.querySelector("#actions")!
  actionsE.innerHTML = ""

  // Upgrade enemy to Elite if the rarity selected randomly is "2" and the enemy is "common"
  const isElite = rarity === 2 && enemyData.pvmax <= 120

  const actions = pnjEnemy
    ? ["Accepter la Quête", "Refuser la Quête", "Refuser et combattre"]
    : ["Accepter la Quête", "Refuser la Quête"]

  Object.entries(actions).forEach(([i, action]) => {
    const id = parseInt(i)
    let enemy
    let actionURL = ""
    if (id === 0) {
      enemy = enemyData.nom
      actionURL = `jdr_combat.html?perso=${indexPerso}&enemy=${enemy}&map=${mapId}${isElite ? "&isElite" : ""}`
    } else if (id === 1) {
      actionURL = `jdr_profil.html?joueur=${indexPlayer}`
    } else if (id === 2) {
      // Change enemy
      enemy = pnjEnemy!.nom
      actionURL = `jdr_combat.html?perso=${indexPerso}&enemy=${enemy}&map=${mapId}${isElite ? "&isElite" : ""}`
    }

    const liElem = createElement("li", action, {
      onClick: () => {
        if (id !== 1) setCookie("loadJDRcombat", true)
        window.location.href = actionURL
      },
    })

    actionsE.append(liElem)
  })
}

document.querySelector(".enemy-wrapper")!.addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search)
  mapId = urlParams.get("map") ?? ""
  const enemyData = chooseEnemy()

  if (enemyData) {
    initializeEnemy(enemyData)
    initializeActions(enemyData)
  }
})
