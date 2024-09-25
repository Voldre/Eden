import { skillsAwakenJSON, skillsJSON } from "./JDRstore.js";
import { aoeDescInfo, initDialog } from "./utils.js";

// prettier-ignore
const classes = [ "Guerrier", "Chevalier", "Templier", "Chev Dragon", "Voleur", "Assassin", "Danselame", "Samouraï", "Chasseur", "Ingénieur", "Corsaire", "Juge", "Clerc", "Barde", "Shaman", "Sage", "Magicien", "Illusionniste", "Démoniste", "Luminary",];
// prettier-ignore
const iconsClasses = [ "01", "02", "03", "18", "04", "05", "06", "16", "07", "08", "09", "59", "10", "11", "12", "17", "13", "14", "15", "19",];

const classesDesc = [
  "Les guerriers possèdent de solides aptitudes au combat ainsi que de lourdes armures résistantes. Peut effrayer les ennemis et motiver ses alliés.",
  "Les chevaliers incarnent le courage. Esquivant et bloquant les coups, ils attaquent sans relâche jusqu’à obtenir la victoire. Ils aiment les duels et sont très précis et rapide.",
  "Stimulés par leur noble croyance, les templiers invoquent le pouvoir divin pour punir le mal. Tout comme les clercs, ce sont des fervants de l'église et agisse pour elle.",
  "Après avoir passé un pacte avec un terrible dragon, les DK (Dragon Knight) ont reçu des pouvoirs proche de l'immortalité. Leurs visages intimident leurs ennemis. Mieux vaut ne pas leur chercher des noises.<br/><b>Contrainte : Être un descendant indirect de l'empereur \"Heldentod Ier\" (l'avoir comme ascendant sachant qu'il est mort il y a plus de 200 ans).</b>",
  "Tapis dans l'ombre, Le voleur rusé et silencieux tire profit de sa vitesse pour prendre les ennemis de court lors des combats. Très discret.",
  "Les assassins maîtrisent l’art de supprimer leurs adversaires, sans laisser de traces. Grâce à leurs techniques de combat avancées, ils peuvent également affronter leurs adversaires en face à face.",
  "Les danselames sont avant tout des artistes, ils savent jouer de leur charme et ont une grande agilité pour se mouvoir dans l'environnement, les rendants imprévisibles. Ils préfèrent cependant éviter les combats car ils ne résistent pas beaucoup. Enchaîne des mouvements en combo.",
  "Un samouraï ne fait confiance qu’à son katana. Au bout d’années d’entraînement, même le plus lourd des katanas semble léger comme une plume. Leur code d'honneur est sans faille. Ils cherchent en permanence leur voie. Attaque beucoup à mi-distance. <br/><b>Contrainte : Croit et applique le code d'honneur des Samouraïs : Honnête, Courageux, Respectueux, Loyal : Servir une Cause pour Protéger.</b>",
  "Les chasseurs utilisent leurs compétences de tir et leurs félins pour immobiliser leurs ennemis à distance, avant de déclencher des tirs mortels. Peuvent poser des pièges",
  "Les ingénieurs aiment utiliser des explosifs et autres machines pour prouver l’utilité de la technologie au combat. Ils peuvent crafter différents objets et se mécaniser. <br/><b>Contrainte : Être intéressé par la technologie.</b>",
  "Les corsaires étudient attentivement l’ennemi pour repérer ses faiblesses et les éventuelles ouvertures avant d'attaquer à distance. Attaques en rafale à distance.",
  "les juges sont des pourfendeurs se battant avec une faux. Ils combattent à la fois au corps à corps et à distance et utilise la peur pour entraver leurs ennemis. <br/><b>Contrainte : Servir une cause (à choisir), avec pour engagement de devoir Tuer/Condamner.</b>",
  "Les clercs invoquent le pouvoir divin pour soigner les blessures et protéger les alliés. Ce sont des fervents de l'église de la Curie Métérole, ils sont généralement missionnés par le pape.",
  "Les bardes sont des artistes qui utilisent les rimes, les sons et les ballades pour influer sur l’ambiance d’une bataille. Très doué pour soutenir et soigner les alliés, ils se complètent avec les danselames.",
  "Les shamans invoquent la nature et les anciens esprits pendant le combat, ils utilisent leur pouvoir pour soutenir leurs alliés et affaiblir leurs ennemis. Ils peuvent communiquer avec les esprits.<br/><b>Contrainte : Être proche de la nature, la préserver.</b>",
  "Les sages sont des érudits de l'église, ils se battent généralement avec un marteau, sont capables de bénir l'équipement de leurs alliés et d'enchanter des gemmes.<br/><b>Contrainte : Travail pour la Curie Métérole ou l'Ordre des Chevaliers de la Rose : obligation de participer à des rites et évènements, de travailler la semaine et de poser des congés.</b>",
  "Les magiciens sont spécialisés dans le contrôle des éléments, utilisant ces particularités pour vaincre leurs ennemis. Ils maîtrisent généralement 2 éléments différents.",
  "Les illusionnistes maîtrisent les arts de la tromperie, ils affectent l'état mental de leurs ennemis pour les vaincres, ils sont discrets et fourbes.",
  "Les démonistes empruntent le pouvoir des ténèbres, insouciants du danger que représente le mal. Ils peuvent ainsi réaliser des sacrifices pour attaquer, se renforcer ou affaiblir. Ils peuvent être possédé par un esprit démoniaque.",
  "Les Luminarys sont des guerriers-mages utilisant les opposées : les ténèbres et la lumière, pour anéantir leurs ennemis. Ils doivent cependant conserver cet équilibre pour ne pas vasciller dans le chaos.<br/><b>Contrainte : Doit s'équilibrer entre la lumière et les ténèbres pour éviter la folie, le chaos. <br/>Exception : Cette règle ne s'applique pas si le personnage n'a qu'un élément (jusqu'au niveau 5)</b>",
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

  classeE.append(nomE, iconeE);

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
    updateSkillsList(selectedE.id, false);
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
  document.querySelector("#races").classList.toggle("hide");
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
const awakenButton = document.querySelector("#awakenButton");
const updateSkillsList = (classe, isAwaken) => {
  document.querySelector(".skillslist").innerHTML = "";

  const skillsList = Object.values(skillsJSON).filter((skill) => skill.classe.includes(classe));

  skillsList.forEach((skill) => {
    const skillE = document.createElement("div");
    if (isAwaken) skillE.classList.add("awaken");
    else skillE.classList.remove("akawen");
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

    const awakenSkill = Object.values(skillsAwakenJSON).find((s) => s.nom === skill.nom);
    descE.innerText = isAwaken && awakenSkill?.desc ? awakenSkill.desc : skill.desc;
    montantE.innerText = isAwaken && awakenSkill?.montant ? awakenSkill.montant : skill.montant;

    const skillRange = skill.effet.split("AoE ")[1] ?? null; // en bas [0] + "AoE"
    const effetDesc = skillRange ? skill.effet.split(" AoE")[0] : skill.effet;
    effetE.innerText = effetDesc;
    if (skillRange) {
      const skillRangeIconE = document.createElement("span");
      skillRangeIconE.className = "skillRangeIcon";
      skillRangeIconE.style.backgroundImage = `url(http://voldre.free.fr/Eden/images/layout/${skillRange}.png)`;

      const skillStatE = document.createElement("span");
      skillStatE.innerText = " / " + skill.stat + " / " + skill.classe?.toString().replaceAll(",", ", ");

      effetE.append(skillRangeIconE, skillStatE);
    } else {
      effetE.innerText += " / " + skill.stat + " / " + skill.classe?.toString().replaceAll(",", ", "); // Ajout Sanofi
    }

    iconeE.src = "http://voldre.free.fr/Eden/images/skillIcon/" + skill.icone + ".png";

    skillE.append(nomE, descE, effetE, montantE, iconeE);

    // Show/hide awaken skill on click
    skillE.addEventListener("click", () => {
      skillE.classList.toggle("awaken");

      const selectedAwakenSkill =
        skillE.classList.contains("awaken") && Object.values(skillsAwakenJSON).find((s) => s.nom == skill.nom);

      skillE.querySelector(".desc").innerText = selectedAwakenSkill?.desc || skill.desc;
      skillE.querySelector(".montant").innerText = selectedAwakenSkill?.montant || skill.montant;

      updateAwakenButtonTriggered();
    });

    document.querySelector(".skillslist").append(skillE);
    updateAwakenButtonTriggered();
  });
};

awakenButton.addEventListener("click", () => {
  // If all skills are awaken, remove awaken. Else add it.
  const isAwaken = awakenButton.src.includes("25");
  updateSkillsList(document.querySelector(".highlight").id, !isAwaken);
});

const updateAwakenButtonTriggered = () => {
  const isAllSkillsAwaken = [...document.querySelector(".skillslist").children].every((child) =>
    child.classList.contains("awaken")
  );
  awakenButton.src = `images/otherIcon/function02${isAllSkillsAwaken ? 5 : 4}.png`;
};

// ANALYZE :  Counts which stats are most used for skills

// Nb skills by stats
var skillsJSONStat = Object.values(skillsJSON).map((skill) => skill.stat);
const occurrences = skillsJSONStat.reduce(function (acc, curr) {
  return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
}, {});

document.querySelector(".statsBySkills").innerText = JSON.stringify(occurrences).replaceAll(",", ", ");

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

function aoeDesc() {
  let description = "Il existe 4 types d'Attaques de Zone (AoE) :<br/>";
  for (var i = 0; i < 4; i++) {
    const rangeI = Math.floor(i / 2);
    const typeI = i % 2;
    description +=
      "<br/><img class='skillRangeIcon' src='http://voldre.free.fr/Eden/images/layout/" +
      aoeDescInfo.range[rangeI] +
      aoeDescInfo.type[typeI] +
      ".png'/> Attaque en " +
      aoeDescInfo.rangeName[rangeI] +
      " " +
      aoeDescInfo.typeName[typeI] +
      " : <br/>" +
      aoeDescInfo.typeMalus[typeI] +
      ".<br/>";
  }
  return description;
}

const labelsDescription = {
  critique: `Les valeurs extrêmes des Dé (1, 20) sont des critiques et (2, 19) semi-critiques. Voici leurs effets :<br/> 
    <table>
    <thead>
      <tr>
        <th scope="col">Dé (+effet)</th>
        <th scope="col">Effet Attaques</th>
        <th scope="col">Effet Buffs</th>
        <th scope="col">Effet Bloc/Esq</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dé 0</td>
        <td>Montant max des dés +50%</td>
        <td>Durée +2 tours</td>
        <td>Selon contexte</td>
      </tr>
      <tr>
        <td>Dé 1</td>
        <td>Montant max des dés</td>
        <td>Durée +1 tour</td>
        <td>Selon contexte</td>
      </tr>
      <tr>
        <td>Dé 2</td>
        <td>Selon contexte & stuffs</td>
      </tr>
      <tr>
        <td>Dé 19</td>
        <td>Selon contexte & stuffs</td>
      </tr>
      <tr>
        <td>Dé 20/21/22</td>
        <td>Mono : le lanceur prend les dégâts : 0 armure,<br/>AoE : les alliés dedans prennent, sinon : le lanceur</td>
        <td>Buff converti en Malus</td>
        <td>Dégât reçu +X</td>
      </tr>
      <tr>
        <td>Dé 20</td>
        <td>Dégât = Jet de dé, montant/2</td>
        <td>Durée divisée par 2</td>
        <td>Dégât reçu +5</td>
      </tr>
      <tr>
        <td>Dé 21</td>
        <td>Dégât = Jet de dé, montant total</td>
        <td>Durée totale</td>
        <td>Dégât reçu +10</td>
      </tr>
      <tr>
        <td>Dé 22</td>
        <td>Dégât max (zone AoE élargie)</td>
        <td>Durée totale, Effet *2</td>
        <td>Dégât reçu +50%</td>
      </tr>
    </tbody>
  </table>
  `,
  aoe: aoeDesc() + "<br/>Concernant l'esquive, tout sort mono-cible peut être esquivé, sauf les sorts d'esprits.",
  bloquage:
    "Toutes les attaques peuvent être bloquées (physiquement (force) ou magiquement (intelligence))<br/>Bloquer plusieurs fois de suite donne des malus (Blocage -1 par coup), si le coup suivant est une attaque mono-cible, blocage -1 sur le coup.<br/>Cumule max : -4 blocage.<br/><br/>Même avec malus et autres effets, un Dé à 1 ou 2 génèrera tout le temps une réussite de blocage.",
  invisible:
    "Quand un personnage est invisible : au 1er tour, -3 de chance de le toucher (sauf AoE : 0); aux tours suivants (2+) : Chance/2 (sauf AoE : -3).<br/>&nbsp; A l'inverse, un personnage invisible qui frappe réduit les chances d'esquive/blocage/résistance de -2. <br/>&nbsp; Seuls les sorts d'Esprit et Parasite Obscur laissent invisible, SAUF les sorts qui infligent des statuts (hypnose/dodo/entrave). Se prendre un coup fait sortir aussi.<br/><br/> A noter : il n'est pas possible de relancer un sort d'invisibilité tant qu'on l'est encore.",
  protege:
    "Un personnage peut protéger un allié d'une seule attaque par tour. Pour cela, il aura un malus de blocage selon la situation (2 ou +).<br/> Si un second ennemi attaque, la protection est impossible.<br/> Sur un échec critique, c'est la personne protégée qui se prend le coup. Dé 19 ou Dé 20 : 0 blocage.",
  incanter:
    "Un personnage peut incanter un sort sur plusieurs tours. Pendant ce temps, le personnage ne peut plus esquiver ni se déplacer.<br/> Sur un échec critique de blocage (voire une réussite critique de l'ennemi, selon le contexte), l'incantation est annulée.<br/><br/>Les effets des réussites critiques varient selon les incantations :<br/>- Incantation en 3 tours (3 dés) : le 1er supprime le 2nd tour, le 2nd tour augmente les dégâts de 5 (ou +?), le 3eme tour implique le montant maximum des dés,<br/>- Incantation en 2 tours (2 dés) : le 1er tour augmente les dégâts de 5 (ou +?), le 2nd tour implique le montant maximum des dés,<br/>- Incantation en 2 tours (1 dé) : le dé est au Tour 1 et implique le montant maximum des dés.",
  //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
  "coup-allié":
    "Lorsqu'on décide de se prendre un coup par un allié (joueur, familier), comme pour un blocage sur un dé 20 : le joueur prend les dégâts divisés par 2 et sans armure.",
  status:
    "Un status est un malus d'altération d'état qui est non annulable. Autrement dit, les sorts qui retire des malus comme \"Prévention\" ne fonctionnent pas.<br/><br/>Ils peuvent être retiré à chaque tour en suivant ce calcul pour la stat définie :<ul><li>Tour 1 (lorsqu'on subit le sort) : Stat/2,</li><li> Tour 2 : Stat*0.75,</li><li> Tour 3 et + : Stat</li></ul>Une nouvelle tentative (pour annuler) est possible si la personne est attaquée, le jet de dé change selon l'altération.<br/>Voici les trois altérations d'états qui existent :<br/><ul><li>Hypnose (Esprit) : Si frappé : Tentative égale au montant de la stat pour le Tour X (réussite +1 après chaque reçu, ne compte que sur le tour actuel).</li><li>Endormissement (Esprit) : Si frappé : Tentative égale à 17. Si sort d'esprit : Tentative égale à l'esprit. (-2 si 1er tour).</li><li>Entrave (Force) : Si frappé <b>par un allié</b> : Tentative égale à 10 si AoE, sinon 17.</li></ul>A noter : L'énervement des ennemis (leur blessure) augmente leur <b>résistance d'esprit</b> face aux altérations d'Esprit (jusqu'à atteindre leur stat d'Esprit)",
  familier:
    "Il est possible d'invoquer jusqu'à 2 familiers simultanément, toutes sources confondues (compétences, équipements). Ils agissent pendant le tour du joueur comme un personnage (attaque, blocage, ...).",
  armure:
    "Il existe 3 types d'armures (magique, léger, lourd), chaque classe permet de porter l'un de ces types.<br/>Certaines classes combinées peuvent porter un type supplémentaire (Chevalier hors tank, Sage et Luminary hors mage)<br/><br/>Si le personnage porte une armure d'un type différent de ces classes, les malus suivants sont appliqués :<ul><li>Stuff non magique : Intelligence -2,</li><li>Stuff non léger : Dextérité -2,</li><li>Stuff non lourd : Force -2,</li></ul>Si le type d'armure est le même pour les 2 classes du personnage, le malus de la Stat est de -3.",
  montant:
    "Le montant des buffs augmente :<ul><li>Les dégâts infligés des buffs (A la charge, Magie extrême, Aura du Samouraï, ...),</li><li>Les dégâts reçus des buffs (Encouragement musical, Mur de Titan, Robotisation, ...)</li></ul>Les montants des malus sont également compris dans ce terme \"montant des buffs\" :<ul><li>Les dégâts infligés des malus (Parasite, Flèche empoisonnée, ...)</li><li>Les dégâts reçus des malus (Perce-Armure, Affablissement Mental, ...)</li></ul>Rappel : le montant des buffs de l'ensemble des stuffs est limité à +2<br/><br/>Pour la durée des sorts, le max est à +1 tour (2 si passif 12). Les capacités des équipements en bénéficient aussi, mais ne peuvent gagner qu'un tour max.",
  monture:
    "Une monture de combat est considérée comme : <br/>1) Une arme évolutive (emplacement d'arme) qui octroie des compétences au personnage (les compétences consomment le tour du perso), les autres emplacements d'armes n'affectent que le perso, pas la monture<br/>2) Un familier : il a ses PV, ses stats, et seuls les compétences et accessoires dédiés aux familiers agissent dessus.",
  instant:
    "Dans chaque tour d'un joueur, il est possible de faire 1 action (attaque, ...) et 1 action instantanée qui est facultative, voici la liste de ces actions :<ul><li>Changement d'armes parmi les 3 emplacements.<br/>/!\\ changer un équipement par un autre consomme le tour</li><li>Compétences instantanées : octroyées par certaines classes ou équipements.<br/>/!\\ Un même sort instantanée ne peut être utilisé que tous les 3 tours (anti-spam)</li><li>Utiliser un objet/gadget : 1 potion, 1 bombe, ...</li></ul>A noter : il est possible d'utiliser 2 actions instantanées en 1 tour, la seconde action consommera le tour.<br/>/!\\ Faire un échec critique (19, 20) sur une action instantanée fait perdre le tour.",
  degatPM:
    "Les dégâts physiques (P) englobe les dégâts réalisés par des attaques de Force, de Dextérité et de Charisme.<br/>Les dégâts magiques (M) englobe les dégâts réalisés par des sorts d'Intelligence et d'Esprit",
  survie:
    "Lorsqu'un joueur tombe KO, sa vie est en jeu. Son temps avant la mort est compté selon les cicronstances (lieu, contexte) et ses dégâts, soit <b>environ</b> :<ul><li>A 0 : 10 tours</li><li>A -25 : 8 tours</li><li>A -50 : 5 tours</li><li>A -75 : 3 tours</li><li>A -100 : 2 tours</li><li>Si les PV descendent à l'équivalent des PV max (ou -150 PV) : 0 tour (mort instantanée)</li></ul>A noter qu'il est possible d'être soigné (sort, potion) et blessé, et que franchir un seuil augmente/diminue les tours.<br/>De plus, pour chaque KO supplémentaire dans un laps de temps court, la survie est diminué de 2 tours.<br/><br/>Un jet de survie est lancé quand il reste 5, 2 puis 0 tours. Le jet de survie peut changer la durée de survie (en tour) : Dé 1 : +2 tours, Dé 2-5 : +1 et l'inverse en négatif.",
  "soin-recu":
    "Les bonus de soins reçus (montant fixe ou %), ne s'appliquent que sur les compétences et pas sur les objets (accessoires, potions, ...).",
};

initDialog(labelsDescription);
