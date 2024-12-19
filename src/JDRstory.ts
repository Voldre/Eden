import { persosJSON, resumeJSON } from "./JDRstore"
import { Resume } from "./model"
import { createElement, fillSelectOptions, stringToDate } from "./utils"

const urlParams = new URLSearchParams(window.location.search)
let params: { [key: string]: string | number | undefined } = {
  groupe: urlParams.get("groupe") ?? "",
  resume: urlParams.get("resume") ?? "",
}

// Ajout de surveillance (trigger notify) sur les changements de l'URL
;(function () {
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  let currentSearchParams = new URLSearchParams(window.location.search)

  const notifyChange = (): void => {
    const newSearchParams = new URLSearchParams(window.location.search)

    // Vérifier si les paramètres ont changé
    if (currentSearchParams.toString() !== newSearchParams.toString()) {
      // console.log("Les searchParams ont changé :", newSearchParams.toString())
      currentSearchParams = newSearchParams
      update()
    }
  }

  // Surveiller `pushState` et `replaceState`
  history.pushState = function (...args) {
    originalPushState.apply(this, args)
    notifyChange()
  }

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args)
    notifyChange()
  }

  // Écouter les événements pertinents
  window.addEventListener("popstate", notifyChange) // Navigation historique
  window.addEventListener("hashchange", notifyChange) // Modifications du fragment
})()

const addResume = async (resume: Resume): Promise<void> => {
  const header = createElement("h3", `Séance ${resume.seance} - Groupe ${resume.groupe} - ${resume.date}`)
  const titleE = createElement("h2", resume.titre, { style: { flexGrow: "0.75" } })
  const personnageIconsE = createElement(
    "div",
    resume.personnages.map((personnage) => {
      const perso = Object.values(persosJSON).find((persoJSON) => persoJSON.nom === personnage)
      return createElement("img", undefined, {
        src: perso?.pp,
        alt: personnage,
        className: "icone",
        title: personnage,
      })
    }),
    { style: { display: "flex", gap: "1rem", flexGrow: "0" } }
  )
  const titleWrapperE = createElement("div", [personnageIconsE, titleE], {
    className: "flex",
    style: { flexWrap: "wrap" },
  })
  const context = createElement("h5", resume.contexte)

  const resumeE = createElement("div", undefined)

  await loadHtmlIntoElement(`stories/summaries/G${resume.groupe}/${resume.seance}.html`, resumeE)

  const seanceE = createElement("div", [header, titleWrapperE, context, resumeE])
  storyE.append(seanceE)
}

export const loadHtmlIntoElement = async (url: string, container: Element): Promise<void> => {
  try {
    // Récupération du fichier HTML
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`)
    }

    // Remove first break-line after all tags
    const htmlContent = (await response.text()).replaceAll(">\n", ">")
    container.innerHTML = htmlContent
      // Replace rich text underlines and bold
      .replaceAll(/__(.*?)__/g, "<span style='text-decoration:underline;'>$1</span>")
      .replaceAll(/\*\*(.*?)\*\*/g, "<b>$1</b>")
  } catch (error) {
    console.error("Erreur lors du chargement du fichier HTML :", error)
    container.innerHTML = "Résumé non trouvé"
  }
}

const storyE = document.querySelector("#story")!

const resumeMenuE = document.querySelector<HTMLElement>("#resume-menu")!
const groupSelectE = document.querySelector<HTMLSelectElement>("#groupe-select")!
const seanceSelectE = document.querySelector<HTMLSelectElement>("#seance-select")!

const prevSeanceE = document.querySelector<HTMLButtonElement>("#prev-seance")!
const nextSeanceE = document.querySelector<HTMLButtonElement>("#next-seance")!

const prevNextEventListener = (offset: number) => () => onChangeSeance(`${parseInt(seanceSelectE.value) + offset}`)

;[prevSeanceE, nextSeanceE].forEach((element, index) =>
  element.addEventListener("click", prevNextEventListener(index === 0 ? -1 : 1))
)

const onChange = (param: string, value: string | number): void => {
  urlParams.set(param, value.toString())
  window.history.replaceState({}, "", `${window.location.pathname}?${urlParams.toString()}`)
}

const onChangeGroupe = (groupe: string): void => {
  groupSelectE.value = groupe
  onChange("groupe", groupe)
}
groupSelectE.addEventListener("change", (e) => {
  onChangeSeance("") // Remove seance when group change
  onChangeGroupe((e.target as HTMLSelectElement).value)
})

const onChangeSeance = (seance: string): void => {
  seanceSelectE.value = seance
  onChange("seance", seance)

  const seances = resumeJSON.filter((resume) => resume.groupe === params.groupe).map((resume) => resume.seance)
  prevSeanceE.disabled = !seance || parseInt(seance) === Math.min(...seances)
  nextSeanceE.disabled = !seance || parseInt(seance) === Math.max(...seances)
}
seanceSelectE.addEventListener("change", (e) => onChangeSeance((e.target as HTMLSelectElement).value))

const setResumeLinks = (group: number, container: Element): void => {
  container.innerHTML = ""

  const resumeLinkEs = resumeJSON
    .sort((a, b) => stringToDate(a.date).getTime() - stringToDate(b.date).getTime())
    .filter((resume) => resume.groupe === group)
    .map((resume) =>
      createElement(
        "li",
        createElement("a", `Séance ${resume.seance} : ${resume.titre} - ${resume.date}`, {
          onClick: () => {
            onChangeSeance(`${resume.seance}`)
          },
        })
      )
    )
  const resumeLinksE = createElement("ul", resumeLinkEs)
  container.append(resumeLinksE)
}

const update = async (): Promise<void> => {
  const storyType = (urlParams.get("type") ?? "resume") as "resume" | "lore" | "moymoy"
  const selectedGroup = parseInt(urlParams.get("groupe") ?? "")
  const seance = urlParams.get("seance")
  const selectedSeance = seance !== null ? parseInt(seance) : undefined

  // Type update
  if (params.type !== storyType) {
    storyE.innerHTML = ""

    if (storyType === "resume") resumeMenuE.classList.remove("hide")
    else resumeMenuE.classList.add("hide")
  }

  if (storyType === "lore") {
    await loadHtmlIntoElement("stories/lore.html", storyE)
  } else if (storyType === "resume") {
    // Group update
    if (params.groupe !== selectedGroup) {
      fillSelectOptions(seanceSelectE, [
        { innerText: "Séance ...", value: "" },
        ...resumeJSON
          .filter((resume) => resume.groupe === selectedGroup)
          .map((resume) => ({ innerText: `Séance ${resume.seance}`, value: resume.seance.toString() })),
      ])

      // Do not update story content if a seance exist
      if (params.seance !== undefined) {
        if (selectedGroup) {
          setResumeLinks(selectedGroup, storyE)
        } else {
          storyE.innerHTML = "<h1 style='text-align: center;'>Résumés des dernières séances...</h1>"
          // Add 3 lasts resumes
          resumeJSON
            .sort((a, b) => stringToDate(b.date).getTime() - stringToDate(a.date).getTime())
            .slice(0, 3)
            .forEach(async (resume) => {
              await addResume(resume)
              storyE.append(createElement("hr", undefined)) // Separator
            })
        }
      }
    }

    // Seance update
    if (selectedGroup && params.seance !== selectedSeance) {
      storyE.innerHTML = ""
      const selectedResume = resumeJSON.find(
        (resume) => resume.groupe === selectedGroup && resume.seance === selectedSeance
      )
      if (selectedResume) {
        await addResume(selectedResume)
        const bottomPrevSeance = prevSeanceE.cloneNode(true) as HTMLElement
        bottomPrevSeance.addEventListener("click", prevNextEventListener(-1))

        const bottomSeanceSelectE = seanceSelectE.cloneNode(true) as HTMLSelectElement
        bottomSeanceSelectE.value = `${selectedSeance}`
        bottomSeanceSelectE.addEventListener("change", (e) => onChangeSeance((e.target as HTMLSelectElement).value))

        const bottomNextSeance = nextSeanceE.cloneNode(true) as HTMLElement
        bottomNextSeance.addEventListener("click", prevNextEventListener(1))

        const bottomNavigation = createElement("div", [bottomPrevSeance, bottomSeanceSelectE, bottomNextSeance], {
          className: "navigation",
        })
        storyE.append(bottomNavigation)
      } else {
        setResumeLinks(selectedGroup, storyE)
      }
    }
  }
  // Update global params variable
  // eslint-disable-next-line require-atomic-updates
  params = { type: storyType, groupe: selectedGroup, seance: selectedSeance }
}

window.addEventListener("load", async () => {
  onChangeGroupe(urlParams.get("groupe") ?? "")
  await update()
  onChangeSeance(urlParams.get("seance") ?? "")
  await update()
})
