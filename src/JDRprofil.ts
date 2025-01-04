import { cardJSON, persosJSON, enemyJSON, mapsJSON, playerJSON, classes, iconsClasses } from "./JDRstore.js"
import { Joueurs, Perso, Player } from "./model.js"
import {
  addClickListener,
  callPHP,
  createElement,
  dateToString,
  initDialog,
  inputSelector,
  newPerso,
  sameDay,
  setCookie,
  stringToDate,
  toastNotification,
} from "./utils.js"

const charactersList = document.querySelector(".charactersList")!
const persosE = [...charactersList.children]

// Table Initialisation

const cardKinds = ["map", "boss", "composant", "anecdote"]

// Map Elements

const worldmapE = document.querySelector("#worldmap")!
const continentE = document.querySelector(".continent")!
const mapMenuEs = [...document.querySelectorAll<HTMLElement>(".mapMenu")!]

//  LOADING
let indexPerso: string | undefined
// var selectedID = selectPerso.selectedIndex;

window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search)

  if (urlParams.has("joueur")) {
    // selectedID = selectPerso.selectedIndex;
    loadPlayer(urlParams.get("joueur") as Joueurs)
  } else {
    // Default page with all players information
    document.querySelector("#allCards")!.classList.add("hide")

    const playerEList = Object.entries(playerJSON).map((player) => {
      const playerNameE = createElement("h3", player[0])

      const playerData = player[1]
      const joueurDate = stringToDate(playerData.date)
      const today = stringToDate(dateToString(new Date()))

      const playerConnectedE = createElement("div", undefined, {
        className: "connectionPoint",
        style: { backgroundColor: sameDay(joueurDate, today) ? "green" : "grey" },
      })

      const playerCoinE = createElement("p", `${playerData.alpagaCoin} (${playerData.alpagaCoinSpent}) `)

      const playerCoinPicE = createElement("img", undefined, {
        src: "images/layout/alpagaCoin.png",
        className: "alpagaCoinPic",
        alt: " pièces",
      })

      playerCoinE.append(playerCoinPicE)

      const playerCardsE = createElement("p", `Nombre de cartes : ${playerData.cards.length}`, {
        style: { fontSize: "13.5px" },
      })

      const playerCards = playerData.cards.map((pC) => cardJSON.find((c) => c.id === pC)).filter((p) => !!p)
      // console.log(playerCards);

      const pBossP = Math.floor(
        // Ignore hidden bosses
        (100 * playerCards?.filter((p) => p.kind === "boss" && !p.hidden).length) /
          cardJSON.filter((p) => p.kind === "boss" && !p.hidden).length
      )
      const pMapsP = Math.floor(
        (100 * playerCards?.filter((p) => p.kind === "map").length) / cardJSON.filter((p) => p.kind === "map").length
      )
      const pAnecdoteP = Math.floor(
        (100 * playerCards?.filter((p) => p.kind === "anecdote").length) /
          cardJSON.filter((p) => p.kind === "anecdote").length
      )
      const pTotalP = Math.floor((100 * playerCards?.length) / cardJSON.length)

      const playerCardsEP = createElement("p", undefined, { style: { fontSize: "13.5px" } })
      // innerHTML because <br/> tag
      playerCardsEP.innerHTML = `Boss ${pBossP}%, Anecdotes ${pAnecdoteP}%<br/>Maps ${pMapsP}%, Total ${pTotalP}%`

      const entriesToday =
        joueurDate >= today || sameDay(joueurDate, today)
          ? Math.round((playerData.entries.reduce((acc, cur) => acc + cur / 3, 0) / playerData.entries.length) * 100)
          : 100

      const playerEntriesE = createElement("p", `Entrées restantes : ${entriesToday}%`, {
        style: { fontSize: "13px" },
      })

      return createElement(
        "div",
        [playerConnectedE, playerNameE, playerCoinE, playerCardsE, playerCardsEP, playerEntriesE],
        {
          onClick: () => {
            window.location.href = `jdr_profil.html?joueur=${player[0]}`
          },
        }
      )
    })

    const playersE = createElement("div", playerEList, { id: "playersE", className: "flexContainer charactersList" })
    document.querySelector("body")!.append(playersE)

    // // Display all persos stats in combat
    // Object.values(persosJSON).forEach((p) => {
    //   const persoP = newPerso(p, false)
    //   if (persoP.degat) console.log("Perso :", persoP)
    // })

    // Display all persos by classes (if perso really exist)
    const activeP = Object.values(persosJSON).filter((p) => p.eqpts.filter((e) => !!e).length >= 4)
    const inactiveP = Object.values(persosJSON).filter((p) => !activeP.includes(p))

    ;[false, true].forEach((isArchived) => {
      const persosByClasses = classes.map((c) => {
        const persos = (isArchived ? inactiveP : activeP).filter((p) => p.classeP === c || p.classeS === c)
        return { className: c, persos }
      })
      console.log(`Classes des persos ${isArchived ? "inactif (<4 eqpts)" : "actifs (>= 4 eqpts)"}`, persosByClasses)
    })

    console.log("Persos actifs :", activeP, "Persos inactifs :", inactiveP)

    // Display nb anecdote by map
    const anecdoteByMap = Object.entries(mapsJSON)
      .map((m) => [
        m[0],
        m[1].name,
        cardJSON.filter((c) => c.kind === "anecdote" && c.maps?.includes(parseInt(m[0]))).length,
      ])
      .filter((m) => !!m[2]) // Only display maps with anecdotes
    console.log("Anecdotes par map (ID,nom,nb)", anecdoteByMap)

    // Display nb anecdotes by map
    const enemiesOnMap: [string, [string, number][]][] = Object.values(mapsJSON)
      .filter((map) => map.mobs !== undefined)
      .map((map) => [map.name, map.mobs!.map((e) => [enemyJSON[e.toString()].nom, enemyJSON[e.toString()].pvmax])])

    console.log("Ennemis par map", enemiesOnMap)

    const bossByMap = enemiesOnMap.map(([map, mobs]) => [map, mobs?.filter((e) => e[1] >= 200).length])
    console.log("Nb boss par map", bossByMap)

    console.log(
      "Formule pour calculer le nb d'anecdotes d'un joueur sur une map :",
      "playerJSON['Victorine'].cards.map(c => cardJSON.find(cj => cj.id==c)).filter(cf => cf.kind == 'anecdote' && cf.maps.includes(XXX))"
    )
  }
})

function loadPlayer(player: Joueurs): void {
  charactersList.id = player
  ;[...document.querySelectorAll("fieldset")].map(
    (fieldSetE) => (fieldSetE.className = playerJSON[player] ? "" : "hide")
  )

  if (!playerJSON[player]) return

  const joueurData = updateDay(playerJSON[player], player)

  console.log(joueurData)

  // Display 100% image
  const playerCards = joueurData.cards.map((pC) => cardJSON.find((c) => c.id === pC)).filter((p) => !!p)

  const pBossP = Math.round(
    (100 * playerCards.filter((p) => p.kind === "boss").length) / cardJSON.filter((p) => p.kind === "boss").length
  )
  const pComposP = Math.round(
    (100 * playerCards.filter((p) => p.kind === "composant").length) /
      cardJSON.filter((p) => p.kind === "composant").length
  )
  const pAnecdoteP = Math.round(
    (100 * playerCards.filter((p) => p.kind === "anecdote").length) /
      cardJSON.filter((p) => p.kind === "anecdote").length
  )

  const allDone = pBossP === 100 && pComposP === 100 && pAnecdoteP === 100
  document.querySelector("#image100")!.closest("label")!.style.display = allDone ? "block" : "none"
  document.querySelector<HTMLElement>("#image10k")!.style.display = joueurData.alpagaCoin >= 10000 ? "block" : "none"

  const alpagaCoinE = document.querySelector<HTMLParagraphElement>(".alpagaCoin")!
  alpagaCoinE.innerText = `${joueurData.alpagaCoin}`
  const alpagaCoinSpentE = document.querySelector<HTMLParagraphElement>(".alpagaCoinSpent")!
  alpagaCoinSpentE.innerText = ` (${joueurData.alpagaCoinSpent})`

  document.querySelector(".alpagaCoinPic")!.addEventListener("click", () => generateChest(joueurData))

  const persosData = joueurData.persos.map((idPerso) => {
    return persosJSON[idPerso - 1] // Error, index -1
  })

  if (!persosData) return

  persosE.forEach((e) => e.classList.add("hide"))

  persosData.forEach((perso, index) => {
    loadPerso(perso, index, joueurData)
  })

  loadCards(joueurData)
  countCards(joueurData)

  applyFilter()
  applyCheckbox()

  toastNotification(`Chargement réussi de ${player}`)
}

function updateDay(joueurData: Player, indexPlayer: Joueurs): Player {
  const joueurDate = stringToDate(joueurData.date)
  const today = stringToDate(dateToString(new Date()))

  // Bug Fix 29/11/23, different UTC (local time) can generate date in future
  // In this case, UTC+X can go on page, and put date to Day+1, and UTC+0 can go back and put date to Day
  // This switch always trigger the updateDay. Thank you Hugo and Rachel !
  // Bug Fix 14/05/24 : Check date by string, and locale string format make error ! Thank you again Rachel !
  if (sameDay(joueurDate, today)) return joueurData

  joueurData.date = dateToString(today)
  joueurData.entries = joueurData.entries.map(() => 3)

  // Exception Hugo qui n'a qu'un/deux personnage(s) (26/11/23)
  if (joueurData.entries.length === 1) joueurData.entries = joueurData.entries.map(() => 6)
  if (joueurData.entries.length === 2) joueurData.entries = joueurData.entries.map(() => 4)

  joueurData.alpagaCoin += 5

  const newPlayer: { [key: string]: Player } = {}
  newPlayer[indexPlayer] = joueurData
  // console.log(joueurData);

  setCookie("playerJSON", newPlayer)
  callPHP({ action: "saveFile", name: "player" })

  toastNotification("Cadeau de Connexion Quotidienne : 5 Pièces Alpaga !", 6000)

  return joueurData
}

function loadPerso(perso: Perso, index: number, joueurData: Player): void {
  // console.log(perso, index);
  const persoE = persosE[index]

  // Entrées du perso
  persoE.querySelector<HTMLParagraphElement>(".entries")!.innerText = `${joueurData.entries[index]}/3 `

  persoE.querySelector<HTMLInputElement>("#nom")!.value = perso.nom

  const persoCombat = newPerso(perso, false)
  inputSelector("#degat", "number", persoE).value = persoCombat.degat
  inputSelector("#armure", "number", persoE).value = persoCombat.armure

  const persoWith10kPic = ["Malvis"]
  persoE.querySelector<HTMLImageElement>(".persoPic")!.src =
    joueurData.alpagaCoin >= 10000 && persoWith10kPic.includes(perso.nom)
      ? perso.pp.replaceAll(".jpg", "_10k.jpg")
      : perso.pp

  persoE.addEventListener("click", () => {
    if (joueurData.entries[index] <= 0) {
      toastNotification("Erreur : Le personnage ne peut plus aller combattre, revenez demain !", 4000, true)
    } else {
      worldmapE.classList.remove("hide")
      continentE.classList.add("active")
      mapMenuEs[1].classList.add("activate")
      indexPerso = Object.entries(persosJSON).find((p) => p[1] === perso)?.[0]
    }
  })

  // Classes du perso
  const classePID = classes.indexOf(perso.classeP)
  const classeSID = classes.indexOf(perso.classeS)

  const iconClassesEs = persoE.querySelector<HTMLElement & { children: [HTMLImageElement, HTMLImageElement] }>(
    ".iconClasses"
  )!
  iconClassesEs.children[0].src = `http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE${iconsClasses[classePID]}.png`
  iconClassesEs.children[1].src = `http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE${iconsClasses[classeSID]}.png`

  persoE.classList.remove("hide")
}

// Update worldmap displayed (add 2 continents 23/12/2023)
mapMenuEs.forEach((mapMenuE) => {
  addClickListener(mapMenuE, (e) => {
    // On new click, remove all activated menu
    mapMenuEs.forEach((mapE) => mapE.classList.remove("activate"))
    e.target.classList.add("activate")

    // Detect which continent is displayed
    ;[...document.querySelectorAll<HTMLElement>(".continent")].forEach((eContinent) => {
      if (eContinent.dataset.worldmap === e.target.dataset.worldmap) {
        eContinent.classList.add("active")
      } else {
        eContinent.classList.remove("active")
      }
    })
  })
})

document.addEventListener("click", (e) => {
  const targetE = e.target as HTMLElement
  if (indexPerso && (targetE.dataset.map || (targetE.parentElement && targetE.parentElement.dataset.map))) {
    const map = targetE.dataset.map || targetE.parentElement?.dataset.map
    window.location.href = `jdr_quest.html?perso=${parseInt(indexPerso) + 1}&map=${map}`
    return
  }
  if (
    !targetE.dataset.map &&
    targetE.className !== "worldmap-img" &&
    targetE.className !== "persoPic" &&
    !targetE.className.includes("mapMenu")
  ) {
    ;[...document.querySelectorAll(".continent")].forEach((eContinent) => {
      if ([...eContinent.classList].includes("active")) eContinent.classList.remove("active")
    })
    worldmapE.classList.add("hide")
    mapMenuEs.forEach((mapE) => mapE.classList.remove("activate"))
  }
})

function loadCards(joueurData: Player): void {
  // Reset
  cardKinds.forEach((kind) => {
    if (kind === "anecdote") {
      ;[...document.querySelector(`#${kind}`)!.querySelectorAll("div")].forEach((e) => (e.innerText = ""))
    } else document.querySelector<HTMLParagraphElement>(`#${kind}`)!.innerText = ""
  })

  const rarityClass = ["common", "rare", "epic"]

  cardJSON.forEach((card) => {
    const nameCardE = createElement("h4", card.name)
    const descCardE = createElement("p", card.description)

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
        return
    }
    const imgCardE = createElement("img", undefined, { src: imgSrc })

    const cardE = createElement("div", undefined, { className: `card ${rarityClass[card.value - 1]}` })

    cardE.appendChild(imgCardE)
    if (joueurData.cards.includes(card.id)) {
      cardE.appendChild(nameCardE)
      cardE.appendChild(descCardE)
    } // Card to hide if not obtained
    else if (card.hidden) return

    if (card.kind === "anecdote") {
      document.querySelector(`#g${card.group}`)?.append(cardE)
    } else {
      document.querySelector(`#${card.kind}`)?.append(cardE)
    }
  })
}

function countCards(joueurData: Player): void {
  cardKinds.forEach((kind) => {
    const countJoueurCardsByKind = joueurData.cards
      // Remove hidden
      .map((cardId) => cardJSON.filter((c) => c.id === cardId && c.kind === kind && !c.hidden).length)
      .reduce((partialSum, a) => partialSum + a, 0)

    const countHiddenCards = joueurData.cards
      // Remove hidden
      .map((cardId) => cardJSON.filter((c) => c.id === cardId && c.kind === kind && c.hidden).length)
      .reduce((partialSum, a) => partialSum + a, 0)

    // Remove hidden
    const countCardsByKind = cardJSON.filter((c) => c.kind === kind && !c.hidden).length

    document.querySelector<HTMLParagraphElement>(`#${kind}Count`)!.innerText =
      `(${countJoueurCardsByKind}/${countCardsByKind})${countHiddenCards ? ` (+${countHiddenCards})` : ""}`
  })
}

// Hide/Show cards by categories :

cardKinds.forEach((kind) => {
  const label = document.querySelector<HTMLParagraphElement>(`label[for="${kind}"]`)!
  const element = document.getElementById(kind)!
  label.addEventListener("click", () => {
    const willBeHidden = !element.classList.contains("hide")
    element.classList.toggle("hide")
    label.innerText = label.innerText.slice(0, -1) + (willBeHidden ? "▲" : "▼")
  })
})

// Filters cards :
const radioButtons = [...document.querySelectorAll<HTMLInputElement>("input[type='radio']")!]
radioButtons.forEach((radioButton) => radioButton.addEventListener("change", applyFilter))

function applyFilter(): void {
  const allCardsE = [...document.querySelectorAll(".card")]
  const filter = radioButtons.find((r) => r.checked)?.value
  if (filter === "all") {
    allCardsE.forEach((cardE) => cardE.classList.remove("hide"))
  } else {
    allCardsE.forEach((cardE) => {
      const isAcquired = cardE.children.length > 1
      if ((filter === "acquired" && isAcquired) || (filter === "not-acquired" && !isAcquired)) {
        cardE.classList.remove("hide")
      } else {
        cardE.classList.add("hide")
      }
    })
  }
}

// Filters anecdotes group cards
const checkboxes = [...document.querySelectorAll<HTMLInputElement>("input[type='checkbox']")]
checkboxes.forEach((checkbox) => checkbox.addEventListener("change", applyCheckbox))

function applyCheckbox(): void {
  checkboxes.forEach((cb) => {
    const groupeE = document.querySelector(`#${cb.value}`)!
    if (cb.checked) groupeE.classList.remove("hide")
    else groupeE.classList.add("hide")
  })
}

// Modal (Dialog) des informations de bases des labels

const labelsDescription = {
  alpagaCoin:
    "Les pièces d'Alpaga peuvent être échangées contre de l'expérience ou de l'or.<br/>1 XP (1 perso) = 4 à 10+ Pièces Alpaga<br/>1 Or (1 perso) = 2 à 4+ Pièces Alpaga.<br/> > Ce taux varie selon le nombre de persos, leur niveau, leur sort (soin/armure).<br/><br/>Attention : Pour échanger les pièces, il faut que la situation soit cohérente (roleplay), exemple : une interlude, le personnage a quitté le groupe pendant un moment, etc... Et même dans ces conditions, la quantité d'XP/Or donné est limité (ex : on ne peut pas obtenir 3 niveaux d'un coup), voici des exemples :<br/>- Sans aucun délai, les limites sont de 20 XP et 30 pièces (l'un ou l'autre, sinon moins).<br/>- Selon les séances loupées : 10 + 30 * (nombre de séances) en XP / pièces. Maximum : 200 / 300 (idem nouveau perso).",
  // map: "Les cartes de maps & donjons peuvent être obtenues sur leurs zones spécifiques. Elles donnent des informations sur la zone en question.",
  // boss: "Les cartes de Boss peuvent être obtenues n'importe où mais que sur des ennemis de niveau Boss (>= 200 PV). Elles donnent quelques informations sur eux et représentent une belle collection à avoir.",
  // composant:
  //   "Les cartes composants peuvent être obtenues n'importe où. Elles représentent un composant de mine, de ferme ou d'invocation (créatures).",
  // anecdote:
  //   "Les cartes anecdotes peuvent être obtenues dans des endroits et face à des ennemis étant en lien avec l'anecdote. Elles font références à des moments cultes vécus pendant le JDR !",
  image100: "100% des boss, composants et anecdotes ont été obtenus ! Félicitations !",
}

initDialog(labelsDescription)

// Alpaga coins places
interface Vertice {
  top: number
  left: number
}
type ChestVertices = [Vertice, Vertice, Vertice, Vertice]

// Fonction pour déterminer si un point (x, y) est dans le losange
const isCoinInChest = (x: number, y: number, vertices: ChestVertices): boolean => {
  const [A, B, C, D] = vertices

  // Aire du losange total
  const totalArea = triangleArea(A, B, C) + triangleArea(A, C, D)

  // Aire des sous-triangles formés avec le point (x, y)
  const area1 = triangleArea({ top: y, left: x }, A, B)
  const area2 = triangleArea({ top: y, left: x }, B, C)
  const area3 = triangleArea({ top: y, left: x }, C, D)
  const area4 = triangleArea({ top: y, left: x }, D, A)

  // Si la somme des aires des sous-triangles est égale à l'aire totale, le point est dans le losange
  return Math.abs(totalArea - (area1 + area2 + area3 + area4)) < 0.01
}

// Fonction pour calculer l'aire d'un triangle donné par 3 points
const triangleArea = (p1: Vertice, p2: Vertice, p3: Vertice): number => {
  return Math.abs((p1.left * (p2.top - p3.top) + p2.left * (p3.top - p1.top) + p3.left * (p1.top - p2.top)) / 2)
}

// Générer un point aléatoire dans le losange
const generateRandomCoinInChest = (vertices: ChestVertices): Vertice => {
  let x, y

  do {
    // Générer des coordonnées aléatoires dans une boîte englobante
    const minLeft = Math.min(...vertices.map((v) => v.left))
    const maxLeft = Math.max(...vertices.map((v) => v.left))
    const minTop = Math.min(...vertices.map((v) => v.top))
    const maxTop = Math.max(...vertices.map((v) => v.top))

    x = Math.random() * (maxLeft - minLeft) + minLeft
    y = Math.random() * (maxTop - minTop) + minTop
  } while (!isCoinInChest(x, y, vertices))

  return { top: y, left: x }
}

const generateChest = (joueurData: Player): void => {
  const dialog = document.querySelector<HTMLDialogElement>("dialog")!

  dialog.innerHTML = ""

  const saturation = Math.min(0.5 + 0.75 * (joueurData.alpagaCoin ** 0.5 / 100), 1.15)
  const chestE = createElement("img", undefined, {
    src: "images/layout/chest.png",
    className: "chest",
    style: { filter: `saturate(${saturation})` },
  })
  const chestZIndexE = createElement("img", undefined, {
    src: "images/layout/chestZIndex.png",
    className: "chest",
    style: { zIndex: "10", filter: `saturate(${saturation})`, pointerEvents: "none" },
  })

  // Les coordonnées des sommets du losange
  const chestVertices: ChestVertices = [
    { top: 60, left: 22 }, // Left
    { top: 78, left: 45 }, // Bottom
    { top: 53, left: 92 }, // Right
    { top: 35, left: 70 }, // Top
  ]

  type CoinType = "Diamond" | "Gold" | "Silver" | ""

  const alpagaCoinPics = (quantity: number, type: CoinType): HTMLImageElement[] =>
    Array.from({ length: quantity }).map(() => {
      const { top, left } = generateRandomCoinInChest(chestVertices)
      return createElement("img", undefined, {
        src: `images/layout/alpagaCoin${type}.png`,
        className: "alpagaCoinPic",
        style: {
          zIndex: type === "Diamond" ? "5" : type === "Gold" ? "2" : type === "Silver" ? "1" : "0",
          position: "absolute",
          top: `${top}%`,
          left: `${left}%`,
          filter: type === "Diamond" ? "drop-shadow(0px 0px 8px blue)" : "",
          borderRadius: type === "Diamond" ? "1rem 0" : "",
          boxShadow: type === "Diamond" ? "blue 1px 1px 10px" : "",
        },
      })
    })

  const diamondAlpaga = Math.trunc(joueurData.alpagaCoin / 10000)
  const goldenAlpaga = Math.trunc((joueurData.alpagaCoin - diamondAlpaga * 10000) / 150)
  const silverAlpaga = Math.trunc((joueurData.alpagaCoin - diamondAlpaga * 10000 - goldenAlpaga * 100) / 14.5)
  const bronzeAlpaga = joueurData.alpagaCoin - diamondAlpaga * 10000 - goldenAlpaga * 100 - silverAlpaga * 10

  const coins: { type: CoinType; value: number }[] = [
    { type: "Diamond", value: diamondAlpaga },
    { type: "Gold", value: goldenAlpaga },
    { type: "Silver", value: silverAlpaga },
    { type: "", value: bronzeAlpaga },
  ]

  const alpagaCounterE = createElement(
    "ul",
    coins.map((coin) => {
      const imageE = createElement("img", "undefined", {
        src: `images/layout/alpagaCoin${coin.type}.png`,
        className: "alpagaCoinPic",
      })
      return createElement("li", [imageE, `: ${coin.value}`])
    }),
    { className: "alpagaCounter" }
  )

  const alpagaCoinEs = [
    ...alpagaCoinPics(diamondAlpaga, "Diamond"),
    ...alpagaCoinPics(goldenAlpaga, "Gold"),
    ...alpagaCoinPics(silverAlpaga, "Silver"),
    ...alpagaCoinPics(bronzeAlpaga, ""),
  ]
  const chestWrapperE = createElement("div", [chestE, chestZIndexE, ...alpagaCoinEs], {
    className: "chestWrapper",
  })

  dialog.append(chestWrapperE, alpagaCounterE)

  // Bouton de fermeture
  dialog.append(
    createElement("button", "Fermer", {
      id: "close",
      onClick: () => {
        dialog.close()
      },
      style: { position: "absolute", left: "85vw", bottom: "11%" },
    })
  )
  dialog.showModal()
}
