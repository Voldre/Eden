<?php
include("header.php");
include("menu.html");
?>
<body>
<div class="dbMenu">
    <ul>
        <a href="database.php?data=items"><li><img src="images/items/A00006.png" alt="Objets" /> Objets</li></a>
        <a href="database.php?data=class"><li><img src="images/skillIcon/j047.png" alt="Compétences" />Classes / Compétences</li></a>
        <a href="database.php?data=monsters"><li><img src="images/monsters/m229.png" alt="Monstres" />Monstres</li></a>
        <a href="database.php?data=bgm"><li><img src="images/uiiconPNG/prefer04.png" alt="Musiques" />Musiques</li></a>
    </ul>
</div> 
<script type="text/javascript">
function changeCategory() {
    
    children = document.getElementsByClassName("container")[0].childNodes;

    for(child in children){
        //console.log(children[child].currentSrc.split('/').slice(-1)[0].slice(0)[0]);
        if(typeof children[child].currentSrc != "undefined"){
                // Si la première lettre slice(0) du nom de fichier slice(-1) est différent de la categorie choisie, on le cache
            if(children[child].currentSrc.split('/').slice(-1)[0].slice(0)[0] != $("#categorie").val()){
                children[child].style.display = "none";
            }else{
                children[child].style.display = "inline";   
            }
        }
    }
}
</script>

<?php

global $audioMap;
$audioMap = json_decode(file_get_contents("audioMap.json"),true);

$itemRepository = 'images/items/';
$skillRepository = 'images/skillIcon/';
$monsterRepository = 'images/monsters/';
$musicRepository = 'bgm/';

$categorieslist = array(
    "A"=>"Anneaux / Armures",
    "a"=>"Armures Eveillés / Autres",
    "E"=>"Compétences",
    "j"=>"Passifs des personnages et des classes",
    "i"=>"Objets / Potions / Trophées / Familiers / Montures / Gemmes / Compos / Plans",
    "k"=>"Costumes",
    "m"=>"Ennemis",
    "n"=>"Gestes",
    "q"=>"Objets de quêtes (Quêtes de guildes, Quêtes de livres)",
    "x"=>"Classes",
    "y"=>"Passifs des personnages",
    "w"=>"Armement (Armes, Boucliers)",
    "W"=>"Armement (Armes, Boucliers)",
);


if(isset($_GET["data"])){
    if($_GET["data"] == "items"){
    ?>
    <h2>Liste des objets</h2>
    <?php
        drawIcons($itemRepository);
        ?>
        <script>changeCategory();</script>
        <?php
        // echo  "<iframe style='width:0px;height:0px' onload='changeCategory();'></iframe>";

    }else if($_GET["data"] == "class"){
    ?>
    <h2>Liste des compétences et classes</h2>
    <?php
        drawIcons($skillRepository);
        ?>
        <script>changeCategory();</script>
        <?php
        // echo  "<iframe style='width:0px;' onload='changeCategory();'></iframe>";
    }else if($_GET["data"] == "monsters"){
    ?>
    <h2>Liste des monstres et personnages</h2>
        <?php
        drawIcons($monsterRepository);
        ?>
        <script>changeCategory();</script>
        <?php
        // echo  "<iframe style='width:0px;' onload='changeCategory();'></iframe>";
    }else if($_GET["data"] == "bgm"){
    ?>
    <h2>Liste des musiques</h2>
    <div class='discWrapper'>
        <div class='disc'><div></div></div>
        <div style="margin-bottom:5px;">
            <span id="currentMusic"></span>
            <div class='revertFlexContainer'>
                <button title='Lecture aléatoire' id="random"><img src="https://cdn0.iconfinder.com/data/icons/user-interface-2063/24/UI_Essential_icon_expanded_3-36-48.png" style="height: 26px;"></button>
                <button title='Lecture en boucle' id="loop"><img src="https://cdn0.iconfinder.com/data/icons/google-material-design-3-0/48/ic_loop_48px-48.png" style="height: 26px;"></button>
                <button title='Suivant' id="next"><img src="https://cdn2.iconfinder.com/data/icons/picol-vector/32/controls_chapter_next-48.png" style="height: 26px;"></button>
            </div>
        </div>
    </div>
    
  <?php
        drawMusics($musicRepository,$audioMap);
    }else{ 
    
    }
}
?>
</div>
<?php

// Functions to draw datas 

function drawIcons($repository){
    global $categorieslist;

    $files = scandir($repository);
    $categorie = null;
    $categorienom = null;

    $myCategories = array();
    foreach($files as $file) {
        // Si la catégorie n'est pas encore ajouté ET qu'on l'a identifié (#on veut l'afficher)
        if (!isset($myCategories[$file[0]]) && isset($categorieslist[$file[0]])){
            $myCategories[$file[0]] = $file[0];
        }
    }
?>
<select onchange="changeCategory();" id="categorie">
    <?php
    foreach($myCategories as $categorie){
    echo "<option value=$categorie>".$categorieslist[$categorie]."</option>";
    }
    ?>
</select>
<?php
    echo "<div class='container'>";
    foreach($files as $file){
        if(strlen($file) >= 3){
            echo "<img class='icon' src='$repository$file' onerror=\"this.onerror=null;this.src='$repository$file';\" alt='$repository$file' />";
        }
    }
}

function drawMusics($repository,$audioMap){

    $files = scandir($repository);
    echo "<div class='container'>";
    foreach($files as $index => $file) {
        $filename = explode(".",$file)[0];
        if ($filename !== ""){
            echo '<div id="'.$filename.'" data-index='.$index." class='audioWrapper'>";
            // echo "<p>".filename."</p>";
            echo "<p>".($audioMap[$filename] ?: $filename)."</p>";
            echo "<audio controls ><source src='bgm/".rawurlencode($file)."' type='audio/".explode(".",$file)[1]."' /></audio>";
            echo "</div>";
        }
    }
    echo "</div>";
}
?>

<script type="text/javascript">

// ---------------------------------------------
// ------------- JAVASCRIPT PART ---------------
// ---------------------------------------------

const discE = document.querySelector('.disc')
let discImages = [];
const updateDisc = ()=>{
  const randomIndex = Math.floor(Math.random() * discImages.length);
  const randomImage = discImages[randomIndex];
  
  if(randomImage)  discE.style.backgroundImage = `url('http://voldre.free.fr/Eden/images/wallpaper/${randomImage}')`;
}

window.addEventListener('load',async ()=>{
   const images = JSON.parse(await $.ajax({
    url: "jdr_backend.php",
    type: "post",
    data: { action: "wallpaper" },
    async: true,
  }));
  discImages = images.filter(image => ['png','jpg','jpeg','webp'].find(ext => image.includes(ext)))
})

const container = document.querySelector('.container');
const currentMusicWrapper = document.getElementById("currentMusic")

let randomActivated = false
let loopActivated = false

const switchMusic = (currentMusic,newMusic) => {
    if (currentMusic) {
        currentMusicWrapper.removeChild(currentMusic)
        // Remettre l'élément à sa position originale
        const index = currentMusic.dataset.index;
        container.insertBefore(currentMusic, container.children[index-2]);
    }
    currentMusicWrapper.appendChild(newMusic);
    updateDisc()
}

const randomMusic = () =>{
    const currentMusic = currentMusicWrapper.children[0]
        // Remove "sound" from random list
    const audioWrappers = [...document.querySelectorAll('.audioWrapper')].filter(audio => !audio.id.includes('sound0'))            
    const randomIndex = Math.floor(Math.random() * audioWrappers.length);
    const newMusic = audioWrappers[randomIndex];

    switchMusic(currentMusic,newMusic)

    // Mettre à jour et lire l'audio aléatoire sélectionné
    newMusic.querySelector('audio').play();
}

const audioItems = [...document.querySelectorAll('audio')]

audioItems.forEach(item =>{ 
    
    item.addEventListener('play', (e)=> {
        // Disable the possibility of launching several audio simultaneously
        audioItems.forEach(audio =>{
            if(audio !== e.target){
                audio.pause()
                if(audio.currentTime < 30) audio.currentTime = 0
            }
        })
        
        const currentMusic = currentMusicWrapper.children[0]

        let newBGM = e.target.firstChild.attributes.src.nodeValue.split("/")[1].split(".")[0]
        newBGM = decodeURIComponent(newBGM.replace(/\+/g, ' '))
        const newMusic = document.getElementById(newBGM)
        
        discE.classList.add('playing');
        if(currentMusic !== newMusic)
            switchMusic(currentMusic,newMusic)     
    }, true);

    item.addEventListener('pause',(e)=>{
        const stoppedMusic = e.target.currentSrc
        const currentMusic = currentMusicWrapper.children[0].querySelector('audio').currentSrc
        // stop playing only if this is a pause on the current music (not a switch)
        if(stoppedMusic === currentMusic) discE.classList.remove('playing');
    })

    item.addEventListener('ended', () =>{
        if(!randomActivated) return 
        randomMusic()
    })
});

document.querySelector('#next').addEventListener('click', randomMusic)


const buttonRandom = document.querySelector('#random')
const buttonLoop = document.querySelector('#loop')
buttonRandom.addEventListener('click', ()=>{
    buttonRandom.classList.toggle('pushed')
    buttonLoop.classList.remove('pushed')
    randomActivated = !randomActivated
    loopActivated = false
    audioItems.forEach(item => item.loop = loopActivated)
})

buttonLoop.addEventListener('click', ()=>{
    buttonRandom.classList.remove('pushed')
    buttonLoop.classList.toggle('pushed')
    randomActivated = false
    loopActivated = !loopActivated
    audioItems.forEach(item => item.loop = loopActivated)
})
</script>
</body>

</HTML>