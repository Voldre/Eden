// JSON Initialisation
var xhReq = new XMLHttpRequest();

console.log(window.location.href);

export const cardJSON = getData("card");
export const eqptJSON = getData("eqpt");
export const pnjJSON = getData("pnj");

export const enemyJSON = getData("enemy");
export const persosJSON = getData("persos");

export const mapsJSON = getData("maps", false);

export const allSkills = getData("combatS");
export const playerJSON = getData("player");
export const galeryJSON = getData("galery");

export const skillsJSON = getData("skills");
export const skillsAwakenJSON = getData("skillsAwaken");

export const masterJSON = getData("master");
export const logsJSON = getData("combatLogs");
// export const cheatJSON = getData("combatCheat");

export const enemyGenericJSON = getData("enemyG");
export const statsJSON = getData("stats");

export function getData(filename, JDR = true) {
  if (window.location.href.includes("http")) {
    if (JDR) {
      xhReq.open("GET", "./JDR" + filename + ".json" + "?" + new Date().getTime(), false);
    } else {
      xhReq.open("GET", "./" + filename + ".json" + "?" + new Date().getTime(), false);
    }
    xhReq.send(null);
    return JSON.parse(xhReq.responseText);
  }
  return [];
}
