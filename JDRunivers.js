
// JSON Initialisation
var xhReq = new XMLHttpRequest();

console.log(window.location.href)
if(window.location.href.includes('http')){
    xhReq.open("GET", "./JDRskills.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var skillsJSON = JSON.parse(xhReq.responseText);
    
    // xhReq.open("GET", "./JDRpersos.json", false);
    // xhReq.send(null);
    // var persosJSON = JSON.parse(xhReq.responseText);
}else{
    var skillsJSON = {};
}

const classes = ['Guerrier','Chevalier','Templier','Chev Dragon','Voleur','Assassin','Danselame','Samouraï','Chasseur','Ingénieur','Corsaire','Juge','Clerc','Barde','Shaman','Sage','Magicien','Illusionniste','Démoniste','Luminary'];
const iconsClasses = ['01','02','03','18','04','05','06','16','07','08','09','59','10','11','12','17','13','14','15','19']

const classesDesc = [
    "Les guerriers possèdent de solides aptitudes au combat ainsi que de lourdes armures résistantes. Peut effrayer les ennemis et motiver ses alliés.",
    "Les chevaliers incarnent le courage. Esquivant et bloquant les coups, ils attaquent sans relâche jusqu’à obtenir la victoire. Ils aiment les duels et sont très précis et rapide.",
    "Stimulés par leur noble croyance, les templiers invoquent le pouvoir divin pour punir le mal. Tout comme les clercs, ce sont des fervants de l'église et agisse pour elle.<br/><b>Contrainte : Apprentissage lié à la Curie Métérole.</b>",
    "Après avoir passé un pacte avec un terrible dragon, les DK (Dragon Knight) ont reçu des pouvoirs proche de l'immortalité. Leurs visages intimident leurs ennemis. Mieux vaut ne pas leur chercher des noises.<br/><b>Contrainte : Héritier de l'empereur \"Heldentod Ier\" (mort il y a plus de 200 ans).</b>",
    "Tapis dans l'ombre, Le voleur rusé et silencieux tire profit de sa vitesse pour prendre les ennemis de court lors des combats. Très discret.",
    "Les assassins maîtrisent l’art de supprimer leurs adversaires, sans laisser de traces. Grâce à leurs techniques de combat avancées, ils peuvent également affronter leurs adversaires en face à face.",
    "Les danselames sont avant tout des artistes, ils savent jouer de leur charme et ont une grande agilité pour se mouvoir dans l'environnement, les rendants imprévisibles. Ils préfèrent cependant éviter les combats car ils ne résistent pas beaucoup. Enchaîne des mouvements en combo.",
    "Un samouraï ne fait confiance qu’à son katana. Au bout d’années d’entraînement, même le plus lourd des katanas semble léger comme une plume. Leur code d'honneur est sans faille. Ils cherchent en permanence leur voie. Attaque beucoup à mi-distance. <br/><b>Contrainte : Croit et applique le code d'honneur des Samouraïs : Juste, Respectueux, Servir une Cause pour Protéger.</b>",
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
]

// Generate classes elements
classes.forEach( (classe,i) =>{
    var classeE = document.createElement('div');
    classeE.id = classe;
    var nomE = document.createElement('p');
    if(classe == "Chev Dragon"){
        classe = "C. Dragon";
    }
    nomE.innerText = classe;
    var iconeE = document.createElement('img');
    iconeE.src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE"+iconsClasses[i]+".png";

    classeE.append(nomE);
    classeE.append(iconeE);

    document.querySelector('.classeslist').append(classeE);
});

// Update classes elements (highlighting)
[...document.querySelector('.classeslist').children].forEach(selectedE =>{
    selectedE.addEventListener('click', () =>{
        [...document.querySelector('.classeslist').children].forEach(classeE =>{
            classeE.classList.remove('highlight');
        });
        selectedE.classList.add('highlight');    

        document.querySelector('.classeDesc').innerHTML = classesDesc[classes.indexOf(selectedE.id)];
        // document.querySelector('.classeDesc').setHTML(classesDesc[classes.indexOf(selectedE.id)]);
        updateSkillsList(selectedE.id);     
    })
});

// Show/Hide races
buttonRace = document.querySelector('#buttonRace');
buttonRace.addEventListener('click', ()=>{
    if(buttonRace.innerText == 'Afficher'){
        buttonRace.innerText = 'Masquer';
    }else{ buttonRace.innerText = 'Afficher'; }
    document.querySelector('#race').classList.toggle('hide');
});
// Show/Hide elements
buttonElem = document.querySelector('#buttonElem');
buttonElem.addEventListener('click', ()=>{
    if(buttonElem.innerText == 'Afficher'){
        buttonElem.innerText = 'Masquer';
    }else{ buttonElem.innerText = 'Afficher'; }
    document.querySelector('#elem').classList.toggle('hide');
});

// Skills list

function updateSkillsList(classe){
    document.querySelector('.skillslist').innerHTML = "";

    Object.values(skillsJSON).forEach(skill =>{

        if(!skill.classe.includes(classe)) return;

        var skillE = document.createElement('div')
        skillE.classList.add('skill')
        var nomE = document.createElement('p');
        nomE.classList.add('nom');
        var descE = document.createElement('p');
        descE.classList.add('desc');
        var effetE = document.createElement('p');
        effetE.classList.add('effet');
        var montantE = document.createElement('p');
        montantE.classList.add('montant');
        

        var iconeE = document.createElement('img');    
        iconeE.classList.add('icone');


        nomE.innerText = skill.nom;
        descE.innerText = skill.desc;
        effetE.innerText = skill.effet + " / " + skill.stat + " / " + skill.classe; // Ajout Sanofi
        montantE.innerText = skill.montant;
        iconeE.src = "http://voldre.free.fr/Eden/images/skillIcon/"+skill.icone+".png";

        skillE.append(nomE);
        skillE.append(descE);
        skillE.append(effetE);
        skillE.append(montantE);
        skillE.append(iconeE);
        document.querySelector('.skillslist').append(skillE);
    })
}


// Counts which stats are most used for skills

var skillsJSONStat = Object.values(skillsJSON).map(skill => skill.stat) 

const occurrences = skillsJSONStat.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
  }, {});
  
document.querySelector('.statsBySkills').innerText = JSON.stringify(occurrences);

/*
skills = {}

skills[1] = {"nom":"Attaque Cyclone","desc":"Tournoie et frappe les ennemis autour du personnage","effet":"Dégât", "montant":"1D6", "icone":"e0005"}
skills[2] = {"nom":"Provocation","desc":"L'ennemi à X fois plus de chance de cibler le joueur","effet":"Provocation", "montant":" 1D4 fois plus de chance pendant 3 tours", "icone":"e0003"}

// Guerrier
skills[0] = {"nom":"Charge du Guerrier","desc":"Fonce sur la cible et peut l'étourdir","effet":"Dégât", "montant":"D10", "icone":"e0280"}
skills[1] = {"nom":"Mur de Titan","desc":"Réduit les dégâts subis","effet":"Dégât réduit", "montant":"2 + 1D6 pendant 3 tours", "icone":"e0291"}
skills[3] = {"nom":"Euphorie","desc":"Pendant 3 tours, chaque coup reçu augmente les prochains dégâts infligés, cumulables 5 fois.","effet":"Bonus Dégât", "montant":"+1D par coup. Buff pendant 3 tours", "icone":"e0286"}

// Chevalier https://eden-eternal.fandom.com/fr/wiki/Chevalier

skills[4] = {"nom":"Percée du Chevalier","desc":"Frappe la cible 3 fois","effet":"Dégât", "montant":"1D10 + 1D6 + 1D4", "icone":"e0290"}
skills[5] = {"nom":"Vivacité Accrue","desc":"+2 Dextérité pendant 4 tours","effet":"Buff", "montant":"2 pendant 4 tours", "icone":"e0294"}

// Templier

skills[6] = {"nom":"Lumière Sacrée","desc":"Dégâts de lumière à distance","effet":"Dégât", "montant":"1D10", "icone":"e0302"}
skills[7] = {"nom":"Coup Infernal","desc":"Dégâts de lumière sur 3m autour du lanceur","effet":"Dégât", "montant":"1D6", "icone":"e0302"}
skills[8] = {"nom":"Bouclier de Lumière","desc":"Réduit les dégâts magique reçu de tout le monde","effet":"Dégât", "montant":"1D6 pendant 3 tours", "icone":"e0302"}

// Chevalier Dragon

skills[9] = {"nom":"Revers d'écaille","desc":"Renvoi l'attaque reçu au lanceur","effet":"Renvoi", "montant":"3 tentatives par combat max", "icone":"e0566"}
skills[10] = {"nom":"Pouvoir du dragon","desc":"Tranche la cible avec des dégâts de feu","effet":"Dégât", "montant":"1D10", "icone":"e0569"}
// Mode dragon embrasé/démoniaque/caché (à débloquer? quels effets ?)


skills[11] = {"nom":"Attaque Furieuse","desc":"Tournoie et frappe les ennemis autour du personnage","effet":"Dégât", "montant":"1D8", "icone":"e0010"}

// Voleur

skills[12] = {"nom":"Furtivité","desc":"Vous rend invisible","effet":"Invisible", "montant":"Durée 3 tours sauf annulation", "icone":"e0318"}


// Assassin

skills[20] = {"nom":"Embuscade","desc":"Frappe sournoisement l'ennemi, dégât doublé si par surprise","effet":"Dégât","montant":"1D8 (X2)","icone":"e0048"}
skills[21] = {"nom":"Perce-Armure","desc":"Frappe et réduit la défense de l'ennemi","effet":"Dégât","montant":"1D6","icone":"e0054"}
skills[22] = {"nom":"Faiblesse Critique","desc":"Frappe efficacement l'ennemi, dégât doublé si coup critique","effet":"Dégât","montant":"1D10 (X2)","icone":"e057"}
skills[23] = {"nom":"Cicatrice de l'esprit","desc":"Frappe et retire un buff de l'ennemi","effet":"Dégât","montant":"1D6","icone":"e0060"}

// Danselame

skills[24] = {"nom":"Lames Dansante","desc":"Envoi des lames au vent et tranche 3 fois les ennemis aux alentours","effet":"Dégât","montant":"1D6 2D4","icone":"e0062"}
skills[25] = {"nom":"Charme tape-à-l-oeil","desc":"Lance un charme sur la cible, efficace si sexe opposé","effet":"Malus","montant":"Réduit l'esquive et la précision","icone":""}

// Samouraï

skills[26] = {"nom":"Coupe Asura","desc":"Envoi une tranche sur plusieurs mètres, peut toucher les ennemis long 2 fois","effet":"Dégât","montant":"1D10 + (1D10)","icone":"e0481"}
skills[27] = {"nom":"Eclair unique","desc":"Tranche avec un coup d'éclair, un second éclair touche si l'ennemi à subi la Coupe Asura","effet":"Dégât","montant":"1D10 + (1D10)","icone":"e0480"}


skills[28] = {"nom":"Tir de Précision","desc":"Chance de touché augmenté, si coup critique dégât X2","effet":"Dégâts","montant":"Réussite +2, 1D6 (X2)","icone":"e0068"}
skills[29] = {"nom":"Triple Tir","desc":"Lance trois tirs sur la cible","effet":"Dégâts","montant":"1D10 + 1D6 + 1D4","icone":"e0068"}

// Chasseur

skills[30] = {"nom":"Invocation du Tigre","desc":"Invoque un Tigre Crocs-Tranchants","effet":"Invocation","montant":"Invocation jusqu'à coupure magique","icone":"e0075"}
skills[31] = {"nom":"Invocation Aigle Chasseur","desc":"Invoque un Aigle chasseur","effet":"Invocation","montant":"Invocation jusqu'à coupure magique","icone":"e0264"}
// Définir les différences des 2 bêtes

skills[32] = {"nom":"Blessure Douloureuse","desc":"Blesse l'ennemi et l'empêche de se soigner pendant 3 tours","effet":"Dégâts","montant":"1D8","icone":"e0070"}
skills[33] = {"nom":"Récupération de la bête","desc":"Soigne votre Tigre Crocs-Tranchants","effet":"Soin","montant":"4 + 1D10","icone":"e0260"}
// Invocation amélioré ? Ou méga transfo du tigre

// Ingénieur

skills[34] = {"nom":"Robotisation","desc":"Vous transforme en Guerrier Méca","effet":"Transformation","montant":"Réduit les dégâts reçu de 2D4, Toutes Stats-1, dure 5 tours","icone":"e0083"}
skills[35] = {"nom":"Bombe à Huile","desc":"Inflige une explosion sur plusieurs mètres autour de la cible","effet":"Dégâts","montant":"1D10","icone":"e0080"}
skills[36] = {"nom":"Explosifs Visqueux","desc":"La bombe explose et englue tout autour de la cible, attaquer peut défaire la glue","effet":"Dégâts","montant":"1D6, déplacement/esquive très réduit","icone":"e0080"}
// Autre à inventer en mode robotique ?

// Corsaire

skills[37] = {"nom":"Saut d'esquive","desc":"Fait bondir en arrière en émettant un tir, utilisable en esquive","effet":"Dégât","montant":"1D8","icone":"e0087"}
skills[38] = {"nom":"Flèche Terrorisante","desc":"Le tir effraye l'ennemi et le déconcentre (malus), réduit la chance d'être ciblé","effet":"Dégât","montant":"1D6","icone":"e0090"}
skills[39] = {"nom":"Sérénité","desc":"Réduit les dégâts et augmente la dextérité","effet":"Buff","montant":"Dexté+2, Dégât subi -1D6 pendant 3 tours","icone":"e0090"}


skills[40] = {"nom":"Punition Divine","desc":"Inflige des dégâts de terre","effet":"Dégât","montant":"1D8","icone":"e0016"}
skills[41] = {"nom":"Guérison","desc":"Soigne la cible","effet":"Soin","montant":"2D8","icone":"e0018"}

// Clerc

skills[42] = {"nom":"Punition Divine","desc":"Inflige des dégâts de lumières","effet":"Dégât","montant":"1D8","icone":"e0092"}
skills[43] = {"nom":"Prévention","desc":"Retire un effet négatif de la cible et réduit les dégâts reçu","effet":"Buff","montant":"Dégât réduit 1D4 pendant 3 tours","icone":"e0019"}

// Barde

skills[44] = {"nom":"Bombe Vocale","desc":"Inflige aléatoirement des dégâts de feu ou d'eau","effet":"Dégât","montant":"1D8","icone":"e0100"}
skills[45] = {"nom":"Hymne à la Guerre","desc":"Augmente les dégâts physiques infligés par le groupe","effet":"Buff","montant":"Bonus 1D4 pendant 3 tours","icone":"e0105"}

// Shaman

skills[46] = {"nom":"Bouclier d'épines","desc":"Octroie un bouclier à la cible, réduit les dégâts et pique les ennemis qui le touche","effet":"Buff","montant":"Dégât réduit 1D4, dégât des piques 1D4  pendant 5 tours","icone":"e0110"}
skills[47] = {"nom":"Totem Gracieux","desc":"Tous les deux tours, soigne les alliés aux alentours","effet":"Soin","montant":"1D10 pendant 1D8 tours","icone":"e0115"}
skills[48] = {"nom":"Puma Noir","desc":"Vous transforme en Puma Noir","effet":"Transformation","montant":"Attaque 1D10, Force+2, Dexté+3 pendant 1D6 tours (annulable)","icone":"e0271"}

// Sage


// var skillsJSON = Object.values(skills) // Remove all keys
*/