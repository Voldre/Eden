// JSON Initialisation
var xhReq = new XMLHttpRequest();

console.log(window.location.href);
if (window.location.href.includes("http")) {
  xhReq.open("GET", "./JDRskills.json" + "?" + new Date().getTime(), false);
  xhReq.send(null);
  var skillsJSON = JSON.parse(xhReq.responseText);

  // xhReq.open("GET", "./JDRpersos.json", false);
  // xhReq.send(null);
  // var persosJSON = JSON.parse(xhReq.responseText);
} else {
  // eslint-disable-next-line no-redeclare
  var skillsJSON = {};
}

// prettier-ignore
const classes = [ "Guerrier", "Chevalier", "Templier", "Chev Dragon", "Voleur", "Assassin", "Danselame", "Samouraï", "Chasseur", "Ingénieur", "Corsaire", "Juge", "Clerc", "Barde", "Shaman", "Sage", "Magicien", "Illusionniste", "Démoniste", "Luminary",];
// prettier-ignore
const iconsClasses = [ "01", "02", "03", "18", "04", "05", "06", "16", "07", "08", "09", "59", "10", "11", "12", "17", "13", "14", "15", "19",];

const classesDesc = [
  "Les guerriers possèdent de solides aptitudes au combat ainsi que de lourdes armures résistantes. Peut effrayer les ennemis et motiver ses alliés.",
  "Les chevaliers incarnent le courage. Esquivant et bloquant les coups, ils attaquent sans relâche jusqu’à obtenir la victoire. Ils aiment les duels et sont très précis et rapide.",
  "Stimulés par leur noble croyance, les templiers invoquent le pouvoir divin pour punir le mal. Tout comme les clercs, ce sont des fervants de l'église et agisse pour elle.<br/><b>Contrainte : Apprentissage lié à la Curie Métérole.</b>",
  "Après avoir passé un pacte avec un terrible dragon, les DK (Dragon Knight) ont reçu des pouvoirs proche de l'immortalité. Leurs visages intimident leurs ennemis. Mieux vaut ne pas leur chercher des noises.<br/><b>Contrainte : Être un descendant indirect de l'empereur \"Heldentod Ier\" (l'avoir comme ascendant sachant qu'il est mort il y a plus de 200 ans).</b>",
  "Tapis dans l'ombre, Le voleur rusé et silencieux tire profit de sa vitesse pour prendre les ennemis de court lors des combats. Très discret.",
  "Les assassins maîtrisent l’art de supprimer leurs adversaires, sans laisser de traces. Grâce à leurs techniques de combat avancées, ils peuvent également affronter leurs adversaires en face à face.",
  "Les danselames sont avant tout des artistes, ils savent jouer de leur charme et ont une grande agilité pour se mouvoir dans l'environnement, les rendants imprévisibles. Ils préfèrent cependant éviter les combats car ils ne résistent pas beaucoup. Enchaîne des mouvements en combo.",
  "Un samouraï ne fait confiance qu’à son katana. Au bout d’années d’entraînement, même le plus lourd des katanas semble léger comme une plume. Leur code d'honneur est sans faille. Ils cherchent en permanence leur voie. Attaque beucoup à mi-distance. <br/><b>Contrainte : Croit et applique le code d'honneur des Samouraïs : Honnête, Courageux, Respectueux, Loyal : Servir une Cause pour Protéger.</b>",
  "Les chasseurs utilisent leurs compétences de tir et leurs félins pour immobiliser leurs ennemis à distance, avant de déclencher des tirs mortels. Peuvent poser des pièges",
  "Les ingénieurs aiment utiliser des explosifs et autres machines pour prouver l’utilité de la technologie au combat. Ils peuvent crafter différents objets et se mécaniser. <br/><b>Contrainte : Être intéressé par la technologie.</b>",
  "Les corsaires étudient attentivement l’ennemi pour repérer ses faiblesses et les éventuelles ouvertures avant d'attaquer à distance. Attaques en rafale à distance.",
  "les juges sont des pourfendeurs se battant avec une faux. Ils combattent à la fois au corps à corps et à distance et utilise la peur pour entraver leurs ennemis. <br/><b>Contrainte : Servir une cause (à choisir), avec pour engagement de devoir Tuer/Condamner.</b>",
  "Les clercs invoquent le pouvoir divin pour soigner les blessures et protéger les alliés. Ce sont des fervents de l'église de la Curie Métérole, ils sont généralement missionnés par le pape.<br/><b>Contrainte : Apprentissage lié à la Curie Métérole.</b>",
  "Les bardes sont des artistes qui utilisent les rimes, les sons et les ballades pour influer sur l’ambiance d’une bataille. Très doué pour soutenir et soigner les alliés, ils se complètent avec les danselames.",
  "Les shamans invoquent la nature et les anciens esprits pendant le combat, ils utilisent leur pouvoir pour soutenir leurs alliés et affaiblir leurs ennemis. Ils peuvent communiquer avec les esprits.<br/><b>Contrainte : Être proche de la nature, la préserver.</b>",
  "Les sages sont des érudits de l'église, ils se battent généralement avec un marteau, sont capables de bénir l'équipement de leurs alliés et d'enchanter des gemmes.<br/><b>Contrainte : Travail pour la Curie Métérole ou l'Ordre des Chevaliers de la Rose : obligation de participer à des rites et évènements, de travailler la semaine et de poser des congés.</b>",
  "Les magiciens sont spécialisés dans le contrôle des éléments, utilisant ces particularités pour vaincre leurs ennemis. Ils maîtrisent généralement 2 éléments différents.",
  "Les illusionnistes maîtrisent les arts de la tromperie, ils affectent l'état mental de leurs ennemis pour les vaincres, ils sont discrets et fourbes.",
  "Les démonistes empruntent le pouvoir des ténèbres, insouciants du danger que représente le mal. Ils peuvent ainsi réaliser des sacrifices pour attaquer, se renforcer ou affaiblir. Ils peuvent être possédé par un esprit démoniaque.",
  "Les Luminarys sont des guerriers-mages utilisant les opposées : les ténèbres et la lumière, pour anéantir leurs ennemis. Ils doivent cependant conserver cet équilibre pour ne pas vasciller dans le chaos.<br/><b>Contrainte : Doit s'équilibrer entre la lumière et les ténèbres pour éviter la folie, le chaos.</b>",
];

// Generate classes elements
classes.forEach((classe, i) => {
  var classeE = document.createElement("div");
  classeE.id = classe;
  var nomE = document.createElement("p");
  if (classe == "Chev Dragon") {
    classe = "C. Dragon";
  }
  nomE.innerText = classe;
  var iconeE = document.createElement("img");
  iconeE.src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE" + iconsClasses[i] + ".png";

  classeE.append(nomE);
  classeE.append(iconeE);

  document.querySelector(".classeslist").append(classeE);
});

// Update classes elements (highlighting)
[...document.querySelector(".classeslist").children].forEach((selectedE) => {
  selectedE.addEventListener("click", () => {
    [...document.querySelector(".classeslist").children].forEach((classeE) => {
      classeE.classList.remove("highlight");
    });
    selectedE.classList.add("highlight");

    document.querySelector(".classeDesc").innerHTML = classesDesc[classes.indexOf(selectedE.id)];
    // document.querySelector('.classeDesc').setHTML(classesDesc[classes.indexOf(selectedE.id)]);
    updateSkillsList(selectedE.id);
  });
});

// Show/Hide races
const buttonRace = document.querySelector("#buttonRace");
buttonRace.addEventListener("click", () => {
  if (buttonRace.innerText == "Afficher") {
    buttonRace.innerText = "Masquer";
  } else {
    buttonRace.innerText = "Afficher";
  }
  document.querySelector("#race").classList.toggle("hide");
});
// Show/Hide elements
const buttonElem = document.querySelector("#buttonElem");
buttonElem.addEventListener("click", () => {
  if (buttonElem.innerText == "Afficher") {
    buttonElem.innerText = "Masquer";
  } else {
    buttonElem.innerText = "Afficher";
  }
  document.querySelector("#elem").classList.toggle("hide");
});

// Skills list

function updateSkillsList(classe) {
  document.querySelector(".skillslist").innerHTML = "";

  Object.values(skillsJSON).forEach((skill) => {
    if (!skill.classe.includes(classe)) return;

    var skillE = document.createElement("div");
    skillE.classList.add("skill");
    var nomE = document.createElement("p");
    nomE.classList.add("nom");
    var descE = document.createElement("p");
    descE.classList.add("desc");
    var effetE = document.createElement("p");
    effetE.classList.add("effet");
    var montantE = document.createElement("p");
    montantE.classList.add("montant");

    var iconeE = document.createElement("img");
    iconeE.classList.add("icone");

    nomE.innerText = skill.nom;
    descE.innerText = skill.desc;
    effetE.innerText = skill.effet + " / " + skill.stat + " / " + skill.classe; // Ajout Sanofi
    montantE.innerText = skill.montant;
    iconeE.src = "http://voldre.free.fr/Eden/images/skillIcon/" + skill.icone + ".png";

    skillE.append(nomE);
    skillE.append(descE);
    skillE.append(effetE);
    skillE.append(montantE);
    skillE.append(iconeE);

    document.querySelector(".skillslist").append(skillE);
  });
}

// ANALYZE :  Counts which stats are most used for skills

// Nb skills by stats
var skillsJSONStat = Object.values(skillsJSON).map((skill) => skill.stat);
const occurrences = skillsJSONStat.reduce(function (acc, curr) {
  return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
}, {});

document.querySelector(".statsBySkills").innerText = JSON.stringify(occurrences);

// Nb skills by effect
var skillsJSONEffect = Object.values(skillsJSON).map((skill) => skill.effet);
const listEffects = skillsJSONEffect.reduce(function (acc, curr) {
  return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
}, {});

console.log("Nb skills by effect", listEffects);

// Nb skills by class
const skillsJSONClass = Object.values(skillsJSON).map((skill) => skill.classe);
const listSkillsByClass = skillsJSONClass.reduce(function (acc, curr) {
  return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
}, {});

const skillsJSONClassIndiv = [].concat(...skillsJSONClass);
const listSkillsByClassIndiv = skillsJSONClassIndiv.reduce(function (acc, curr) {
  return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
}, {});

console.log("Nb skills by class", listSkillsByClass);
console.log(
  "Nb skills by class (Indiv)",
  Object.entries(listSkillsByClassIndiv).sort((a, b) => b[1] - a[1])
);

// Nb skills by class by stat
var allListSkillsByClassByStats = {};
classes.forEach((classe) => {
  const skillsClass = Object.values(skillsJSON).filter((skill) => skill.classe == classe);
  // console.log(skillsClass)
  const skillsClassStats = Object.values(skillsClass).map((skill) => skill.stat);
  // console.log(skillsClassStats)
  var listSkillsByClassStats = skillsClassStats.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
  }, {});
  allListSkillsByClassByStats[classe] = listSkillsByClassStats;
});
console.log("Nb skills by class by stat", allListSkillsByClassByStats);

// ---

const labelsDescription = {
  critique:
    "Le Dé 1 est une réussite critique (dégâts et buffs au max), le Dé 2 un semi-critique (boosté). Pareil pour les échecs avec Dé 19 et Dé 20.",
  invisible:
    "Quand un personnage est invisible : au 1er tour, -3 de chance de le toucher (sauf AoE : 0); aux tours suivants (2+) : Chance/2 (sauf AoE : -3).<br/>&nbsp; A l'inverse, un personnage invisible qui frappe réduit les chances d'esquive et blocage de -2. <br/>&nbsp; Seuls les sorts d'Esprit laisse invisible, les autres font sortir. Se prendre un coup fait sortir aussi.",
  endormi:
    "Réussir à endormir dépend de l'état de l'ennemi (réussite décroissante (calme : Esprit, éveillé : Esprit*0.75, énervé : Esprit*0.5)). Ceci est similaire pour l'hypnose<br/> Un personnage endormi (ou Hypnotisé) se réveil avec une réussite à :  Tour 1 : Esprit*0.5, Tour 2 : Esprit*0.75, Tour 3+ : Esprit.<br/>Se faire frapper permet de : sortir de l'endormissement et offre 1 tentative de reprise d'esprit.<br/>L'endormissement et l'hypnose ne sont pas des malus pouvant être retiré par un sort (ex : Prévention). Le 1er tour est forcément perdu par la cible.<br/>L'hypnotisé doit agir en même temps que l'hypnotiseur.",
  protege:
    "Un personnage peut protéger un autre et dans une seule direction. Pour cela, il aura un malus de blocage selon la situation (2 ou +).<br/> Si un second ennemi attaque dans une autre direction, la protection est impossible.<br/> Sur un échec critique, c'est la personne protégée qui prend le coup. Dé 19 : bloquage/2, Dé 20 : 0 blocage.",
  incanter:
    "Un personnage peut incanter un sort sur plusieurs tours. Pendant ce temps, le personnage ne peut plus esquiver ni se déplacer.<br/> Sur un échec critique de blocage (voire une réussite critique de l'ennemi, selon le contexte), l'incantation est annulée.",
  //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
};

const dialog = document.querySelector("dialog");
document.querySelectorAll("label").forEach((label) => {
  if (!labelsDescription[label.htmlFor]) return; // Si le label n'a pas de description

  label.addEventListener("click", () => {
    dialog.innerText = "";
    const text = document.createElement("p");
    text.innerHTML = labelsDescription[label.htmlFor]; // description
    dialog.append(text);
    // Bouton de fermeture
    var closeE = document.createElement("button");
    closeE.id = "close";
    closeE.innerText = "Fermer";
    closeE.addEventListener("click", () => {
      dialog.close();
    });
    dialog.append(closeE);

    // Ouverture en "modal"
    dialog.showModal();
  });
});

// Allow user to close Modal (Dialogue) by clicking outside
dialog.addEventListener("click", (e) => {
  const dialogDimensions = dialog.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    dialog.close();
  }
});
// dialog.show() // Opens a non-modal dialog
