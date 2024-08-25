import { isTextInText, readCookie } from "./utils.js";
import { mapsJSON } from "./JDRstore.js";

// 3D Variables
let scene, camera, renderer;

// Events Variables

let keyboard = {};

let onTouch = false;
let touchKey = null;

// URL Parameters

const urlParams = new URLSearchParams(window.location.search);

const folder = urlParams.get("data");
const onMap = folder === "maps";

// Evolutive Variables

const objetsE = document.getElementById("objets");
const colorsE = document.getElementById("colors");
const canvasE = document.getElementById("canvasPosition");
let myObject;

const initObject = () => {
  if (onMap) {
    if (!objetsE.value) {
      // Default mapID
      let mapName = mapID;
      while (mapName.length < 3) {
        mapName = "0" + mapName;
      }

      const mapObject = "S" + mapName;
      objetsE.value = mapObject;
      return mapObject;
    }
    // Ex : 41 from S041
    mapID = parseInt(objetsE.value.slice(1));
    return objetsE.value;
  } else {
    return objetsE.value;
  }
};

let mapID = urlParams.get("map");
let animationId;

const updatePlayer = (factor = 1) => {
  return {
    height: 1.6,
    factor: factor,
    speed: 0.1 * factor * (onMap ? 4 : 1),
  };
};

let player = updatePlayer(1);

// THREE Global Parameters

let USE_WIREFRAME = false;

THREE.Cache.enabled = true; // VD 04/06/2022 : Alléger les chargements
const manager = new THREE.LoadingManager();
manager.onLoad = function () {
  console.log("Tous les fichiers ont été chargés avec succès");
  // console.log(THREE.Cache.files);
};

// Global Parameters

window.performance.setResourceTimingBufferSize(2000);
// window.performance.getEntriesByType("resource")

// 11.06.22 - Pour l'UI, on retire le choix de langue sur les designs
document.getElementById("google_translate_element").style.display = folder ? "none" : "inline";

// #region update()

function update() {
  // 10/06/22 - Update : window.stop() arrête toutes les requêtes
  // Cela permet donc d'annuler les anciens chargements encore en cours
  window.stop();

  // Permet d'annuler l'execution automatique de la fonction animate()
  // qui a été lancée lors de l'initialisation de l'objet précédent
  cancelAnimationFrame(animationId);

  // On supprime le canvas de l'ancien Objet 3D
  // if(document.getElementsByTagName("canvas")[0]){
  document.getElementsByTagName("canvas")[0]?.remove();

  init();
  //init(1152, 648);
}

// #region init()

function init() {
  myObject = initObject();

  changeIcon();

  if (onMap) initBGM();

  scene = new THREE.Scene();
  /* **************************************************
    Le secret pour afficher le background (qui est éloigné?)
    ==> Il faut aggrandir la distance d'affichage !
    Car là elle est trop petite et du coup on voit rien sauf quand
    on est collé dessus, ce n'est pas le but. 4000 >> 1000
    ************************************************** */

  const meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME })
  );
  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);

  /*
    const fbxloader = new THREE.FBXLoader();
    fbxloader.load('http://voldre.free.fr/Eden/UD338out.fbx', object => {
        scene.add(object);
    });
    */

  const ambientLight = new THREE.AmbientLight(0xffffff, onMap ? 0.5 : 0.85);
  scene.add(ambientLight);

  const light = new THREE.PointLight(0xffffff, 1.5, 20);
  light.position.set(-3, 6, -6);
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  // VD 23/09/23 : Light make weird shadow
  light.position.z = 100;
  scene.add(light);

  // MTL Loader
  const mtlLoader = new THREE.MTLLoader(manager);
  mtlLoader.setMaterialOptions({ ignoreZeroRGBs: true });

  // console.log(mtlLoader);
  mtlLoader.load("http://voldre.free.fr/Eden/images/3D/" + folder + "/" + myObject + ".mtl", (materials) => {
    console.log(materials);

    const wrongMaterials = [];

    Object.values(materials.materialsInfo).map((material) => {
      const texture = material["map_kd"];
      // Gestion des 2 cas possibles d'absence de textures : 1) "chemin sans arrivé", 2) rien de déclaré
      if (!texture || texture == "images/3D/map/") {
        wrongMaterials.push(material.name);
      } else {
        // 13/06/2024 : Apply choosed colors if defined
        const choosedColor = colorsE.value.toUpperCase();
        material["map_kd"] = choosedColor
          ? material["map_kd"].slice(0, -10) + choosedColor + ".png"
          : material["map_kd"];
      }
    });

    if (onMap) {
      materials.preload();
    }

    // Ajout VD - 04/06/2022 - suivi du loading :
    console.log("On loading ...");

    const objLoader = new THREE.OBJLoader(manager);
    objLoader.setMaterials(materials);
    // console.log(materials);

    const onProgress = (xhr) => {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        document.getElementById("loading").innerHTML = "Loading : " + Math.round(percentComplete, 2) + "%";
      }
    };
    objLoader.load(
      "http://voldre.free.fr/Eden/images/3D/" + folder + "/" + myObject + ".obj",
      (mesh) => {
        // console.log("Loaded : " + myObject);
        document.getElementById("loading").innerHTML = null;

        mesh.traverse(function (node) {
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
        mesh.children.forEach((meshElement) => {
          meshElement.castShadow = true;
          // Make PNG transparence efficient
          meshElement.material.alphaTest = 0.5;
          meshElement.material.transparent = true;
          // Check if this material are in my "black list" of materials
          if (wrongMaterials.includes(meshElement.material.name)) {
            meshElement.visible = false; // If yes, I hide it for real, like in the game
          }
        });

        // Paramètre autorisant à update la rotation de l'objet
        mesh.matrixWorld.matrixWorldNeedsUpdate = true;

        scene.add(mesh);

        // BACKGROUND
        if (readCookie("whiteBgState") == "") {
          scene.background = new THREE.Color();
        } else if (readCookie("bgState") == "") {
          // 06/06/2022 - Ajout du background d'Eden (si c'est voulu)

          const date = new Date();
          const currentHour = parseInt(
            date
              .toLocaleTimeString({
                hour: "2-digit",
                hour12: false,
                timeZone: "Europe/Paris",
              })
              .split(":")[0]
          );

          const backgroundByHour = {
            5: "A402",
            8: "A102",
            11: "D502",
            15: "G602",
            17: "G603",
            18: "D302",
            19: "A302",
            20: "C301",
            21: "C402",
            23: "G604",
          };
          const choosenHour = Object.keys(backgroundByHour).find((hour) => hour >= currentHour);
          const myBG = backgroundByHour[choosenHour];

          // meshBG = new THREE.Mesh();
          mtlLoader.load("http://voldre.free.fr/Eden/images/3D/maps/" + myBG + ".mtl", (materialsBG) => {
            objLoader.setMaterials(materialsBG);
            objLoader.load("http://voldre.free.fr/Eden/images/3D/maps/" + myBG + ".obj", (meshBG) => {
              scene.add(meshBG);
              meshBG.rotation.x = -Math.PI / 2;
            });
          });
        }

        // Position et Rotation de notre objet

        if (onMap) {
          // Coordonnées de la génération de la map
          // Pour changer en live la position : scene.children[3].position.set = (0,0,0)
          mesh.position.set(
            mapsJSON[mapID]["map_x"] ?? 0,
            mapsJSON[mapID]["map_y"] ?? 0,
            mapsJSON[mapID]["map_z"] ?? 0
          );
          mesh.rotation.z = (mapsJSON[mapID]["map_r"] ?? 1) * Math.PI;
        } else if (folder == "items") {
          mesh.position.set(0, 1, -3.3);
          mesh.rotation.z = Math.PI / 1.4; // Pour qu'il regarde vers nous
        } else {
          mesh.position.set(-0.2, 0.25, -0.8);
          mesh.rotation.z = Math.PI / 1.4; // Pour qu'il regarde vers nous
        }

        // Angles pour tous nos objet
        mesh.rotation.y = 0; // Math.PI / 6;
        mesh.rotation.x = -Math.PI / 2;
      },
      onProgress
    );
  });

  // Caméra
  camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 4000);

  if (folder != "house") {
    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));
  } else {
    camera.position.set(0, player.height + 3.2, -17);
    camera.lookAt(new THREE.Vector3(0, player.height + 3, 0));
  }

  // Render

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  /* Size (width, height) of the canvas
    11.06.22 - UI Improvement : Adaptation du canvas selon l'écran 
    seulement, donc plus besoin de paramètre pour init() */
  // window.innerWidth = Taille fenêtre, window.screen.width = Taille écran
  renderer.setSize(window.innerWidth * 0.98, window.innerWidth * 0.46);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  canvasE?.appendChild(renderer.domElement);
  animate();
}

// #region animate()

function animate() {
  // Récupération de la requête dans une variable pour la garder en mémoire
  animationId = requestAnimationFrame(animate);

  // Objet 3D

  if (typeof scene.children[3] != "undefined" && !onMap) {
    // scene.children[3].rotation.z += 0.003;
    scene.children[3].position.z = -2.75;
    // "Remove" the floor
    scene.children[0].position.z = 1000;
    // Put camera in front of
    scene.children[3].rotation.z = 3.4;
    //console.log(scene.children[3]);
  }

  // MOVEMENTS

  // ZQSD mouvement translation
  if (keyboard[90] || (onTouch && touchKey === "up" && ![objetsE, colorsE].includes(document.activeElement))) {
    // Z key
    up();
  }
  if (keyboard[83] || (onTouch && touchKey === "down" && ![objetsE, colorsE].includes(document.activeElement))) {
    // S key
    down();
  }
  // Add 18/08/2023 (finally ! After all this time, one year ! xD)
  // Use R/F to move Top/Bottom the 3D design
  if (keyboard[82]) {
    // R
    scene.children[3].position.y += 0.01;
  }
  if (keyboard[70]) {
    // F
    scene.children[3].position.y -= 0.01;
  }
  if (keyboard[81] || (onTouch && touchKey === "left")) {
    // Q key
    left();
  }
  if (keyboard[68] || (onTouch && touchKey === "right")) {
    // D key
    right();
  }

  // Rotation de la caméra
  if (keyboard[37] || (onTouch && touchKey === "turnLeft")) {
    // left arrow key
    turnLeft();
  }
  if (keyboard[39] || (onTouch && touchKey === "turnRight")) {
    // right arrow key
    turnRight();
  }

  if (keyboard[38] || (onTouch && touchKey === "prev")) {
    // Top Arrow
    camera.position.y += player.speed / 2;
  }
  if (keyboard[40] || (onTouch && touchKey === "next")) {
    // Bottom Arrow
    camera.position.y -= player.speed / 2;
  }

  // Rotation de l'objet
  if (keyboard[65]) {
    // A
    scene.children[3].rotation.y += 0.01;
  }
  if (keyboard[69]) {
    // E
    scene.children[3].rotation.y -= 0.01;
  }

  // if (keyboard[161] || keyboard[48]) {
  //   // "!" ou "0", 04/06/2022 - Kill du programme
  //   console.log("Programme stoppé");
  //   cancelAnimationFrame(animationId);
  //   window.stop();

  //   this.renderer.domElement.addEventListener("dblclick", null, false); //remove listener to render
  //   this.scene = null;
  //   this.projector = null;
  //   this.camera = null;
  //   this.controls = null;
  //   // On supprime le canvas de l'ancien Objet 3D
  //   document.getElementsByTagName("canvas")[0].remove();
  // }

  renderer.render(scene, camera);
}

// #region Mvt functions

function up() {
  camera.position.x += -Math.sin(camera.rotation.y) * player.speed;
  camera.position.z += Math.cos(camera.rotation.y) * player.speed;
}
function right() {
  camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
  camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
}
function down() {
  camera.position.x += Math.sin(camera.rotation.y) * player.speed;
  camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
}
function left() {
  camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
  camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
}
function turnLeft() {
  camera.rotation.y -= 0.02;
}
function turnRight() {
  camera.rotation.y += 0.02;
}

// #region Mobile

const mobileInputs = ["up", "down", "left", "right", "turnLeft", "turnRight", "prev", "next"];

mobileInputs.map((input) => {
  document.querySelector(`#${input}`).addEventListener("pointerdown", (e) => {
    e.preventDefault();
    touchKey = input;
  });
});

[document.getElementById("prev"), document.getElementById("next")].map((elem) => {
  elem.addEventListener("click", () => {
    if (!onMap) $("#objets option:selected").prev().prop("selected", true).change();
  });
});

// Avoid mobile to "save/open image in new tab"
document.querySelector("footer").addEventListener("contextmenu", (event) => event.preventDefault());

// #region Keyboard Event L.

window.addEventListener("keydown", (event) => {
  keyboard[event.keyCode] = true;
});
window.addEventListener("keyup", (event) => {
  keyboard[event.keyCode] = false;
});
window.addEventListener("pointerdown", () => {
  onTouch = true;
});
window.addEventListener("pointerup", () => {
  onTouch = false;
  touchKey = null;
});

const keyPress = (e) => {
  if (["1", "2", "3"].includes(e.key)) {
    if (onMap) {
      player = updatePlayer(parseInt(e.key));
      document.querySelector(".customCommand").innerText = `[1,2,3] : Vitesse (${e.key})`;
    } else {
      if (e.key === "1") objetsE.focus();
      if (e.key === "2") colorsE.focus();
      if (e.key === "3") canvasE.focus();
    }
  }
};
window.addEventListener("keypress", keyPress);

// #region Loading

window.addEventListener("load", () => {
  const customCommandE = document.querySelector(".customCommand");
  if (!onMap) {
    document.getElementById("iconBGM").style.display = "none";
    customCommandE.innerHTML = "[1,2,3] (Focus) :  Liste, Couleurs, Design";
  } else {
    customCommandE.innerHTML = "[1,2,3] : Vitesse (1)";
  }

  // If on map and no default map
  if (onMap && !mapID) {
    // Si pas d'animation, pas d'élément dans la liste et qu'on n'a pas de map dans l'URL
    document.getElementById("loading").innerHTML =
      "<h4 style='position: fixed;width: 98vw;text-align:center;left: 0px;'>Ici vous pouvez sélectionner un donjon présent dans le jeu.<br/>Malheureusement certaines d'entres eux ne s'affichent pas correctement.</h4>";
    return;
  }

  init();
  updateColorsList();
});

// #region Select Listeners

// Remove all effects on select, except Top/Bottom and M
[objetsE, colorsE].map((selectE) =>
  selectE.addEventListener("keydown", (e) => {
    const allowedKeys = ["ArrowUp", "ArrowDown", "m"];
    if (allowedKeys.includes(e.key)) return;
    e.preventDefault();
    keyPress(e);
  })
);

objetsE.addEventListener("change", (e) => {
  update();
  updateColorsList(e.target.value);
});

colorsE.addEventListener("change", () => {
  update();
});

const updateColorsList = (object) => {
  [...colorsE.options].map((optionE) => {
    optionE.hidden = !isTextInText(optionE.value, object ?? objetsE.value);
    // set default colors
    colorsE.value = (object ?? "M001").toUpperCase() + "01";
  });
};

// #region Icons

const iconPicE = document.getElementById("iconPic");

function changeIcon() {
  const foldersWithIcons = ["items", "monsters"];
  if (foldersWithIcons.includes(folder)) {
    iconPicE.style.display = "block";

    let file = objetsE.value.slice(1); // On récupère tout sauf la 1ere lettre

    let letter;
    if (folder == "items") {
      letter = "W";
      file = file + "01";
    }
    // if folder == "monsters"
    if (objetsE.value[0].toUpperCase() == "M") {
      letter = "m";
    } else if (objetsE.value[0].toUpperCase() == "R") {
      letter = "R";
    }
    // Update 12/06/2022 pour mieux gérer l'affichage ou non de l'icone

    iconPicE.src = "images/" + folder + "/" + letter + file + ".png";
  } else {
    iconPicE.style.display = "none";
  }
}

// #region Toggles

/* Update 09.06.22 - Ajout d'un toggle permettant
    de choisir si on veut ou non afficher l'arrière plan.
    Car il met un peu + de temps à se générer et avec plein de
    designs c'est vite désagréable, mais pas les maps  */

const togglesName = ["bg", "bgm", "whiteBg"];

// Set cookies
togglesName.map((name) => {
  document.getElementById(`${name}Toggle`).addEventListener("click", (e) => {
    console.log("cookie updated");
    document.cookie = `${name}State=${e.target.checked ? "checked" : ""}`;
  });
});

// BGM Handler

const audioE = document.querySelector("audio");
audioE.volume = 0.4;
const bgmToggleE = document.getElementById("bgmToggle");

let myBGM;
const initBGM = () => {
  myBGM = mapsJSON[mapID]["bgm"].toString();
  while (myBGM.length < 3) {
    myBGM = "0" + myBGM;
  }
  audioE.src = `bgm/bgm${myBGM}.ogg`;
  if (!bgmToggleE.checked) audioE.play();
  else audioE.pause();
};
bgmToggleE.addEventListener("change", initBGM);

document.getElementById("whiteBgToggle").addEventListener("change", (e) => {
  scene.background = e.target.checked ? new THREE.Color() : null;
});
