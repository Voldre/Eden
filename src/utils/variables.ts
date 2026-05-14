// #region String utils

export const capitalize = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1)

export const splitParenthesisText = (text: string): [string, string, string] | null => {
  const result = text.match(/(.*)\((.*?)\)(.*)/)
  if (!result) return null

  const [, before = "", inside = "", after = ""] = result
  return [before, inside, after]
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

// #region Object utils

export const getRandomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

export const getRandomItem = <T>(array: T[]): T => {
  if (!array.length) throw new Error("Cannot get a random item from an empty array")
  const randomIndex = Math.floor(Math.random() * array.length)
  const item = array[randomIndex]
  if (item === undefined) throw new Error("Random item index is out of bounds")
  return item
}

export const sum = (a: number, b: number): number => a + b

export const countEachOccurences = (list: string[]): { [key: string]: number } =>
  list.reduce(
    (acc, curr) => {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
    },
    {} as { [key: string]: number }
  )

type MappedTuple<T extends readonly unknown[], R> = {
  // eslint-disable-next-line no-unused-vars
  -readonly [K in keyof T]: R
}

export const mapTuple = <T extends readonly unknown[], R>(
  tuple: T,
  fn: (_value: T[number], _index: number) => R
): MappedTuple<T, R> => {
  return tuple.map(fn) as MappedTuple<T, R>
}

// #region Date utils

export const sameDay = (first: Date, second: Date): boolean =>
  first.getUTCFullYear() === second.getUTCFullYear() &&
  first.getUTCMonth() === second.getUTCMonth() &&
  first.getUTCDate() === second.getUTCDate()

export const daysBetween = (date1: Date, date2: Date): number => {
  const ONE_DAY = 1000 * 60 * 60 * 24
  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1.getTime() - date2.getTime())
  return Math.trunc(differenceMs / ONE_DAY)
}

export const dateToString = (date: Date, full: boolean = false): string => {
  const stringDate = date.toLocaleString("fr-FR")
  return full ? stringDate : (stringDate.split(" ")[0] ?? "Error date")
}

export const stringToDate = (stringDate: string): Date => {
  const [day, month, year] = stringDate.split("/")
  if (!day || !month || !year) throw new Error(`Invalide date format ${stringDate}`)
  // console.log(splitDate, new Date(splitDate[2], parseInt(splitDate[1]) - 1, splitDate[0]));

  // Date(year,month-1,day,hours) : hours = 2 to Handle conversion locale string FR
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 2)
}
