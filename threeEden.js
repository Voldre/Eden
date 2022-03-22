var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

function update() {

    // Permet d'annuler l'execution automatique de la fonction animate()
    // qui a été lancé lors de l'initialisation de l'objet précédent
    cancelAnimationFrame(myrequest);

    // On supprime le canvas de l'ancien Objet 3D
    document.getElementsByTagName("canvas")[0].remove();

    init(1152, 648);
}

function init(width, height) {

    // Première valeur en paramètre de l'URL
    console.log(window.location.search.split('=')[1]);
    folder = window.location.search.split('=')[1];

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);

    mesh = new THREE.Mesh();

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 10, 10),
        new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME })
    );
    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 1.5, 20);
    light.position.set(-3, 6, -6);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);


    // Model/material loading

    // Variable dans ma liste déroulante <select>
    var myObject = document.getElementById("objets").value;
    console.log("Objet:" + myObject)

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load("http://voldre.free.fr/Eden/images/" + folder + "/" + myObject + ".mtl", function(materials) {

        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        mesh.position.y += 1;
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        objLoader.load("http://voldre.free.fr/Eden/images/" + folder + "/" + myObject + ".obj", function(mesh) {

            mesh.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            // Paramètre autorisant à update la rotation de l'objet
            mesh.matrixWorld.matrixWorldNeedsUpdate = true;
            scene.add(mesh);

            // Position de notre objet
            if (folder != "items") {
                mesh.position.set(-0.2, 0.25, -2);
            } else { mesh.position.set(0, 1.1, -3.6) }

            // Angles de notre objet
            mesh.rotation.y = 0; // Math.PI / 6;
            mesh.rotation.x = -Math.PI / 2;
            mesh.rotation.z = Math.PI / 1.4; // Pour qu'il regarde vers nous
        });

    });


    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    renderer = new THREE.WebGLRenderer();

    // Size (width, height) of the canvas
    renderer.setSize(width, height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();
}

function animate() {

    // Récupération de la requête dans une variable pour la garder en mémoire
    myrequest = requestAnimationFrame(animate);

    // Objet 3D

    if (typeof scene.children[3] != "undefined") {
        scene.children[3].rotation.z += 0.01;
        //console.log(scene.children[3]);
    }

    // ZQSD mouvement translation
    if (keyboard[90]) { // Z key
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[83]) { // S key
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[81]) { // Q key
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (keyboard[68]) { // D key
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }

    // Rotation de la caméra
    if (keyboard[37]) { // left arrow key
        $('#objets').blur();
        camera.rotation.y -= player.turnSpeed;
    }
    if (keyboard[39]) { // right arrow key
        $('#objets').blur();
        camera.rotation.y += player.turnSpeed;
    }

    // Rotation de l'objet
    if (keyboard[65]) { // A
        scene.children[3].rotation.y += 0.01;
    }
    if (keyboard[69]) { // E
        scene.children[3].rotation.y -= 0.01;
    }
    if (keyboard[38]) { // Top Arrow
        $('#objets').focus();
    }
    if (keyboard[40]) { // Bottom Arrow
        $('#objets').focus();
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