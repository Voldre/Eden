// JSON Initialisation
var xhReq = new XMLHttpRequest();

export var cardJSON = [];
export var persosJSON = {};
export var eqptJSON = {};
export var pnjJSON = {};
export var enemyJSON = {};
export var mapsJSON = {};
export var allSkills = [];
export var playerJSON = [];
export var galeryJSON = [];
export var skillsJSON = [];
export var skillsAwakenJSON = [];
export var masterJSON = [];
export var logsJSON = [];

console.log(window.location.href);
if (window.location.href.includes("http")) {
  xhReq.open("GET", "./JDRskills.json" + "?" + new Date().getTime(), false);
  xhReq.send(null);

  cardJSON = getData("card");
  eqptJSON = getData("eqpt");
  pnjJSON = getData("pnj");

  enemyJSON = getData("enemy");
  persosJSON = getData("persos");

  mapsJSON = getData("maps", false);

  allSkills = getData("combatS");
  playerJSON = getData("player");
  galeryJSON = getData("galery");

  skillsJSON = getData("skills");
  skillsAwakenJSON = getData("skillsAwaken");

  masterJSON = getData("master");

  logsJSON = getData("combatLogs");
}

function getData(filename, JDR = true) {
  if (JDR) {
    xhReq.open("GET", "./JDR" + filename + ".json" + "?" + new Date().getTime(), false);
  } else {
    xhReq.open("GET", "./" + filename + ".json" + "?" + new Date().getTime(), false);
  }
  xhReq.send(null);
  return JSON.parse(xhReq.responseText);
}
