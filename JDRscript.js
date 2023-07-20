
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
    
    
    xhReq.open("GET", "./JDRgalery.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var galeryJSON = JSON.parse(xhReq.responseText);

    xhReq.open("GET", "./JDRmaster.json" + "?" + new Date().getTime(), false);
    xhReq.send(null);
    var masterJSON = JSON.parse(xhReq.responseText);
}else{
    var skillsJSON = {};
    var eqptJSON = {};
    var persosJSON = {};
    var galeryJSON = {};
    var masterJSON = {};
}

console.log('Skills JSON',skillsJSON)
console.log('Persos JSON',persosJSON)




// download(skills, 'skills.json', 'text/plain')

// Table Initialisation

const classes = ['Guerrier','Chevalier','Templier','Chev Dragon','Voleur','Assassin','Danselame','Samouraï','Chasseur','Ingénieur','Corsaire','Juge','Clerc','Barde','Shaman','Sage','Magicien','Illusionniste','Démoniste','Luminary'];
const iconsClasses = ['01','02','03','18','04','05','06','16','07','08','09','59','10','11','12','17','13','14','15','19']

const skillsInfo = ['nom','desc','effet','montant','icone','stat'];

const races = ["Humain","Ezelin","Ursun","Zumi","Anuran","Torturran","Drakai","Tuskar","Ogre"];
const poids = ["Moyen","Léger","Lourd","Léger","Moyen","Moyen","Léger","Lourd","Lourd"];


// RACES

document.querySelector('#race').addEventListener('change', e =>{
    document.querySelector('.poids').innerText = poids[races.indexOf(e.target.value)];
})

// CLASSES
document.querySelectorAll('[id^="classe"]').forEach( (classeElem, i) =>{

    var option = document.createElement('option')
    option.value = "";
    classeElem.append(option);

    classes.forEach(classe =>{
        var option = document.createElement('option')
        option.value = classe;
        option.innerText = classe;
        classeElem.append(option);
    })

    classeElem.addEventListener('change', e=>{
        selectedClasseID = classes.indexOf(e.target.value);
        if(selectedClasseID == -1){
            console.log(e.target.value + " is not a class (in the list)")
        }else{
            document.querySelector('.iconClasses').children[i].src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE"+iconsClasses[selectedClasseID]+".png";
            updateSkillsList();
        }
    })
})


// Niv
document.querySelector('#xp').addEventListener('change', e=>{
    xp = parseInt(e.target.value);

    // Update 12/06 : From lvl 5 to 10 : 150 xp instead of 100
    if(xp >= 400){
        var niv = Math.trunc((xp-400)/150)+5;
    }else{
        var niv = Math.trunc(xp/100)+1;
    }
    document.querySelector('#niv').value = niv;

    updateSkillsSlots();

    // Nouveauté 27/05 : 4eme accessoire au niveau 4
    if(niv >= 4){
        document.querySelector('.equipements').lastElementChild.previousElementSibling.classList.remove('hide');
    }else{
        document.querySelector('.equipements').lastElementChild.previousElementSibling.classList.add('hide');
    }
    // Nouveauté 27/05 : 5eme accessoire au niveau 4
    if(niv >= 8){
        document.querySelector('.equipements').lastElementChild.classList.remove('hide');
    }else{
        document.querySelector('.equipements').lastElementChild.classList.add('hide');
    }
})

// STRESS
document.querySelector('#stress').addEventListener('change', e =>{
    if(e.target.value >= 50){
    document.querySelector('#stressImpact').innerText = "(Stats -"+Math.trunc(e.target.value/50)+")";
    }else{ document.querySelector('#stressImpact').innerText = '';}
})


// COMPETENCES 
competences = document.querySelector('.skills');

[...competences.children].forEach( (competence,i) =>{
    // Selected skill
    competence.children[0].addEventListener('change', e=>{
        insertSkill(competence, e.target.value);
    });
    // Click on skill element
    competence.addEventListener('click', e =>{
        if(!e.target.classList.contains('nom')){ // If click on select element, don't show/hide the desc ?
        competence.children[4].classList.toggle('hide');
        }
    });
})

function updateSkillsSlots(){ // Display skils slots
    competences = document.querySelector('.skills');
    [...competences.children].forEach( (competence,i) =>{
        var niv = document.querySelector('#niv').value || 1;
        SlotsAvailable = Math.trunc(niv/2) + 3; // Update 17/05/23, 3 au lieu de 2, car 4 skills sur ~ 12-13 possibles
        if(i > SlotsAvailable){
            competence.classList.add('hide');
        }else{ 
            competence.classList.remove('hide');
        }
    });
}
function updateSkillsList(){ // Depending on classes
    competences = document.querySelector('.skills');
    [...competences.children].forEach(competence =>{
        // Skills list
        selectedOption = competence.children[0].value;
        removeOptions(competence.children[0]);
        var option = document.createElement('option')
        option.value = "";
        competence.children[0].append(option);

        var classeP = document.querySelector('#classeP').value;
        var classeS = document.querySelector('#classeS').value;
        Object.values(skillsJSON).forEach(skill =>{
            if(skill.classe.includes(classeP) || skill.classe.includes(classeS)){ // Si la classe est dans la liste
                var option = document.createElement('option')
                option.value = skill.nom;
                option.innerText = skill.nom;
                competence.children[0].append(option);
            }
        })
        competence.children[0].value = selectedOption;
    });
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }
 

function insertSkill(skillElement, skillName){
    selectedSkill = Object.values(skillsJSON).find(skill => skill.nom == skillName);
    if(!selectedSkill){
        
        if(skillName != ""){
            console.log(skillName+ " is not a skill (in the list)");
        }
        skillElement.children[1].innerText = "";
        skillElement.children[2].innerText = "";
        skillElement.children[3].src = "";
        skillElement.children[3].title = "";
        skillElement.children[4].innerText = "";
    }else{
        skillElement.children[1].innerText = selectedSkill.effet + " / " + selectedSkill.stat;
        skillElement.children[2].innerText = selectedSkill.montant;
        skillElement.children[3].src = "http://voldre.free.fr/Eden/images/skillIcon/"+selectedSkill.icone+".png";
        skillElement.children[3].title = selectedSkill.desc;
        skillElement.children[4].innerText = selectedSkill.desc;
    }
}



// EQUIPEMENTS
equipements = document.querySelector('.equipements');

[...equipements.children].forEach( (equipement,i) =>{
    // Selected skill
    equipement.children[0].addEventListener('change', e=>{
        insertEqpt(equipement, e.target.value);
    });
    
    // Click on skill element
    equipement.addEventListener('click', e =>{
        if(!e.target.classList.contains('nom')){ // If click on select element, don't show/hide the desc ?
            equipement.children[4].classList.toggle('hide');
        }
    });
    
})

function insertEqpt(eqptElement, eqptName){
    selectedEqpt = Object.values(eqptJSON).find(eqpt => eqpt.nom == eqptName);
    if(!selectedEqpt){
        if(eqptName != ""){
            console.log(eqptName+ " is not an eqpt (in the list)");
        }
        eqptElement.children[1].innerText = "";
        eqptElement.children[2].innerText = "";
        eqptElement.children[3].src = "";
        eqptElement.children[3].title = "";
        eqptElement.children[4].innerText = "";
    }else{
        eqptElement.children[1].innerText = selectedEqpt.effet;
        eqptElement.children[2].innerText = selectedEqpt.montant;
        eqptElement.children[3].src = "http://voldre.free.fr/Eden/images/items/"+selectedEqpt.icone+".png";
        eqptElement.children[3].title = selectedEqpt.desc;
        eqptElement.children[4].innerText = selectedEqpt.desc;
    }
}




//  LOADING
selectPerso = document.querySelector('#selectPerso');
selectedPerso = selectPerso.value;
selectedID = selectPerso.selectedIndex;

window.addEventListener('load', () =>{
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('perso')){
        selectPerso.value = "J" + urlParams.get('perso');
        // loadFiche(urlParams.get('perso'));
        selectedPerso = selectPerso.value;
        selectedID = selectPerso.selectedIndex;
    }
    loadFiche(selectedID);
})
selectPerso.addEventListener('change', e =>{
    perso = e.target.value;
    indexPerso = e.target.selectedIndex;

    loadFiche(indexPerso)

    toastNotification('Chargement réussi de ' + perso);
})

function loadFiche(indexPerso){
    document.querySelector('.perso').id = indexPerso;

    persoData = persosJSON[indexPerso];

    if(!persoData) return;
    

    document.querySelector('#nom').value = persoData.nom;
    document.querySelector('#race').value = persoData.race;
    document.querySelector('#classeP').value = persoData.classeP;
    document.querySelector('#classeS').value = persoData.classeS;
    document.querySelector('#xp').value = persoData.xp;
    document.querySelector('#niv').value = persoData.niv;
    document.querySelector('#pv').value = persoData.pv;
    document.querySelector('#pvmax').value = persoData.pvmax;

    document.querySelector('#stress').value = persoData.stress;

    document.querySelector('#pp').src = persoData.pp;
    document.querySelector('#force').value = persoData.force;
    document.querySelector('#dexté').value = persoData.dexté;
    document.querySelector('#intel').value = persoData.intel;
    document.querySelector('#charisme').value = persoData.charisme;
    document.querySelector('#esprit').value = persoData.esprit;
    
    document.querySelector('#forceB').value = persoData.forceB;
    document.querySelector('#dextéB').value = persoData.dextéB;
    document.querySelector('#intelB').value = persoData.intelB;
    document.querySelector('#charismeB').value = persoData.charismeB;
    document.querySelector('#espritB').value = persoData.espritB;

    document.querySelector(".notes").value = persoData.notes;
    
    // Classes du perso
    classePID = classes.indexOf(persoData.classeP);
    classeSID = classes.indexOf(persoData.classeS);
    document.querySelector('.iconClasses').children[0].src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE"+iconsClasses[classePID]+".png";
    document.querySelector('.iconClasses').children[1].src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE"+iconsClasses[classeSID]+".png";
    updateSkillsList();

    updateSkillsSlots();
    // Nouveauté 27/05 : 4eme accessoire si le perso est au moins niveau 4
    if(persoData.niv >= 4){
        document.querySelector('.equipements').lastElementChild.classList.remove('hide');
    }else{
        document.querySelector('.equipements').lastElementChild.classList.add('hide');
    }

    // Skills du perso
    JSON.parse(persoData.skills).forEach( (skill, index) =>{
        competence = [...document.querySelector('.skills').children][index];
        competence.children[0].value = skill; // Object.values(competence.children[0].options).find(option => option.value == skill.nom);
        insertSkill(competence,skill);
    })


    // Equipements du perso
    JSON.parse(persoData.eqpts).forEach( (eqpt, index) =>{
        equipement = [...document.querySelector('.equipements').children][index];
        equipement.children[0].value = eqpt; // Object.values(competence.children[0].options).find(option => option.value == skill.nom);
        insertEqpt(equipement,eqpt);
    })

    // Inventaire du perso
    document.querySelector(".inventaire").value = persoData.inventaire,
    document.querySelector('.poids').innerText = poids[races.indexOf(persoData.race)];

    document.querySelector("#argent").value = persoData.argent

    document.querySelector(".personnalité").value = persoData.personnalite,
    document.querySelector(".background").value = persoData.background
}


//  DOWNLOAD as FILE
// Function to download data to a file
document.querySelector('#download').addEventListener('click', () =>{
    download(JSON.stringify(persosJSON[document.querySelector('.perso').id]), selectedPerso+'.json', 'text/plain')
});

function download(data, filename, type) {
    xhReq.open("POST", "http://voldre.free.fr/Eden/"+filename, true);
    xhReq.send(data);
    
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
    
}
// Download as screenshot under body
/*
document.querySelector("#screenshot").addEventListener('click',() =>{
    html2canvas(document.querySelector('.perso')).then(function(canvas) {
    // Export the canvas to its data URI representation
    var base64image = canvas.toDataURL("image/png");

    // Open the image in a new window
    // window.open(base64image , "_blank");
    var screenshot = document.createElement('img');
    screenshot.src = "data:"+base64image;
    // screenshot.classList.add('screen');
    document.body.append(screenshot)
    });
});
*/


// PROFIL PICTURE

// Change Profil Picture
document.querySelector('#pp').addEventListener('click',() =>{
    // console.log('pp clicked')
    document.querySelector('#galerie').classList.toggle('hide');
})
document.querySelector('#galerie').addEventListener('click', () =>{
    document.querySelector('.galerie').classList.remove('hide');
})

// Fill galery
galeryJSON.forEach(pic =>{
    if(pic.includes('.jpg') || pic.includes('.png')){
        imgE = document.createElement('img');
        imgE.src = './images/jdrgalerie/'+pic;
        document.querySelector('.galerie').append(imgE);
    }
})

// Choosed picture
document.querySelector('.galerie').addEventListener('click', e =>{
    if(!e.target.src){
        document.querySelector('.galerie').classList.add('hide');
        return;

    }
    if(e.target.src.includes('.jpg') || e.target.src.includes('.png')){
        document.querySelector('#pp').src = e.target.src;
        document.querySelector('.galerie').classList.add('hide');
        document.querySelector('.galerie').classList.add('hide');
    }
})



// ALL SAVE

// Save persos

document.querySelector("#save").addEventListener('click',() =>{
    if(!masterJSON.allow){
        toastNotification('Les sauvegardes sont bloquées par le MJ');
        return;
    }
    savePerso();
    console.log("saveFiche() done : JDRsaveFile.php executed")
    
    saveWithPHP("persos");
    toastNotification('Sauvegarde effectuée');
})

function savePerso(){

    skillsData = []
    document.querySelectorAll('.skill').forEach(competence =>{
        nom = competence.children[0].value;
        skillsData.push(nom);
    })

    eqptsData = []    
    equipements = document.querySelector('.equipements');
    [...equipements.children].forEach( (equipement,i) =>{
        nom = equipement.children[0].value;
        eqptsData.push(nom);
    })

    // console.log(eqptsData)
    skillsStringified = JSON.stringify(skillsData);
    eqptsStringified = JSON.stringify(eqptsData);

    // same for equipments

    persosJSON = persosJSON || {};

    persosJSON[document.querySelector('.perso').id] = {
        "nom":document.querySelector('#nom').value,
        "race":document.querySelector('#race').value,
        "classeP":document.querySelector('#classeP').value,
        "classeS":document.querySelector('#classeS').value,
        "xp":document.querySelector('#xp').value,
        "niv":document.querySelector('#niv').value,
        "pv":document.querySelector('#pv').value,
        "pvmax":document.querySelector('#pvmax').value,
        
        "stress":document.querySelector('#stress').value,

        "pp":document.querySelector('#pp').src,
        "force":document.querySelector('#force').value,
        "dexté":document.querySelector('#dexté').value,
        "intel":document.querySelector('#intel').value,
        "charisme":document.querySelector('#charisme').value,
        "esprit":document.querySelector('#esprit').value,
        
        "forceB":document.querySelector('#forceB').value,
        "dextéB":document.querySelector('#dextéB').value,
        "intelB":document.querySelector('#intelB').value,
        "charismeB":document.querySelector('#charismeB').value,
        "espritB":document.querySelector('#espritB').value,
        
        "skills": skillsStringified,
        "eqpts": eqptsStringified,
        "inventaire": document.querySelector(".inventaire").value,
        "argent": document.querySelector("#argent").value,
        "personnalite": document.querySelector(".personnalité").value,
        "background": document.querySelector(".background").value,
        "notes": document.querySelector(".notes").value
    };

    console.log(persosJSON)
    
    newPerso = {};
    newPerso[document.querySelector('.perso').id] = persosJSON[document.querySelector('.perso').id];
    console.log(newPerso)

    // Save to JSON...
    // Only store persosJSON current user (perso id)    
    document.cookie = "persosJSON="+encodeURIComponent(JSON.stringify(newPerso))+"; SameSite=Strict";

    // alert('Fiche sauvegardé sous forme de cookie avec succès')
}



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


$.ajax({
    url: "JDRgalery.php",
    type: "post", 
})


// Show/Hide other pages of Eden
buttonIframe = document.querySelector('#buttonIframe');
buttonIframe.addEventListener('click', ()=>{
    if(buttonIframe.innerText == 'Afficher le site'){
        buttonIframe.innerText = 'Masquer le site';
    }else{ buttonIframe.innerText = 'Afficher le site'; }
    document.querySelector('iframe').classList.toggle('hide');
});



// Toasts 
const params = new URLSearchParams(window.location.search)
/*
if(params.has('state')){
    var link = document.createElement("a");
    link.innerText = "Cliquez ici"
    link.href = "/"

    if(params.get('state') == "subscribed"){


        toastNotification("Inscription réussie, envoi du mail de confirmation ...",12000);
        setTimeout(() => {
            toastNotification('Mail de confirmation envoyé',40000);
        }, 5000);
    }
}
*/


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

// Modal (Dialog) des informations de bases des labels

labelsDescription = {'force':"Permet d'utiliser des attaques lourdes, de pousser, de soulever.<br/>Permet de bloquer des coups physiques (Dé/2) <br/><br/> Les stats sont limitées à 17, et 17 (+1) avec buff.",
             'dexté':"Permet d'utiliser des attaques agiles et rapide, de se mouvoir, courir.<br/>Permet d'esquiver des attaques mono-cible (Dé/2) <br/><br/> Les stats sont limitées à 17, et 17 (+1) avec buff.",
             'intel':"Permet d'utiliser des attaques magiques, de tester son érudition, sa réflexion.<br/>Permet de bloquer des coups magiques (Dé/2) <br/><br/> Les stats sont limitées à 17, et 17 (+1) avec buff.",
             'charisme':"Permet d'intéragir avec les autres personnes dans différents contexte :<br/> éloquence, persuasion, négociation, menace, distraction, ... <br/><br/> Les stats sont limitées à 17, et 17 (+1) avec buff.",
             'esprit': "Permet d'utiliser des buffs, des débuffs et des invocations.<br/> Permet aussi de résister (Dé/2) à des envoûtements (contrôle d'esprit, peur) <br/><br/> Les stats sont limitées à 17, et 17 (+1) avec buff.",
             'niv':"Augmente automatiquement tous les 100 points d'expériences du Niveau 1 à 5, puis tous les 150.<br/> Tous les niveaux paire (2,4,6,8), vous obtenez une compétence.",
             'pv':"Statistique des PV, augmente de 5 par niveau.",
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
