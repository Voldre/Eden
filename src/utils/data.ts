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
