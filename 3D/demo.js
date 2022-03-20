var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

function update() {

    // Permet d'annuler l'execution automatique de la fonction animate()
    // qui a été lancé lors de l'initialisation de l'objet précédent
    cancelAnimationFrame(myrequest);

    // On supprime le canvas de l'ancien Objet 3D
    document.getElementsByTagName("canvas")[0].remove();

    init();
}

function init() {
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

    var textureLoader = new THREE.TextureLoader();
    crateTexture = textureLoader.load("crate0_diffuse.jpg");
    crateBumpMap = textureLoader.load("crate0_bump.jpg");
    crateNormalMap = textureLoader.load("crate0_normal.jpg");

    crate = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: crateTexture,
            bumpMap: crateBumpMap,
            normalMap: crateNormalMap
        })
    );
    scene.add(crate);
    crate.position.set(2.5, 3 / 2, 2.5);
    crate.receiveShadow = true;
    crate.castShadow = true;

    // Model/material loading!

    // Variable dans ma liste déroulante <select>
    var myObject = document.getElementById("objets").value;

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load("http://voldre.free.fr/Eden/3D/" + myObject + ".mtl", function(materials) {

        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        mesh.position.y += 1;
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        objLoader.load("http://voldre.free.fr/Eden/3D/" + myObject + ".obj", function(mesh) {

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
            mesh.position.set(-2, 1, -3);

            // Angles de notre objet
            mesh.rotation.y = Math.PI / 7;
            mesh.rotation.x = -Math.PI / 2;
        });

    });


    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();
}

function animate() {

    // Récupération de la requête dans une variable pour la garder en mémoire
    myrequest = requestAnimationFrame(animate);

    // Objet 3D

    scene.children[4].rotation.z += 0.01;
    //console.log(scene.children[4]);

    crate.rotation.y += 0.01;

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
        camera.rotation.y -= player.turnSpeed;
    }
    if (keyboard[39]) { // right arrow key
        camera.rotation.y += player.turnSpeed;
    }

    // Rotation de l'objet
    if (keyboard[65]) { // A
        scene.children[4].rotation.y += 0.01;
    }
    if (keyboard[69]) { // E
        scene.children[4].rotation.y -= 0.01;
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

window.onload = init;