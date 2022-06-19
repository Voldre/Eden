<?php
include("header.php");
include("menu.html");
?>
<body>
<div class="dbMenu">
    <ul>
        <a href="database.php?data=items"><li><img src="images/items/A00006.png" /> Objets</li></a>
        <a href="database.php?data=class"><li><img src="images/skillIcon/j047.png" />Classes / Compétences</li></a>
        <a href="database.php?data=monsters"><li><img src="images/monsters/m229.png" />Monstres</li></a>
        <a href="database.php?data=bgm"><li><img src="images/uiiconPNG/prefer04.png" />Musiques</li></a>
    </ul>
</div>
 
<?php

$itemRepository = 'images/items/';
$skillRepository = 'images/skillIcon/';
$monsterRepository = 'images/monsters/';
$musicRepository = 'bgm/';

$categorieslist = array(
    "A"=>"Anneaux / Armures",
    "a"=>"Armures Eveillés / Autres",
    "e"=>"Compétences",
    "j"=>"Passifs des personnages et des classes",
    "i"=>"Objets / Potions / Trophées / Familiers / Montures / Gemmes / Compos / Plans",
    "k"=>"Costumes",
    "m"=>"Ennemis",
    "n"=>"Gestes",
    "q"=>"Objets de quêtes (Quêtes de guildes, Quêtes de livres)",
    "x"=>"Classes",
    "x"=>"Classes",
    "y"=>"Passifs des personnages",
    "w"=>"Armement (Armes, Boucliers)",
);


if(isset($_GET["data"])){
    if($_GET["data"] == "items"){
    ?>
    <h2>Liste des objets</h2>
    <?php
        drawIcons($itemRepository);
        echo  "<iframe style='width:0px;' onload='changeCategory();'></iframe>";

    }else if($_GET["data"] == "class"){
    ?>
    <h2>Liste des compétences et classes</h2>
    <?php
        drawIcons($skillRepository);
        echo  "<iframe style='width:0px;' onload='changeCategory();'></iframe>";
    }else if($_GET["data"] == "monsters"){
    ?>
    <h2>Liste des monstres et personnages</h2>
        <?php
        drawIcons($monsterRepository);
        echo  "<iframe style='width:0px;' onload='changeCategory();'></iframe>";
    }else if($_GET["data"] == "bgm"){
    ?>
    <h2>Liste des musiques <span class="menu" id="currentMusic"></span></h2>
        <?php
        drawMusics($musicRepository);
    }else{ 
    
    }
}
?>
</div>
<script type="text/javascript">
function changeCategory() {

    console.log(document.getElementsByClassName("container"));
    for(children in document.getElementsByClassName("container")[0].childNodes){
        //console.log(document.getElementsByClassName("container")[0].childNodes[children].currentSrc.split('/').slice(-1)[0].slice(0)[0]);
        if(typeof document.getElementsByClassName("container")[0].childNodes[children].currentSrc != "undefined"){
                // Si la première lettre slice(0) du nom de fichier slice(-1) est différent de la categorie choisie, on le cache
            if(document.getElementsByClassName("container")[0].childNodes[children].currentSrc.split('/').slice(-1)[0].slice(0)[0] != $("#categorie").val()){
                document.getElementsByClassName("container")[0].childNodes[children].style.display = "none";
            }else{
                document.getElementsByClassName("container")[0].childNodes[children].style.display = "inline";   
            }
        }
    }
}
</script>
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
            echo "<img class='icon' src='$repository$file' onerror=\"this.onerror=null;this.src='$repository$file';\" />";
        }
    }
}

function drawMusics($repository){

    $files = scandir($repository);
    echo "<div class='container'>";
    foreach($files as $file) {
        if (strpos($file,"bgm") !== false){
            echo "<div>";
            echo "<p>".explode(".",$file)[0]."</p>";
            echo "<audio controls ><source src='bgm/$file' type='audio/ogg' /></audio>";
            echo "</div>";
        }
    }
    echo "</div>";
}
?>

<script type="text/javascript">
// Disable the possibility of launching several audio simultaneously
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
    console.log(e.target.firstChild.attributes.src.nodeValue.split("/")[1].split(".")[0]);
    document.getElementById("currentMusic").innerHTML = e.target.firstChild.attributes.src.nodeValue.split("/")[1].split(".")[0];
}, true);
</script>
</body>

</HTML>