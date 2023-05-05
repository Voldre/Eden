
// JSON Initialisation
var xhReq = new XMLHttpRequest();

console.log(window.location.href)
if(window.location.href.includes('http')){
    xhReq.open("GET", "./JDRskills.json", false);
    xhReq.send(null);
    var skillsJSON = JSON.parse(xhReq.responseText);
    
    xhReq.open("GET", "./JDReqpt.json", false);
    xhReq.send(null);
    var eqptJSON = JSON.parse(xhReq.responseText);

    xhReq.open("GET", "./JDRpersos.json", false);
    xhReq.send(null);
    var persosJSON = JSON.parse(xhReq.responseText);
    
    
    xhReq.open("GET", "./JDRgalery.json", false);
    xhReq.send(null);
    var galeryJSON = JSON.parse(xhReq.responseText);

}else{
    var skillsJSON = skills;
    var eqptJSON = {};
    var persosJSON = {};
    var galeryJSON = {};
}

console.log('Skills JSON',skillsJSON)
console.log('Persos JSON',persosJSON)


// download(skills, 'skills.json', 'text/plain')
// var skillsJSON = Object.values(skills) // Remove all keys

// Table Initialisation

const classes = ['Guerrier','Chevalier','Templier','Chev Dragon','Voleur','Assassin','Danselame','Samouraï','Chasseur','Ingénieur','Corsaire','Juge','Clerc','Barde','Shaman','Sage','Magicien','Illusioniste','Démoniste','Luminary'];
const iconsClasses = ['01','02','03','18','04','05','06','16','07','08','09','59','10','11','12','17','13','14','15','19']

const skillsInfo = ['nom','desc','effet','montant','icone','stat'];


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
            // nom, desc, effet, montant, icone
            // classeElem.children[1].innerText = selectedSkill.desc;
            document.querySelector('.iconClasses').children[i].src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE"+iconsClasses[selectedClasseID]+".png";

            updateSkillsList();
        }
    })
})


// Niv
document.querySelector('#xp').addEventListener('change', e=>{
    xp = parseInt(e.target.value);
    console.log(xp)
    var niv = Math.trunc(xp/100)+1;
    document.querySelector('#niv').value = niv;

    updateSkillsSlots();
})


// COMPETENCES 
competences = document.querySelector('.skills');

[...competences.children].forEach( (competence,i) =>{
    var niv = document.querySelector('#niv').value || 1;
    if(i > niv){
        competence.classList.add('hide');
    }else{ 
        competence.classList.remove('hide');
    }
    /*
    // Skills list

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
    */

    // Selected skill
    competence.children[0].addEventListener('change', e=>{
        // console.log(e.target.value)
        insertSkill(competence, e.target.value);
    })
})

function updateSkillsSlots(){
    competences = document.querySelector('.skills');
    [...competences.children].forEach( (competence,i) =>{
        // Display skils slots
        var niv = document.querySelector('#niv').value || 1;
        if(i > niv){
            competence.classList.add('hide');
        }else{ 
            competence.classList.remove('hide');
        }
    });
}
function updateSkillsList(){
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

function insertSkill(skillElement, skillName){
    selectedSkill = Object.values(skillsJSON).find(skill => skill.nom == skillName);
    if(!selectedSkill){
        console.log(skillName+ " is not a skill (in the list)")
    }else{
        skillElement.children[1].innerText = selectedSkill.effet + " / " + selectedSkill.stat;
        skillElement.children[2].innerText = selectedSkill.montant;
        skillElement.children[3].src = "http://voldre.free.fr/Eden/images/skillIcon/"+selectedSkill.icone+".png";
        skillElement.children[3].title = selectedSkill.desc;
    }
}


//  LOADING
window.addEventListener('load', () =>{loadFiche(0)})
selectPerso = document.querySelector('#selectPerso');
selectedPerso = selectPerso.value;

selectPerso.addEventListener('change', e =>{
    perso = e.target.value
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
    document.querySelector('#pp').src = persoData.pp;
    document.querySelector('#force').value = persoData.force;
    document.querySelector('#dexté').value = persoData.dexté;
    document.querySelector('#intel').value = persoData.intel;
    document.querySelector('#charisme').value = persoData.charisme;
    // + la dernière stat

    // Classes du perso
    classePID = classes.indexOf(persoData.classeP);
    classeSID = classes.indexOf(persoData.classeS);
    document.querySelector('.iconClasses').children[0].src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE"+iconsClasses[classePID]+".png";
    document.querySelector('.iconClasses').children[1].src = "http://voldre.free.fr/Eden/images/skillIcon/xoBIamgE"+iconsClasses[classeSID]+".png";
    updateSkillsList();
    updateSkillsSlots();

    // Skills du perso
    JSON.parse(persoData.skills).forEach( (skill, index) =>{
        // console.log(skill)
        competence = [...document.querySelector('.skills').children][index];

        // console.log(Object.values(competence.children[0].options))
        competence.children[0].value = skill; // Object.values(competence.children[0].options).find(option => option.value == skill.nom);
        
        insertSkill(competence,skill);
        /*
        competence.children[1].innerText = skill.effet;
        competence.children[2].innerText = skill.montant;
        competence.children[3].src = "http://voldre.free.fr/Eden/images/skillIcon/"+skill.icone+".png";
        competence.children[3].title = skill.desc;
        */
    })

    // Equipements du perso
    
    // Inventaire du perso
    document.querySelector(".inventaire").value = persoData.inventaire,
    document.querySelector("#argent").value = persoData.argent

    // "personnalité": document.querySelector(".personnalité").value,
    // "background": document.querySelector(".background").value
}


//  DOWNLOAD as FILE
// Function to download data to a file
function download(data, filename, type) {
    xhReq.open("POST", "http://voldre.free.fr/Eden/"+filename, true);
    xhReq.send(data);
    /*
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
    */
}
// Download as screenshot under body
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


// PROFIL PICTURE

// Change Profil Picture
document.querySelector('#pp').addEventListener('click',() =>{
    console.log('pp clicked')
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
    savePerso();
    console.log("saveFiche() done")
    console.log('JDRsaveFile.php executed')
    
    saveWithPHP("persos");
    toastNotification('Sauvegarde effectuée');
})

function savePerso(){

    skillsData = []
    document.querySelectorAll('.skill').forEach(competence =>{
        nom = competence.children[0].value;

        skillsData.push(nom);
        /*
        effet = competence.children[1].innerText;
        montant = competence.children[2].innerText;
        icone = competence.children[3].src.replace("http://voldre.free.fr/Eden/images/skillIcon/","");
        icone = icone.replace(".png","");
        desc = competence.children[3].title
        skillsData.push({"nom":nom,"desc":desc,"effet":effet,"montant":montant,"icone":icone});
        */
    })

    console.log(skillsData)
    skillsStringified = JSON.stringify(skillsData);

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
        "pp":document.querySelector('#pp').src,
        "force":document.querySelector('#force').value,
        "dexté":document.querySelector('#dexté').value,
        "intel":document.querySelector('#intel').value,
        "charisme":document.querySelector('#charisme').value,
        // "--":document.querySelector('#--').value,
        "skills": skillsStringified,
        // "equipments": equipmentsStringified,
        "inventaire": document.querySelector(".inventaire").value,
        "argent": document.querySelector("#argent").value,
        "personnalité": document.querySelector(".personnalité").value,
        "background": document.querySelector(".background").value
    };

    console.log(persosJSON)

    // Save to JSON...

    document.cookie = "persosJSON="+JSON.stringify(persosJSON);

    // alert('Fiche sauvegardé sous forme de cookie avec succès')
}


// Create skill & Save

document.querySelector('#createSkill').addEventListener('click', ()=>{
    addSkill = document.querySelector('.addSkill');
    nom = addSkill.children[0].value;
    desc = addSkill.children[2].value;
    effet = addSkill.children[4].value;
    montant = addSkill.children[6].value;
    icone = addSkill.children[8].value;
    stat = addSkill.children[10].value;
    classe = [addSkill.children[10].value];

    skillID = parseInt(Object.keys(skillsJSON).reverse()[0])+1
    newSkill = { skillID : {"nom":nom,"desc":desc,"effet":effet,"montant":montant,"icone":icone,"stat":stat,"classe":classe}};
    console.log(newSkill)
    
    document.cookie = "skillsJSON="+JSON.stringify(newSkill);

    saveWithPHP("skills")
})



// Global Save

function saveWithPHP(nameJSON){
    $.ajax({
        url: "JDRsaveFile.php",
        type: "post", 
        data: {name: nameJSON},/*
        success: function(data) {
          $('body').html(data);
        }*/
    })
}


$.ajax({
    url: "JDRgalery.php",
    type: "post", 
})




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

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }
 