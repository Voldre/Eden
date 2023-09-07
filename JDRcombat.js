// JSON Initialisation
var xhReq = new XMLHttpRequest();

console.log(window.location.href)
if(window.location.href.includes('http')){
    
    xhReq.open("GET", "./JDRskills.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var skillsJSON = JSON.parse(xhReq.responseText);
    
    xhReq.open("GET", "./JDReqpt.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var eqptJSON = JSON.parse(xhReq.responseText);

    xhReq.open("GET", "./JDRpersos.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var persosJSON = JSON.parse(xhReq.responseText);
    
    xhReq.open("GET", "./JDRmaster.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var masterJSON = JSON.parse(xhReq.responseText);

    xhReq.open("GET", "./JDRenemy.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var enemyJSON = JSON.parse(xhReq.responseText);

}else{
    var skillsJSON = {};
    var eqptJSON = {};
    var galeryJSON = {};
    var masterJSON = {};
    var enemyJSON = {};
    var persosJSON = {};
}


const classes = ['Guerrier','Chevalier','Templier','Chev Dragon','Voleur','Assassin','Danselame','Samouraï','Chasseur','Ingénieur','Corsaire','Juge','Clerc','Barde','Shaman','Sage','Magicien','Illusionniste','Démoniste','Luminary'];
const iconsClasses = ['01','02','03','18','04','05','06','16','07','08','09','59','10','11','12','17','13','14','15','19']


var perso = {}
var enemy = {}

var turn = 0;
var ingame = false;

// console.log('Master JSON', masterJSON);
console.log('Enemy JSON', enemyJSON);


// Initialize persos list
Object.entries(persosJSON).forEach( ([id,perso]) =>{
    console.log(perso,id)
    if(!perso.nom) return
    var option = document.createElement('option')
    option.value = id;
    option.innerText = perso.nom.slice(0,11);
    document.querySelector('#selectPerso').append(option);
});



//  Actions Management

selectPerso = document.querySelector('#selectPerso');

// Load perso if URL parameter
window.addEventListener('load', () =>{
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.has('perso')){
      selectPerso.value = urlParams.get('perso')-1;
      // loadFiche(urlParams.get('perso'));
      selectedPerso = selectPerso.value;
      selectedID = selectPerso.selectedIndex;
  }
  loadFiche(selectedID);
  loadEnemy(chooseEnemy());
  // Math.round(Math.random()*110)

  newturn();
})

selectPerso.addEventListener('change', e =>{
    indexPerso = e.target.selectedIndex-1; // -1 très important
    persoNom = e.target.value;
    loadFiche(indexPerso);
    loadEnemy(chooseEnemy());

    toastNotification('Chargement réussi de ' + persoNom);
  
    newturn();
});



function loadFiche(indexPerso){

    document.querySelector('.perso').id = indexPerso;

    persoData = persosJSON[indexPerso];

    if(!persoData) return;
    
    perso = new Perso(persoData);

    document.querySelector('#nom').value = perso.nom;
    
    document.querySelector('#niv').value = perso.niv;
    document.querySelector('#pv').value = perso.pv;
    document.querySelector('#pvmax').value = perso.pvmax;

    document.querySelector('#degat').value =  perso.degat;

    document.querySelector('#degatR').value =  perso.degatR;

    document.querySelector('#pp').src = persoData.pp;
    document.querySelector('#force').value = perso.force;
    document.querySelector('#dexté').value = perso.dexté;
    document.querySelector('#intel').value = perso.intel;
    document.querySelector('#charisme').value = perso.charisme;
    document.querySelector('#esprit').value = perso.esprit;    

    // Classes du perso
    classePID = classes.indexOf(perso.classeP);
    classeSID = classes.indexOf(perso.classeS);
    document.querySelector('.iconClasses').children[0].src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE"+iconsClasses[classePID]+".png";
    document.querySelector('.iconClasses').children[1].src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE"+iconsClasses[classeSID]+".png";

}

function Perso(persoData){
  
  this.nom = persoData.nom;
    
  this.niv = persoData.niv;
  this.pvmax = this.pv = persoData.pvmax;

  // Calcul des dégâts fixes et de l'armure
  stuffs = JSON.parse(persoData.eqpts).map(eqptName => {
      return Object.values(eqptJSON).find(eqpt => eqpt.nom.toLowerCase().trim() == eqptName.toLowerCase().trim());
  })

  stuffs[1] = stuffs[1] || {"montant":"Dégât +0"};
  if(stuffs[1].nom.includes('Bouclier')){ 
      montantBouclier = stuffs[1].montant.split('Dégât -')[1].split(',')[0].split(' ')[0];
      stuffs[1] = {"montant":"Dégât +0"};
  }else{ montantBouclier = 0; }

  montantArme1 = stuffs[0].montant.split('Dégât +')[1].split(',')[0].split(' ')[0];
  montantArme2 = stuffs[1].montant.split('Dégât +')[1].split(',')[0].split(' ')[0];

  // Bonus de dégât par niveau
  this.degat = Math.round((parseInt(montantArme1) + parseInt(montantArme2)) *  Math.pow(1.1,this.niv));
 

  montantArmure = stuffs[3].montant.split('Dégât -')[1].split(',')[0].split(' ')[0];

  // Bonus d'armure par niveau
  this.degatR =  Math.round((parseInt(montantBouclier) + parseInt(montantArmure)) *  Math.pow(1.1,this.niv));


  // --- 

  this.force = persoData.force + persoData.forceB.replace(/[^\d.+-]/g, '');
  this.dexté = persoData.dexté + persoData.dextéB.replace(/[^\d.+-]/g, '');
  this.intel = persoData.intel + persoData.intelB.replace(/[^\d.+-]/g, '');
  this.charisme = persoData.charisme + persoData.charismeB.replace(/[^\d.+-]/g, '');
  this.esprit = persoData.esprit + persoData.espritB.replace(/[^\d.+-]/g, '');
  
  this.force = eval(this.force).toString().slice(0,2);
  this.dexté = eval(this.dexté).toString().slice(0,2);
  this.intel = eval(this.intel).toString().slice(0,2);
  this.charisme = eval(this.charisme).toString().slice(0,2);
  this.esprit = eval(this.esprit).toString().slice(0,2);      

  // Classes du perso
  this.classeP = persoData.classeP;
  this.classeS = persoData.classeS;
};

function loadEnemy(indexEnemy){
  
  ingame = true;
  turn = 0;

  // Useless with new chooseEnemy() function
    document.querySelector('.enemies').id = indexEnemy;
    enemyData = enemyJSON[indexEnemy];

  if(!enemyData) return;

  enemy = new Enemy(enemyData)
  
  document.querySelector('#enom').value = enemy.nom;
  
  document.querySelector('#epv').value = enemy.pvmax;
  document.querySelector('#epvmax').value = enemy.pvmax;

  document.querySelector('#epp').src = "http://voldre.free.fr/Eden/images/monsters/"+enemyData.visuel3D+".png";
  document.querySelector('#epp').alt = enemyData.visuel3D;

  document.querySelector('#desc').innerText = enemyData.desc;

  document.querySelector('#edegat').value = enemy.degat;
}

function Enemy(enemyData){
  
  this.nom = enemyData.nom;
  
  this.pvmax = this.pv = enemyData.pvmax;

  enemyStats = enemyData.stats.split(',')
  this.force = parseInt(enemyStats[0]);
  this.dexté = parseInt(enemyStats[1]);
  this.intel = parseInt(enemyStats[2]);
  this.charisme = parseInt(enemyStats[3]);
  this.esprit = parseInt(enemyStats[4]);

  // Calcul des dégâts fixes   
  rawMontantSkills = enemyData.skills.map(skill => {
    // console.log(skill)
    // remove all buff skills and passif
    if(skill.toLowerCase().includes('passif') || skill.toLowerCase().includes('esprit')  || skill.toLowerCase().includes('soin')) return NaN

    var allPlusPosition = []
    for(var i=0; i< skill.length;i++) {
        if (skill[i] === "+") allPlusPosition.push(i);
    }
    // console.log(allPlusPosition)
    
    if(allPlusPosition == []) return NaN

    var amount = [];

    allPlusPosition.forEach(plusPosition =>{
      // console.log(skill[plusPosition+1], skill)
      if(parseInt(skill[plusPosition+1]) > 0){
        // console.log(skill[plusPosition+1],skill[plusPosition+2])
        amount.push(parseInt(skill[plusPosition+1]+skill[plusPosition+2]));
      }
    })

    // console.log(amount)
    average = amount.reduce((a, b) => a + b, 0) / amount.length
    // console.log(average)

    // In average, add Dices
    var dices = 0;

    if(skill.includes('1D12')){
      dices += 6.5;
    }
    if(skill.includes('1D10')){
      dices += 5.5;
    }
    if(skill.includes('2D10')){
      dices += 11;
    }
    if(skill.includes('3D10')){
      dices += 16;
    }
    if(skill.includes('1D8')){
      dices += 4.5;
    }
    if(skill.includes('2D8')){
      dices += 9;
    }
    if(skill.includes('1D6')){
      dices += 3.5;
    }
    if(skill.includes('2D6')){
      dices += 7;
    }
    if(skill.includes('3D6')){
      dices += 10;
    }
    if(skill.includes('1D4')){
      dices += 2.5;
    }

    return average + dices;
  });

  var montantSkills = rawMontantSkills.filter(function (value) {
    return !Number.isNaN(value);
  });

  // console.log(montantSkills)

  // Pour les ennemis, sachant que des sorts sont mal comptés (ex 1D8 +1D6 +4)
  // Je rajoute 50% de dégâts (contre 10% par niveau pour les joueurs), que 50% pas 100% car les des (1D10,2D6,...) sont comptés !
  this.degat = Math.round((montantSkills.reduce((a, b) => a + b, 0) / montantSkills.length)*1.5);
  // console.log(this.degat)
}

enemyGenerated = Object.values(enemyJSON).map(enemy =>{
  return new Enemy(enemy)
})
console.log(enemyGenerated)

function chooseEnemy(category = null){

  const forbidden = ['71','74','80','82','85','90','101','104','109','113'];
  // console.log(forbidden.map(f => enemyJSON[f]))

  const boss = ['24','29','45','46','50','54','56','57','59','61','62','67','70','71','74','75','76','77','80','82','84','85','86','89','90','101','106','109','111','113','114'];
  var enemyList = [];

  if(!category){
    enemyList = {...enemyJSON};
    forbidden.forEach(enemyF =>{
      delete enemyList[enemyF];
    });

  }else if(category == "boss"){
    enemyList = {...enemyJSON};
    
    enemyList = Object.keys(enemyList).filter(enemy => boss.includes(enemy));
    console.log(enemyList)
    
    forbidden.forEach(enemyF =>{
      enemyList = enemyList.filter(enemy => enemy != enemyF);
    });
    console.log(enemyList)
  }
  // console.log(enemyList);
  randomEnemy = Math.floor(Math.random()* Object.keys(enemyList).length);
  // console.log(randomEnemy,enemyList)
  if(!category){
    // console.log(enemyList[randomEnemy])
    // console.log(Object.entries(enemyJSON).find(e => e[1] == enemyList[randomEnemy])[0]);

    return Object.entries(enemyJSON).find(e => e[1] == enemyList[randomEnemy])[0];
  }else{ return enemyList[randomEnemy]; }
}


// FIGHT

function newturn(){

  if(document.querySelector('#epv').value < 0){
    toastNotification("Victoire !");
    document.querySelector('#instruction').innerText = "Victoire !";
    updateDesc('Vous avez vaincu '+enemy.nom);
    ingame = false;
    return;
  }else if(document.querySelector('#pv').value <0){
    toastNotification("Défaite");
    document.querySelector('#instruction').innerText = "Défaite";
    updateDesc('Vous avez perdu contre '+enemy.nom);
    ingame = false;
    return;
  }
  turn++
  document.querySelector('#turn').innerText = turn;
  toastNotification('Tour n°'+turn + ', choisissez une action');
  document.querySelector('#instruction').innerText = "Choisissez une action";

  unlockInputs(true);
}


// Dice

function rollDice(user, type, statName) {
  
  var duration = 500; // in ms

  var result;

  if(user == perso){
    var section = document.querySelector('.playerAction')
  }else{
    var section = document.querySelector('.enemyAction')
  }

  var stat = user[statName];
  console.log(user,statName,stat)

  var dice = section.querySelector(".dice");
  
  // Stat name section + Success amount
  if(type =="attack" || type=="skill"){
    section.querySelector(".statName").innerText = statName;
    success = stat;

  }else{ 
    section.querySelector(".statName").innerText = statName+"/2"; 
    success = Math.ceil(stat/2)
  }
  
  // Result
  var diceValue = Math.round(Math.random()*19 +1)

  if(diceValue > success){
    result = "fail";
    if(diceValue == 20){
      result = "crit fail";
    }
  }else{ 
    result = "success";
    if(diceValue == 1){
      result = "crit success";
    }
  }

  // Display result

  if(!dice.classList.contains("show")){
      dice.classList.add("show");
      setTimeout(function(){ 
        dice.classList.remove("show"); 
        dice.innerText = diceValue;

        if(result == "fail"){
          dice.style.filter = 'drop-shadow(1px 1px 10px darkred)';
        }
        if(result == "crit fail"){
            dice.style.filter = 'drop-shadow(1px 1px 15px red)';
        }
        if(result == "success"){
          dice.style.filter = 'drop-shadow(1px 1px 10px green)';
        }
        if(result == "crit success"){
          dice.style.filter = 'drop-shadow(1px 1px 15px yellow)';
        }
      }, duration);
  }
  
  return result;
};


function resetDices(){
  [...document.querySelectorAll(".dice")].forEach(dice =>{
    dice.style.filter = '';
    dice.innerText = '';
  });
  [...document.querySelectorAll(".instruction")].forEach(desc =>{
    desc.innerText = "";
  });
  updateDesc("");
}

// Stats clicked

var statsButton = ['bforce','bdexté',"bintel","bcharisme","besprit"];

statsButton.forEach(buttonStat =>{
  var statName = buttonStat.slice(1,);
  document.querySelector('#'+buttonStat).addEventListener('click', () => {

    if(!ingame){
      toastNotification("Le combat est terminé");
      return;
    }

    // Déroulement du tour
    unlockInputs(false);

    executeAction(perso,"attack",statName);
      

    setTimeout(function(){ 
      enemyTurn(enemy);
    }, 3000);

    setTimeout(function(){ 
      newturn();
    }, 6000);

  });
});

// Turn execution

function enemyTurn(enemy){

    toastNotification("Au tour de l'ennemi...");
    document.querySelector('#instruction').innerText = "Au tour de l'ennemi...";

    sumStatsATK = enemy.force+enemy.dexté+enemy.intel;

    randValue = Math.round(Math.random()*sumStatsATK);

    if(randValue < enemy.force){
      statName = "force";
    }else if(randValue < enemy.force + enemy.dexté){
      statName = "dexté";
    }else{ statName = "intel"; }

    executeAction(enemy,"attack", statName);
}

function executeAction(user, type, statName){
  
  resetDices();

  if(user == perso){
    opponent = enemy;
  }else{ opponent = perso; }

  userResult = rollDice(user,type,statName);

  console.log(userResult);

  if(userResult == "crit success"){
    hit(opponent, Math.ceil(user.degat *1.5));
    updateDesc("Touché critique !")
  }else if(userResult == "success"){
    
    setTimeout(function(){ 
      opponentResult = rollDice(opponent,"defense",statName);
      if(opponentResult == "fail"){
        updateDesc("Touché !");
        hit(opponent, user.degat);
      }else if(opponentResult == "crit fail"){
        hit(opponent, user.degat+5);
        updateDesc("Touché !");
      }else{
        updateDesc("Bloqué / Esquivé");
      }
    }, 1500);

    
  }else if(userResult == "fail"){
    updateDesc("Echec");
  }else if(userResult == "crit fail"){
    hit(user, Math.trunc(user.degat/2) + user.degatR || 0);
    updateDesc("Echec critique");
  }
}

function hit(user,amount){
  // +1D10 de dégâts
  diceDamage = Math.ceil(Math.random()*10);

  damage = amount + diceDamage - (user.degatR || 0);
  if(damage > 0){ // Si <0 == Big armure, mal chance, etc... donc 0 mais ça ne soigne pas
    user.pv -= damage = amount + diceDamage - (user.degatR || 0);
  }
  if(user == perso){
    document.querySelector('#pv').value = user.pv;
  }else{
    document.querySelector('#epv').value = user.pv;
  }
}

function updateDesc(desc){
  setTimeout(() => {document.querySelector('#actionDescription').innerText = desc;}, 1000);
}

function unlockInputs(bool){
  unlockValue = bool == true ? 'auto' : 'none';
  colorValue = bool == true ? 'black' : 'grey'
  statsButton.forEach(buttonStat =>{
    document.querySelector('#'+buttonStat).style.pointerEvents = unlockValue;
    document.querySelector('#'+buttonStat).style.color = colorValue;
  });
}



// Modal (Dialog) des informations de bases des labels

labelsDescription = {
             'niv':"Augmente automatiquement tous les 100 points d'expériences du Niveau 1 à 5, puis tous les 150.<br/> Tous les niveaux paire (2,4,6,8), vous obtenez une compétence.<br/> Au Niveau 5 vous avez +1 en Esprit.<br/> Au Niveau 10, c'est +1 où vous voulez.",
             'pv':"Statistique des PV, augmente de 5 par niveau.",
             'degat':"Les dégâts sont calculés en faisant la somme du montant des 2 premières armes. Puis +10% par niveau. Ex : Armes : 4+5, niveau 6 : 9*1.1^6 = 16<br/> Chaque coup est additionné de 1D10 de dégâts.",
             'armure':"L'armure vaut le montant de l'armure (dégât reçu -x). Puis +10% par niveau. Ex : Armure : 4, niveau 6 : 9*1.1^6 = 7"
            //  'argent':"L'or permet d'acheter des objets, des armes, des armures, de se nourrir, dormir, etc..."
}

const dialog = document.querySelector("dialog")
document.querySelectorAll('label').forEach(label => {

    if(!labelsDescription[label.htmlFor]) return; // Si le label n'a pas de description

    label.addEventListener('click', () =>{
        dialog.innerText = "";
        text = document.createElement('p');    
        text.innerHTML = labelsDescription[label.htmlFor]; // description
        dialog.append(text);
        // Bouton de fermeture
        var closeE = document.createElement('button');
        closeE.id = "close";
        closeE.innerText = "Fermer";
        closeE.addEventListener('click', () =>{
            dialog.close();
        });
        dialog.append(closeE);

        // Ouverture en "modal"
        dialog.showModal() 
    })
});

// Allow user to close Modal (Dialogue) by clicking outside
dialog.addEventListener("click", e => {
  const dialogDimensions = dialog.getBoundingClientRect()
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    dialog.close()
  }
})
// dialog.show() // Opens a non-modal dialog


// Toasts 
const params = new URLSearchParams(window.location.search)

function toastNotification(text, duration = 3000) {
    var x = document.getElementById("toast");
    if(!x.classList.contains("show")){
        x.classList.add("show");
        x.innerText = text;
        // if(lastElement){ x.append(lastElement)}
        setTimeout(function(){ x.classList.remove("show"); }, duration);
    }
}
document.getElementById("toast").addEventListener('click', ()=>{
    document.getElementById("toast").classList.remove("show");
})
