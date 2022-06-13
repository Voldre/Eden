var scene, camera, renderer, mesh, mesh2;
var meshFloor, ambientLight, light;

var keyboard = {};
var player = { height: 1.6, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;


var myrequest = false;

THREE.Cache.enabled = true; // VD 04/06/2022 : Alléger les chargements

function update() {
    
    // 10/06/22 - Update : window.stop() arrête toutes les requêtes
    // Cela permet donc d'annuler les anciens chargements encore en cours
    window.stop();
    player = { height: 1.6, speed: 0.2, turnSpeed: Math.PI * 0.02 };
    // Permet d'annuler l'execution automatique de la fonction animate()
    // qui a été lancé lors de l'initialisation de l'objet précédent
    cancelAnimationFrame(myrequest);

    // On supprime le canvas de l'ancien Objet 3D
    if(document.getElementsByTagName("canvas")[0]){
    document.getElementsByTagName("canvas")[0].remove();
    }
    myrequest = true;
    
    init();
    //init(1152, 648);
}

function myObjectInit(){
    if(typeof window.location.search.split("&")[1] != "undefined"){
        return window.location.search.split("&")[1].split('=')[1];
    }else{ return null; }
    
}

function read_cookie(key)
{
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}

function init() {

    /* Update 09.06.22 - Ajout d'un toggle permettant
    de choisir si on veut ou non afficher l'arrière plan.
    Car il met un peu + de temps à se générer et avec plein de
    designs c'est vite désagréable, mais pas les maps  */ 
    if(document.getElementById("backgroundToggle").checked) {
        document.cookie = "backgroundState=checked";
    } else{ document.cookie = "backgroundState="; }

    // Première valeur en paramètre de l'URL
    //console.log(window.location.search.split('=')[1]);
    folder = window.location.search.split('=')[1];
    
    if(typeof folder == "undefined"){
            // 11.06.22 - Pour l'UI, on retire le choix de langue sur les designs
            throw new Error("En attente de la sélection");
    }else{
        document.getElementById("google_translate_element").style.display = "none";
    }
    folder = folder.split("&")[0];
    if(folder == "maps"){
        player.speed = 1;
        var myObject =  myObjectInit();
        // console.log(myObject);
        if(!myrequest && (myObject == "" || myObject == null) ){
            console.log("Présence sur les cartes de donjons, détecté.");
            throw new Error("En attente du choix de l'utilisateur");
        }
    }

    scene = new THREE.Scene();  
    /* **************************************************
    Le secret pour afficher le background (qui est éloigné?)
    ==> Il faut aggrandir la distance d'affichage !
    Car là elle est trop petite et du coup on voit rien sauf quand
    on est collé dessus, c'est pas le but. 5000 >> 1000
    ************************************************** */
    camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 5000);

    mesh = new THREE.Mesh();

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 10, 10),
        new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME })
    );
    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);
                                                // 0.4
    ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 1.5, 20);
    light.position.set(-3, 6, -6);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);

    /*
    
    // Add Background 05/06/2022
    function setBackground(scene, backgroundImageWidth, backgroundImageHeight) {
        var windowSize = function(withScrollBar) {
            var wid = 0;
            var hei = 0;
            if (typeof window.innerWidth != "undefined") {
                wid = window.innerWidth;
                hei = window.innerHeight;
            }
            else {
                if (document.documentElement.clientWidth == 0) {
                    wid = document.body.clientWidth;
                    hei = document.body.clientHeight;
                }
                else {
                    wid = document.documentElement.clientWidth;
                    hei = document.documentElement.clientHeight;
                }
            }
            return { width: wid - (withScrollBar ? (wid - document.body.offsetWidth + 1) : 0), height: hei };
        };
    
        if (scene.background) {
    
            var size = windowSize(true);
            var factor = (backgroundImageWidth / backgroundImageHeight) / (size.width / size.height);
    
            scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
            scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
    
            scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
            scene.background.repeat.y = factor > 1 ? 1 : factor;
        }
    }
    var img = new Image();
    img.onload = function () {
        scene.background = new THREE.TextureLoader().load(img.src);
        setBackground(scene, img.width, img.height);
    };
    img.src = "background.jpg";
    */


    // Model/material loading

    // Variable potentiellement envoyé dans l'URL
    var myObject = myObjectInit();
    if(myObject == null || myObject == ""){
        // Variable dans ma liste déroulante <select>
        myObject = document.getElementById("objets").value;
    }else{ document.getElementById("objets").value = myObject; }
    document.getElementById("objets")

    //console.log("Objet:" + myObject)

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setMaterialOptions({ ignoreZeroRGBs: true });

    // console.log(mtlLoader);
    mtlLoader.load("http://voldre.free.fr/Eden/images/3D/" + folder + "/" + myObject + ".mtl", function(materials) {
       
        //console.log(materials);
        var listWrongMaterials = [];
        for(var material in materials.materialsInfo){
            // Gestion des 3 cas possibles d'absence de textures : 1) "chemin sans arrivé",  2) rien de déclaré,  3) textures ""
            if(materials.materialsInfo[material]["map_kd"] == "images/3D/map/" || typeof materials.materialsInfo[material]["map_kd"] == "undefined" || materials.materialsInfo[material]["map_kd"] == "" ){
                listWrongMaterials.push(materials.materialsInfo[material]["name"]);
            }
        }
        console.log(listWrongMaterials);
        /*
        var listLiensTextures = [];
        for(var material in materials.materialsInfo){
            if(materials.materialsInfo[material]["map_kd"] != null){
                listLiensTextures.push(materials.materialsInfo[material]["map_kd"]);
            }
        }
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
          }
        listLiensTextures = listLiensTextures.filter(onlyUnique);
        */

        if(folder != "map"){
            // materials.preload();
        }
        
        // Ajout VD - 04/06/2022 - suivi du loading :
        console.log('On loading ...');

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                document.getElementById("loading").innerHTML = "Chargement : " + Math.round(percentComplete, 2) + "%";}        };
        
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        // console.log(materials);
        
        mesh.position.y += 1;
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        objLoader.load("http://voldre.free.fr/Eden/images/3D/" + folder + "/" + myObject + ".obj", function(mesh) {
            console.log('Loaded : ' + myObject );
            document.getElementById("loading").innerHTML = null;
            
            mesh.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
                
            /********* Most important update *********
             07/06/2022 :
             Adding alphaTest and transparent parameters
             in order to make transparent part of PNG effective !
             If not, the transparent part will render black or white
             Examples here : "Tools/Issue with the PNG transparent - alpha.png"
             12/06/2022 - (the best part of update) :
             Analyze of each material and their "map kd" (their PNG texture)
             in order to find which materials have no texture.
             Because I understood that all "white/blue/purple" walls were
             materials built in the game to block the player. As a real wall.
             And so, these materials got no texture but exist !
             That's not a "miss conversion", that's intended transparent !
             But the NIF to OBJ conversion, by default, show them ...
             ... even if they have no texture", and that's on what I have worked.
             I checked PNG for all materials, and if I find no one, "visibile = false"
             ******************************************/
            var children = mesh.children;                
            console.log(children)
            for ( var i = 0 ; i < children.length; i++ ) {
                children[i].castShadow = true;
                // Make PNG transparence efficient
                children[i].material.alphaTest = 0.5;
                children[i].material.transparent = true;
                // Check if this material are in my "black list" of materials
                if(listWrongMaterials.includes(children[i].material.name) ){
                    mesh.children[i].visible = false; // If yes, I hide it for real, like in the game
                }
            }


            // Paramètre autorisant à update la rotation de l'objet
            mesh.matrixWorld.matrixWorldNeedsUpdate = true;
            scene.add(mesh);

            
            // 06/06/2022 - Ajout du background d'Eden
            const date = new Date(); 
            currentHours = date.toLocaleTimeString({hour: '2-digit',   hour12: false, timeZone: 'Europe/Paris' }).split(":")[0];
        
            if(currentHours <= 5){
                myBG = "A402";
            }else if(currentHours <= 8){
                myBG = "A102";
            }else if(currentHours <= 11){
                myBG = "D502";
            }else if(currentHours <= 15){
                myBG = "G602";
            }else if(currentHours <= 17){
            myBG = "G603";
            }else if(currentHours <= 18){
            myBG = "D302";
            }else if(currentHours <= 19){
            myBG = "A302";
            }else if(currentHours <= 20){
            myBG = "C301";
            }else if(currentHours <= 21){
            myBG = "C402";
            }else{ myBG = "G604";}

            // 09/06 -- On n'affiche le fond d'écran que si c'est voulu
            if(read_cookie('backgroundState') == "checked"){
                mesh2 = new THREE.Mesh();   
                mtlLoader.load("http://voldre.free.fr/Eden/images/3D/maps/"+myBG+".mtl", function(materials2) {      
                    objLoader.setMaterials(materials2);
                    objLoader.load("http://voldre.free.fr/Eden/images/3D/maps/"+myBG+".obj", function(mesh2){
                        scene.add(mesh2);
                        mesh2.rotation.x = -Math.PI/2;    
                    });
                });
            }

            // Position de notre objet
            if(folder == "maps"){ // -520, 18, 80
                mesh.position.set(280, -28, 5);
            }else if (folder == "items") {
                mesh.position.set(0, 1, -3.3);
            }else {mesh.position.set(-0.2, 0.25, -0.8); }

            // Angles de notre objet
            mesh.rotation.y = 0; // Math.PI / 6;
            mesh.rotation.x = -Math.PI / 2;
            if(folder != "maps"){
            mesh.rotation.z = Math.PI / 1.4; // Pour qu'il regarde vers nous
            }else{ mesh.rotation.z = Math.PI / 1; }
        }, onProgress);

    });

    if(folder != "house"){
        camera.position.set(0, player.height, -5);
        camera.lookAt(new THREE.Vector3(0, player.height, 0));

    }else{ 
        camera.position.set(0, player.height+3.2, -17); 
        camera.lookAt(new THREE.Vector3(0, player.height+3, 0));
    }

    renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});

    /* Size (width, height) of the canvas
    11.06.22 - UI Improvement : Adaptation du canvas selon l'écran 
    seulement, donc plus besoin de paramètre pour init() */
    // window.innerWidth = Taille fenêtre, window.screen.width = Taille écran
    renderer.setSize(window.innerWidth*0.98, window.innerWidth*0.46);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.getElementById('canvasPosition').appendChild(renderer.domElement);

    animate();
}

$("#prev").on("click",function(){ 
    $("#objets > option:selected")
    .prop("selected", false)
    .prev()
    .change()
    .blur()
    .prop("selected", true);});
$("#next").on("click",function(){ 
    $("#objets > option:selected")
    .prop("selected", false)
    .next()
    .change()
    .blur()
    .prop("selected", true);});

function animate() {

    // Récupération de la requête dans une variable pour la garder en mémoire
    myrequest = requestAnimationFrame(animate);

    // Objet 3D

    if (typeof scene.children[3] != "undefined" && folder != "maps") {
        scene.children[3].rotation.z += 0.003;
        //console.log(scene.children[3]);
    }

    function up(){
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    function right(){
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }
    function down(){
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;

    }
    function left(){
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    function turnLeft(){
        camera.rotation.y -= player.turnSpeed/1.3;
    }
    function turnRight(){
        camera.rotation.y += player.turnSpeed/1.3;
    }
    $("#up").on("click",function(){player.speed = 0.001; up();});
    $("#down").on("click",function(){player.speed = 0.001; down();});
    $("#left").on("click",function(){player.speed = 0.001; left();});
    $("#right").on("click",function(){player.speed = 0.001; right();});
    $("#turnLeft").on("click",function(){player.turnSpeed = 0.001; turnLeft();});
    $("#turnRight").on("click",function(){player.turnSpeed = 0.001; turnRight();});
  
    // ZQSD mouvement translation
    if (keyboard[90]) { // Z key
        if($('#objets').is(":focus")){
            $('#objets').blur();
        }
        up();
    }
    if (keyboard[83]) { // S key
        if($('#objets').is(":focus")){
            $('#objets').blur();
        }
        down();
       
    }
    if (keyboard[81]) { // Q key
        left();
    }
    if (keyboard[68]) { // D key
        right();
   }

    //console.log(camera.position);

    // Rotation de la caméra
    if (keyboard[37]) { // left arrow key
        if($('#objets').is(":focus")){
            $('#objets').blur();
        }
        camera.rotation.y -= player.turnSpeed/1.3;
    }
    if (keyboard[39]) { // right arrow key
        if($('#objets').is(":focus")){
            $('#objets').blur();
        }
        camera.rotation.y += player.turnSpeed/1.3;
    }

    // Rotation de l'objet
    if (keyboard[65]) { // A
        scene.children[3].rotation.y += 0.01;
    }
    if (keyboard[69]) { // E
        scene.children[3].rotation.y -= 0.01;
    }
    if (keyboard[38]) { // Top Arrow
        if(folder == "maps"){
            camera.position.y += player.speed;
        }else{
        $('#objets').focus();
        }
    }
    if (keyboard[40]) { // Bottom Arrow
        if(folder == "maps"){
            camera.position.y -= player.speed;
        }else{
        $('#objets').focus();
        }
    }
    if(keyboard[16]){
        if(player.speed == 1){
        player.speed = 2;
        }else{ player.speed = 1;}
    }

    if (keyboard[161] || keyboard[48]) { // "!" ou "0", 04/06/2022 - Kill du programme
        console.log("Programme stoppé");
        cancelAnimationFrame(myrequest);
        window.stop();

        this.renderer.domElement.addEventListener('dblclick', null, false); //remove listener to render
        this.scene = null;
        this.projector = null;
        this.camera = null;
        this.controls = null;
        // On supprime le canvas de l'ancien Objet 3D
        document.getElementsByTagName("canvas")[0].remove();
    }

    renderer.render(scene, camera);
}

function keyDown(event) {
    keyboard[event.keyCode] = true;
}

function keyUp(event) {
    keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

//window.onload = init(1152, 648);

  