<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="http://voldre.free.fr/style.css">
    <link rel="stylesheet" href="eden.css">

    <script type="text/javascript" src="three.min.js"></script>
    <script type="text/javascript" src="MTLLoader.js"></script>
    <script type="text/javascript" src="OBJLoader.js"></script>

    <script type="text/javascript" src="threeEden.js"></script>

</head>

<body>
<a href="../"><button class="root">Retourner sur le site global</button></a>
<br/>

<div class="menu">
    <ul>
        <a href="database.php?data=items"><li><img src="images/itemIcon/A00016.png" /> Objets</li></a>
        <a href="database.php?data=maps"><li><img src="images/maps/S013m.png" /> Régions <a href="database.php?data=worldmap"><img src="images/worldmapIcon.png" class="mapIcon" ></a></li></a>
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

// Datas

$maplist = array(1=>["Aven",26.5,64.9,0],
    2=>["Monts Calcaires",10.6,69.2,0],
    3=>["Colline tranquille",17.6,73.3,0],
    4=>["Forêt Arc-en-Ciel",16,66.1,0],
    5=>["Monts Arides",11.5,60.7,0],
    6=>["Baie Bélouga",17,54,0],
    7=>["Bourbes",21.2,48.6,0],
    8=>["Vallée des Rois",13,42.6,0], 
    9=>["Volcan Avila",28.4,42.2,0], 
    10=>["Plaines Dorées",33.4,52.1,0],
    11=>["Terres des Dunes Éternelles",42,58.3,0],
    12=>["Forêt de Delphes",38.8,41.1,0],
    13=>["Pic de Noireflammes",40.6,32.3,0],
    14=>["Marais Décrépits",46.2,46.4,0],
    15=>["Hautes-terres",54.5,45.5,0],
    16=>["Croc Brumeux",39.7,75,0],
    19=>["Vallée Feregal",40,40,1],
    20=>["Désert du Couchant",30,30,1],
    21=>["Jungle Céleste",20,20,1],
    22=>["Forêt Ensorcelée",30.5,30.7,0],
    23=>["Crète Diamantée",35.9,21.3,0],
    24=>["Pic du Maëlstrom",25,24.8,0],
    25=>["Vallée de la Mort",17.6,21.9,0],
    26=>["Plaines Fleuries",24,35.6,0],
    27=>["Falaise des Grands Vents",11.4,29.8,0],
    28=>["Lagune Enchantée",20,60,2],
    29=>["Côte de Hurlevent",30,70,2],
    30=>["Jungle du Dieu Serpent",40,50,2],
    31=>["Île Cerisier ?"],
    32=>["Vallée de Vulcain",48.3,33.1,0],
    33=>["Plaines du Levant",48.2,23,0],
    34=>["Royaume Dévasté",56.2,23,0],
    36=>["Plaines d'Elos",0],
    37=>["Marina d'Edouard",0], 
    38=>["Royaume Durango",0],
    51=>["Dôme Céleste",30,30,2],
    52=>["Hauteurs Feudegivre",40,40,2],
    53=>["Meeryasha",30,40,2],
    54=>["Jungle Mayland",10,30,1],
    55=>["Bassin Shaxia",20,40,1],
    /*"Plaines du L",
    3=>"Croc Brumeux",
    */
);

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
        <select name="img">
        <option value="maps">maps</option>
        <option value="wallpaper">wallpaper</option>
        </select>
        <input type="submit" value="Modifier">
    </form>
    <h2>Liste des maps</h2>
    <div class='container'>
    <?php
        foreach($maplist as $key=>$value){
            echo"<div class='img_block'>";
            echo "<p>$value[0]</p>";

            $keyZ = $key;
            while(strlen($keyZ)<2){
                $keyZ = "0$key";
            }

            $img = "maps/S0".$keyZ."m.png";
        
            if(isset($_POST["img"])){
                if($_POST["img"] == "wallpaper"){
                    $img = "loadingframe/Loading_".$key.".png";
                }
            } 
            echo "<img class='pictures' src='images/".$img."' />";
            echo "</div>";
        }
    }else if($_GET["data"] == "worldmap"){


    ?>
    <div class="container">
    <div class="continent" style="max-width:70%; max-height:70%:" >
    <?php
        foreach($maplist as $key=>$value){
            if(isset($value[3]) && $value[3]==0){
                echo "<a href='database.php?map=".$value[0]."'><div class='point' style='top:".$value[1]."%; left:".$value[2]."%;' ><p class='name'>".$value[0]."</p></div></a>";
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
                echo "<a href='database.php?map=".$value[0]."'><div class='point' style='top:".$value[1]."%; left:".$value[2]."%;' ><p class='name'>".$value[0]."</p></div></a>";
            }
        }
    ?>
    <img src="images/mapworld02.png" style="max-width:47%;" />

    <?php
        foreach($maplist as $key=>$value){
            if(isset($value[3]) && $value[3]==1){
                echo "<a href='database.php?map=".$value[0]."'><div class='point' style='top:".$value[1]."%; left:".$value[2]."%;' ><p class='name'>".$value[0]."</p></div></a>";
            }
        }
    ?>
    <img src="images/mapworld03.png" style="max-width:47%;" />

    </div>
    </div>
   
    <?php
    }
}else if(isset($_GET["map"])){
    

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