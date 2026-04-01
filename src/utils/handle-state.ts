const saveState = <T>(state: T, key: string): void => {
  try {
    localStorage.setItem(key, JSON.stringify({ data: state, timestamp: Date.now() }))
  } catch (e) {
    console.error("Erreur sauvegarde:", e)
  }
}

export const setupAutoSave = <T>(getState: () => T | undefined, key: string): void => {
  const save = (): void => {
    saveState(getState(), key)
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      save()
    }
  })

  window.addEventListener("pagehide", save) // iOS
}

export const loadState = <T>(key: string): T | undefined => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return undefined

    const parsed = JSON.parse(raw)
    return parsed.data as T
  } catch (e) {
    console.error("Erreur chargement:", e)
    return undefined
  }
}
