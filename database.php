<?php
include("header.php");
?>

<body>
<a href="../"><button class="root">Retourner sur le site global</button></a>
<br/>

<div class="menu">
    <ul>
        <a href="database.php?data=items"><li><img src="images/itemIcon/A00016.png" /> Objets</li></a>
        <a href="database.php?data=maps"><li href="database.php?data=maps"><img src="images/maps/S013m.png" /><p style="display:inline-block;width: 48%;height: 24px;"> Régions </p><a href="database.php?data=worldmap"><img src="images/worldmapIcon.png" class="mapIcon" ></a></li></a>
        <a href="database.php?data=class"><li><img src="images/skillIcon/E0013.png" /> Classes</li></a>
        <a href="3D.php?data=monster"><li><img src="images/skillIcon/m081.png" /> Monstres</li></a>
        <a href="3D.php?data=char"><li><img src="images/skillIcon/m321.png" /> Costumes (RGB)</li></a>
        <a href="3D.php?data=house"><li><img src="images/itemIcon/I00466.png" /> Maisons</li></a>
        <a href="3D.php?data=items"><li><img src="images/itemIcon/w25502.png" /> Armements</li></a>
        <a href="3D.php?data=ride"><li><img src="images/itemIcon/i00887.png" /> Montures</li></a>
        <a href="3D.php?data=map"><li><img src="images/otherIcon/group037.png" /> Donjons</li></a>
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


$itemRepository = 'images/itemIcon/';
$skillRepository = 'images/skillIcon/';
$monsterRepository = 'images/monster/';

$categorieslist = array(
    "a"=>"Anneaux / Armures",
    "A"=>"Armures Eveillés / Autres",
    "e"=>"Compétences",
    "j"=>"Passifs des personnages et des classes",
    "i"=>"Objets / Potions / Trophées / Familiés / Montures / Gemmes / Compos / Plans",
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
    <div class="container">
    <?php
        drawIcons($itemRepository);
    }else if($_GET["data"] == "class"){
    ?>
    <h2>Liste des compétences</h2>
    <div class="container">
    <?php
        drawIcons($skillRepository);
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

<?php

// Functions to draw datas 

function drawIcons($repository){
    global $categorieslist;

    $files = scandir($repository);
    $categorie = null;
    $categorienom = null;

    foreach($files as $file){
        if(strlen($file) >= 3){
            if(strtolower($file[0]) != $categorie){
                if($categorie != null){
                    echo "</div>";
                }
                $categorie = strtolower($file[0]);
                $categorienom = $categorieslist[$categorie];
                echo "<h2 style='margin: 0 -10px -10px -20px;'>$categorienom</h2><br/>";
                echo "<div class='container'>";

            }
            echo "<img class='icon' src='$repository$file' />";
        }
    }
}
?>

</body>

</HTML>