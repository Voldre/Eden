/* eslint-disable no-unused-vars */

type PHPAction = "jdrGalerie" | "wallpaper" | "chatGpt" | "lastId" | "saveFile" | "saveBackup" | "logout" | "logging"

type CallPHPData<A extends PHPAction> = {
  action: A
  name?: string
  value?: string
  date?: string
}

// Overloads
export async function callPHP(data: CallPHPData<"saveFile">): Promise<boolean>
export async function callPHP<A extends Exclude<PHPAction, "saveFile">>(data: CallPHPData<A>): Promise<string>

export async function callPHP<T extends PHPAction>(
  data: CallPHPData<T>
): Promise<T extends "saveFile" ? boolean : string> {
  const result = await fetch("jdr_backend.php", {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    method: "POST",
    body: new URLSearchParams(data),
  })
  console.log("jdr_backend.php executed, data : ", data)

  if (!result.ok) throw new Error(`HTTP Error ${result.status}: ${result.statusText}`)
  const value = await result.text()
  return (data.action === "saveFile" ? value === "1" : value) as T extends "saveFile" ? boolean : string
}

export const readCookie = (key: string): string | undefined => {
  const cookieString = document.cookie.split("; ").find((row) => row.startsWith(`${key}=`))
  return cookieString ? cookieString.split("=")[1] : undefined
}

export const setCookie = (name: string, value: object | boolean): number => {
  const stringValue = JSON.stringify(value).replaceAll("+", "%2B").replaceAll(";", "%3B")
  document.cookie = `${name}=${stringValue}; SameSite=Strict`

  if (name === "persosJSON") {
    console.log(`Cookie length : ${stringValue.length}/4000`)
  }
  return stringValue.length
}

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; SameSite=Strict`
}
