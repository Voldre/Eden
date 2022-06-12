<?php
include("header.php");
include("menu.html");
?>
<body>
<div class="dbMenu">
    <ul>
        <a href="database.php?data=items"><li><img src="images/items/A00006.png" /> Objets</li></a>
        <a href="database.php?data=maps"><li href="database.php?data=maps"><img src="images/maps/S013m.png" /><p style="display:inline-block;width: 48%;height: 24px;"> Régions </p><a href="database.php?data=worldmap"><img src="images/worldmapIcon.png" class="mapIcon" ></a></li></a>
        <a href="database.php?data=class"><li><img src="images/skillIcon/j047.png" />Classes / Compétences</li></a>
        <a href="database.php?data=monsters"><li><img src="images/monsters/m229.png" />Monstres</li></a>
    </ul>
</div>
 

<?php

$maplist = $_SESSION["maplist"];

function All($value){
    return true;
}
function Mondes($value){
    if($value[3] <= 2){
        return true;
    }else{ return false; }
}
function Donjons($value){
    if($value[3] <= 2){
        return false;
    }else{ return true; }
}


$itemRepository = 'images/items/';
$skillRepository = 'images/skillIcon/';
$monsterRepository = 'images/monsters/';

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
    }else if($_GET["data"] == "maps"){
    ?>
    <form method="POST" action="database.php?data=maps">
        <select name="filter">
        <option value="All">Toutes les cartes</option>
        <option value="Mondes">Cartes du monde</option>
        <option value="Donjons">Cartes des Donjons</option>
        </select>
        <input type="submit" value="Modifier">
    </form>
    <h2>Liste des maps</h2>
    <div class='container'>
    <?php
        if(!isset($_POST["filter"])){
            $_POST["filter"] = "All";
        }
        foreach(array_filter($maplist, $_POST["filter"]) as $key=>$value){
            echo"<div class='img_block'>";
            echo "<p>$value[0]</p>";

            $keyZ = $key;
            while(strlen($keyZ)<3){
                $keyZ = "0$keyZ";
            }
            $img = "maps/S".$keyZ."m.png";

            if(isset($_POST["img"])){
                if($_POST["img"] == "wallpaper"){
                    $img = "loadingframe/Loading_".$key.".png";
                }
            } 
            echo "<a href='database.php?data=map&map=".$key."'>";
            echo "<img class='pictures' src='images/".$img."' />";
            echo "</a></div>";
        }
    }else if($_GET["data"] == "worldmap"){

    ?>
    <div class="container">
    <div class="continent" style="max-width:70%; max-height:70%:" >
    <?php
        foreach($maplist as $key=>$value){
            if(isset($value[3]) && $value[3]==0){
                echo "<a href='database.php?data=map&map=".$key."'><div class='point' style='top:".$value[1]."%; left:".$value[2]."%;' ><p class='name'>".$value[0]."</p></div></a>";
            }
        }
    ?>
        <img src="images/mapworld012.png" />
    </div>    
    </div>

    <div class="container">
    <div class="continent" style="max-width:70%; max-height:70%:" >
    <?php
        foreach($maplist as $key=>$value){
            if(isset($value[3]) && $value[3]==2){
                echo "<a href='database.php?data=map&map=".$key."'><div class='point' style='top:".$value[1]."%; left:".$value[2]."%;' ><p class='name'>".$value[0]."</p></div></a>";
            }
        }
    ?>
    <img src="images/mapworld02.png" style="max-width:47%;" />

    <?php
        foreach($maplist as $key=>$value){
            if(isset($value[3]) && $value[3]==1){
                echo "<a href='database.php?map=".$key."'><div class='point' style='top:".$value[1]."%; left:".$value[2]."%;' ><p class='name'>".$value[0]."</p></div></a>";
            }
        }
    ?>
    <img src="images/mapworld03.png" style="max-width:47%;" />

    </div>
    </div>
   
    <?php
    }else if($_GET["data"] == "map"){
        echo "<h1 stlye='text-align:center;'>".$maplist[$_GET['map']][0];
        echo "<a href=3D.php?data=map&map=S".$_GET['map']."><img src='images/otherIcon/group037.png' /></a></h1>";
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
?>

</body>

</HTML>