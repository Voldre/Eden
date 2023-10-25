// JSON Initialisation
var xhReq = new XMLHttpRequest();
var eqptJSON = {};
var enemyJSON = {};
var persosJSON = {};
var allSkills = [];

console.log(window.location.href);
if (window.location.href.includes("http")) {
  xhReq.open("GET", "./JDRskills.json" + "?" + new Date().getTime(), false);
  xhReq.send(null);

  enemyJSON = getData("enemy");

  eqptJSON = getData("eqpt");

  persosJSON = getData("persos");

  allSkills = getData("combatS");
}

function getData(filename) {
  xhReq.open("GET", "./JDR" + filename + ".json" + "?" + new Date().getTime(), false);
  xhReq.send(null);
  return JSON.parse(xhReq.responseText);
}

const charactersByPlayer = {
  Florian: [2, 8, 10, 20, 22],
  Jérémy: [3, 9, 12, 19, 21, 25],
  Victorine: [4, 5, 11, 17, 18, 23],
  Yves: [6, 7],
  Clément: [13, 14],
  Rachel: [15, 24, 26],
  Hugo: [16],
  Cyrille: [27],
};

Object.keys(charactersByPlayer).forEach((player) => {
  var option = document.createElement("option");
  option.value = player;
  document.querySelector("#selectPlayer").append(option);
});
