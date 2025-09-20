import { callPHP } from "./data.js"

export type Log = { timestamp: string; message: string }

export const LoggerService = {
  LOG_STORAGE_KEY: "pending_logs",

  logError(message: string) {
    const d = new Date()
    const date = d.toISOString().split("T")[0]
    const time = d.toTimeString().split(" ")[0]

    const log = {
      timestamp: `${date} ${time}`,
      message,
    }

    this.sendLog(log).catch(() => {
      this.storeLogLocally(log)
    })
  },

  async sendLog(log: Log) {
    const response = await callPHP({ action: "logging", value: log.message, date: log.timestamp })

    if (response !== "1") {
      throw new Error("Erreur lors de l'envoi du log")
    }
  },

  storeLogLocally(log: Log) {
    const logs = this.getPendingLogs()
    logs.push(log)
    localStorage.setItem(this.LOG_STORAGE_KEY, JSON.stringify(logs))
  },

  getPendingLogs(): Log[] {
    const logs = localStorage.getItem(this.LOG_STORAGE_KEY)
    return logs ? JSON.parse(logs) : []
  },

  async trySendPendingLogs() {
    const pendingLogs = this.getPendingLogs()
    if (pendingLogs.length === 0) return

    for (const log of pendingLogs) {
      try {
        await this.sendLog(log)
      } catch (error) {
        console.error("Échec de l'envoi du log:", log, error)
        return // Don't remove item from storage, new attempt later
      }
    }

    localStorage.removeItem(this.LOG_STORAGE_KEY)
  },

  async init() {
    await this.trySendPendingLogs()
    window.addEventListener("online", this.trySendPendingLogs.bind(this))
  },
}

// Initialisation au démarrage de l'application
await LoggerService.init()
