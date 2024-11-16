const xhReq = new XMLHttpRequest();
// console.log(window.location.href)
// JDR main data
export const persosJSON = getData("persos");
export const skillsJSON = getData("skills");
export const skillsAwakenJSON = getData("skillsAwaken");
export const eqptJSON = getData("eqpt");
export const enemyJSON = getData("enemy");
export const galeryJSON = getData("galery");
export const masterJSON = getData("master");
export const enemyGenericJSON = getData("enemyG");
export const statsJSON = getData("stats");
// JDR combat main data
// eslint-disable-next-line no-unused-vars
export const playerJSON = getData("player");
export const cardJSON = getData("card");
export const mapsJSON = getData("maps", false);
export const pnjJSON = getData("pnj");
export const combatSkillsJSON = getData("combatS");
export const logsJSON = getData("combatLogs");
export const cheatJSON = getData("combatCheat");
export function getData(filename, JDR = true) {
  try {
    if (window.location.href.includes("http")) {
      if (JDR) {
        xhReq.open("GET", `./JDR${filename}.json?${new Date().getTime()}`, false);
      } else {
        xhReq.open("GET", `./${filename}.json?${new Date().getTime()}`, false);
      }
      xhReq.send(null);
      return xhReq.responseText ? JSON.parse(xhReq.responseText) : undefined;
    }
    throw new Error("Not in HTTP location");
  } catch (e) {
    console.error(e);
    return {};
  }
}
// Enum as variables
// prettier-ignore
export const classes = ["Guerrier", "Chevalier", "Templier", "Chev Dragon", "Voleur", "Assassin", "Danselame", "Samouraï", "Chasseur", "Ingénieur", "Corsaire", "Juge", "Clerc", "Barde", "Shaman", "Sage", "Magicien", "Illusionniste", "Démoniste", "Luminary",];
// prettier-ignore
export const iconsClasses = ["01", "02", "03", "18", "04", "05", "06", "16", "07", "08", "09", "59", "10", "11", "12", "17", "13", "14", "15", "19",];
// prettier-ignore
export const iconsEveil = ["J009", "J011", "J013", "j043", "J015", "J017", "J019", "j039", "J021", "J023", "J025", "j087", "J027", "J029", "J031", "j041", "J033", "J035", "J037", "j045"];
// prettier-ignore
export const elements = ["contondant", "tranchant", "perçant", "feu", "glace", "foudre", "nature", "lumière", "ténèbres"];
