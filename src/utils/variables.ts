// #region String utils

export const capitalize = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1)

export const splitParenthesisText = (text: string): [string, string, string] | null => {
  const result = text.match(/(.*)\((.*?)\)(.*)/)
  // result[0] is the whole string, then we have before, inside and after
  return result ? [result[1], result[2], result[3]] : null
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
  // getRandomBetween(0, array.length - 1)
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export const sum = (a: number, b: number): number => a + b

export const countEachOccurences = (list: string[]): { [key: string]: number } =>
  list.reduce(
    (acc, curr) => {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
    },
    {} as { [key: string]: number }
  )

// #region Date utils

export const sameDay = (first: Date, second: Date): boolean =>
  first.getUTCFullYear() === second.getUTCFullYear() &&
  first.getUTCMonth() === second.getUTCMonth() &&
  first.getUTCDate() === second.getUTCDate()

export const dateToString = (date: Date, full: boolean = false): string => {
  const stringDate = date.toLocaleString("fr-FR")
  return full ? stringDate : stringDate.split(" ")[0]
}

export const stringToDate = (stringDate: string): Date => {
  const splitDate = stringDate.split("/")
  // console.log(splitDate, new Date(splitDate[2], parseInt(splitDate[1]) - 1, splitDate[0]));

  // Date(year,month-1,day,hours) : hours = 2 to Handle conversion locale string FR
  return new Date(parseInt(splitDate[2]), parseInt(splitDate[1]) - 1, parseInt(splitDate[0]), 2)
}
