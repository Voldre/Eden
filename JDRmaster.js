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

    // xhReq.open("GET", "./JDRpersos.json" + "?" + new Date().getTime(), false);
    // xhReq.send(null);
    // var persosJSON = JSON.parse(xhReq.responseText);
    
    xhReq.open("GET", "./JDRmaster.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var masterJSON = JSON.parse(xhReq.responseText);

    // load notes
    document.querySelector('.notes').value = masterJSON.notes;

    xhReq.open("GET", "./JDRenemy.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var enemyJSON = JSON.parse(xhReq.responseText);
}else{
    var skillsJSON = {};
    var eqptJSON = {};
    var persosJSON = {};
    var galeryJSON = {};
    var masterJSON = {};
    var enemyJSON = {};
}

console.log('Master JSON', masterJSON);
console.log('Enemy JSON', enemyJSON);

/*
$.ajax({
    url: "JDRlogin.php",

    type: "post", 
    success: function(data) {
      $('body').html(data);
    }
})
*/
console.log(window.location.href);
if(window.location.href.includes('html')){
    console.log('no');
    stop();
}


// Next turn
document.querySelector('#nextTurn').addEventListener('click', ()=>{
    document.querySelector('#tour').value = parseInt(document.querySelector('#tour').value) + 1;
    [...document.querySelector('.combat').querySelectorAll('input[type="number"]')].forEach(buffTurn =>{
        if(!buffTurn.closest(".stats") && !buffTurn.id.includes('pv') && buffTurn.value >= 1){
            // If the input is not in stats and is not the pv and is not 0, then ...
            buffTurn.value -= 1;
            // if(buffTurn.value == 0){}
        }
    })
})

// Disable the possibility of launching many audio simultaneously

document.addEventListener('play', function(e){
    var audios = document.getElementsByTagName('audio');
    for(var i = 0, len = audios.length; i < len;i++){
        if(audios[i] != e.target){
            audios[i].pause();
            if(audios[i].currentTime < 30){
                audios[i].currentTime = 0;
            }
        }    
    }
    if(e.target.firstChild.attributes){
        currentBGM = e.target.firstChild.attributes.src.nodeValue.split("/")[1].split(".")[0]
        console.log(currentBGM);
        document.getElementById("currentMusic").innerText = document.getElementById(currentBGM).innerText +" ("+currentBGM+")";
    }
}, true);


// Load Enemies

const elements = ["ontond","ranch","perç","perc","feu","lace","oudre","ature","énèbre","umière"];

enemyWeakness = Object.values(enemyJSON).map(enemy => enemy.infos);

var elementsCount = {};

elements.forEach(element =>{
    // The g in the regular expression (meaning "g"lobal) says to search the whole string rather than just find the first occurrence
    fullText = JSON.stringify(enemyWeakness);
    var regex = new RegExp(element, 'g'); // Regex for the element in global 
    var count = (fullText.match(regex) || []).length;
    // var count = (temp.match(/is/g) || []).length;
    elementsCount[element] = count;
});
console.log("Enemies Weaknesses :")
console.log(enemyWeakness);
console.log(elementsCount);

// console.log("Pour trouver des ennemis par nom  : Object.values(enemyJSON).filter(enemy => enemy.nom.includes('rsun')");
document.querySelector('#filtre').addEventListener('change',e =>{
    document.querySelector('#filteredEnemys').innerHTML = null;
    console.log('triggered')
    enemiesList = Object.values(enemyJSON).filter(enemy => enemy.nom.toLowerCase().includes(e.target.value));
    enemiesList.forEach(enemy =>{
        liElem = document.createElement('li');
        liElem.innerText = enemy.nom + " - " + enemy.visuel3D;
        document.querySelector('#filteredEnemys').append(liElem); 
    });
});



[...document.querySelectorAll('.ennemi')].forEach( (selectEnnemi, i) =>{ 
    
    // Fill Select elements
    var option = document.createElement('option')
    option.value = "";
    selectEnnemi.append(option);

    Object.values(enemyJSON).forEach(enemy =>{
        var option = document.createElement('option')
        option.value = enemy.nom;
        option.innerText = enemy.nom;
        selectEnnemi.append(option);
    })

    // Change enemy selected

    selectEnnemi.addEventListener('change', e =>{
        enemy = e.target.value;
        indexEnemy = e.target.selectedIndex;

        loadEnemy(indexEnemy, i)

        toastNotification("Chargement de l'ennemi réussi : " + enemy);
    })
})

function loadEnemy(indexEnemy, indexElement){    

    ennemiElement = [...document.querySelectorAll('.infoEnnemi')][indexElement];

    enemyData = enemyJSON[indexEnemy];

    if(!enemyData){
        
        console.log(indexEnemy + " is not an enemy (in the list)");
        // ennemiElement.querySelector('#nom').innerText = "";
        ennemiElement.querySelector('#desc').innerText = "";
        ennemiElement.querySelector('#infos').innerText = "";
        ennemiElement.querySelector('#drop').innerText = "";
        ennemiElement.querySelector('#visuel').innerText = "";
        ennemiElement.querySelector('.icon').src = "";
        ennemiElement.querySelector('#pv').value = "";
        ennemiElement.querySelector('#pvmax').value = "";
        
        ennemiElement.querySelector('#force').value = "";
        ennemiElement.querySelector('#dexté').value = "";
        ennemiElement.querySelector('#intel').value = "";
        ennemiElement.querySelector('#charisme').value = "";
        ennemiElement.querySelector('#esprit').value = "";

        [...ennemiElement.querySelectorAll('.competence')].forEach(e => e.innerText = "");

        return;
    }


    // ennemiElement.querySelector('#nom').innerText = enemyData.nom;
    ennemiElement.querySelector('#desc').innerText = "Desc : " + enemyData.desc;
    ennemiElement.querySelector('#infos').innerText = "Infos / BP : " + enemyData.infos;
    ennemiElement.querySelector('#drop').innerText = "Drop : " + enemyData.drop;
    ennemiElement.querySelector('#visuel').innerText = enemyData.visuel3D;
    ennemiElement.querySelector('.icon').src = "http://voldre.free.fr/Eden/images/monsters/"+enemyData.visuel3D+".png";
    ennemiElement.querySelector('.icon').alt = enemyData.visuel3D.toLowerCase();
    ennemiElement.querySelector('#pv').value = enemyData.pvmax;
    ennemiElement.querySelector('#pvmax').value = enemyData.pvmax;
    
    // Stats
    ennemiElement.querySelector('#force').value = enemyData.stats.split(",")[0];
    ennemiElement.querySelector('#dexté').value = enemyData.stats.split(",")[1];
    ennemiElement.querySelector('#intel').value = enemyData.stats.split(",")[2];
    ennemiElement.querySelector('#charisme').value = enemyData.stats.split(",")[3];
    ennemiElement.querySelector('#esprit').value = enemyData.stats.split(",")[4];

    // Skills de l'ennemi
    enemyData.skills.forEach( (skill, index) =>{
        competence = [...ennemiElement.querySelectorAll('.competence')][index];
        competence.innerText = skill;
    })
}


// eqpts list
Object.values(eqptJSON).forEach(eqpt =>{

    var eqptE = document.createElement('div')
    eqptE.classList.add('eqpt')
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

    nomE.innerText = eqpt.nom;
    descE.innerText = eqpt.desc;
    effetE.innerText = eqpt.effet; // Ajout Sanofi
    montantE.innerText = eqpt.montant;
    iconeE.src = "http://voldre.free.fr/Eden/images/items/"+eqpt.icone+".png";

    eqptE.append(nomE);
    eqptE.append(descE);
    eqptE.append(effetE);
    eqptE.append(montantE);
    eqptE.append(iconeE);
    document.querySelector('.equipements').append(eqptE);
})

// Show/Hide eqpts
buttonEqpt = document.querySelector('#buttonEqpt');
buttonEqpt.addEventListener('click', ()=>{
    if(buttonEqpt.innerText == 'Afficher'){
        buttonEqpt.innerText = 'Masquer';
    }else{ buttonEqpt.innerText = 'Afficher'; }
    document.querySelector('.equipements').classList.toggle('hide');
});


// ALL SAVES 

// Allow save for users
function toggleButton(){
    if(masterJSON.allow == true){
        document.querySelector('#allowSave').style = "border: 3px solid green";
    }else{
        document.querySelector('#allowSave').style = "border: 3px solid red";
    }
}

toggleButton();
document.querySelector('#allowSave').addEventListener('click', () =>{
    masterJSON.allow = !masterJSON.allow;
    toggleButton();
    
    notes = document.querySelector('.notes').value;
    masterJSON.notes = notes;

    document.cookie = "masterJSON="+encodeURIComponent(JSON.stringify(masterJSON));
    saveWithPHP('master'); // Save it to JSON
    toastNotification('Autorisation modifiée');
})

document.querySelector('#save').addEventListener('click', () =>{
    notes = document.querySelector('.notes').value;
    masterJSON.notes = notes;
    document.cookie = "masterJSON="+encodeURIComponent(JSON.stringify(masterJSON));
    saveWithPHP('master'); // Save it to JSON
    toastNotification('Données sauvegardées');
})
document.querySelector('#saveBackup').addEventListener('click', () =>{
    $.ajax({
        url: "JDRsaveBackup.php",
        type: "post", 
        // /*
        success: function(data) {
          $('body').html(data);
        }
        // */
    })
    toastNotification('JDRpersos_backup.json sauvegardés');
})

// Create skill & Save

document.querySelector('#createSkill').addEventListener('click', ()=>{
    addSkill = document.querySelector('.addSkill');
    nom = addSkill.children[0+1].value;
    desc = addSkill.children[2+1].value;
    effet = addSkill.children[4+1].value;
    montant = addSkill.children[6+1].value;
    icone = addSkill.children[8+1].value;
    stat = addSkill.children[10+1].value;
    classe = addSkill.children[12+1].value.split(",");
    
    skillID = parseInt(Object.keys(skillsJSON).reverse()[0])+1 || 1;
    newSkill = {};
    newSkill[skillID] = {"nom":nom,"desc":desc,"effet":effet,"montant":montant,"icone":icone,"stat":stat,"classe":classe};
    console.log(newSkill)
    
    document.cookie = "skillsJSON="+encodeURIComponent(JSON.stringify(newSkill));

    saveWithPHP("skills")
    skillsJSON[skillID] = newSkill[skillID];
    toastNotification('Compétence créé');
})

// Create eqpt & Save

document.querySelector('#createEqpt').addEventListener('click', ()=>{
    addEqpt = document.querySelector('.addEqpt');
    nom = addEqpt.children[0+1].value;
    desc = addEqpt.children[2+1].value;
    effet = addEqpt.children[4+1].value;
    montant = addEqpt.children[6+1].value;
    icone = addEqpt.children[8+1].value;

    eqptID = parseInt(Object.keys(eqptJSON).reverse()[0])+1 || 1;
    newEqpt = {};
    newEqpt[eqptID] = {"nom":nom,"desc":desc,"effet":effet,"montant":montant,"icone":icone};
    console.log(newEqpt)
    
    document.cookie = "eqptJSON="+ encodeURIComponent(JSON.stringify(newEqpt));

    saveWithPHP("eqpt")
    eqptJSON[eqptID] = newEqpt[eqptID];
    toastNotification('Equipement créé');
})


// Create enemy & Save

document.querySelector('#createEnemy').addEventListener('click', ()=>{
    addEnemy = document.querySelector('.addEnemy');
    visuel3D = addEnemy.children[0+1].value;
    nom = addEnemy.children[2+1].value;
    pvmax = addEnemy.children[4+1].value;
    skills = [addEnemy.children[6+1].value,addEnemy.children[8+1].value,addEnemy.children[10+1].value,addEnemy.children[12+1].value];
    stats = addEnemy.children[14+1].value; // .split(",")
    desc = addEnemy.children[16+1].value;
    infos = addEnemy.children[18+1].value;
    drop = addEnemy.children[20+1].value;

    enemyID = parseInt(Object.keys(enemyJSON).reverse()[0])+1 || 1;
    newEnemy = {};
    newEnemy[enemyID] = {"visuel3D":visuel3D,"nom":nom, "pvmax":pvmax, "skills":skills,"stats":stats,"desc":desc,"infos":infos,"drop":drop};
    console.log(newEnemy)
    
    document.cookie = "enemyJSON="+encodeURIComponent(JSON.stringify(newEnemy));

    saveWithPHP("enemy")
    enemyJSON[enemyID] = newEnemy[enemyID];
    toastNotification('Ennemi créé');
})

// Global Save

function saveWithPHP(nameJSON){
    $.ajax({
        url: "JDRsaveFile.php",
        type: "post", 
        data: {name: nameJSON},
        /*
        success: function(data) {
          $('body').html(data);
        }
        */
    })
}


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

