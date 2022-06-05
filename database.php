<?php
session_start();
?>
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
    //35=>["Palais Heldentod",0,0,5],
    36=>["Plaines d'Elos",0],
    37=>["Marina d'Edouard",0], 
    38=>["Royaume Durango",0],
    //43=>["Base de l'Armée Braider",0,0,5],
    51=>["Dôme Céleste",30,30,2],
    52=>["Hauteurs Feudegivre",40,40,2],
    53=>["Meeryasha",30,40,2],
    54=>["Jungle Mayland",10,30,1],
    55=>["Bassin Shaxia",20,40,1],

    //95=>[,0,0,5],
    100=>["Mine Andrew",0,0,5],
    101=>["Mine d'Angor",0,0,5],
    102=>["Fort Verdure",0,0,5],
    103=>["Canal Tassos",0,0,5],
    104=>["Caverne de Schiste",0,0,5],
    105=>["Eroda",0,0,5],
    106=>["Morticora",0,0,5],
    107=>["Racine Branda",0,0,5],
    108=>["Palais des Malices",0,0,5],
    109=>["Pourriture",0,0,5],
    110=>["Abîme de Baram",0,0,5],
    111=>["Coeur de Baltaroï",0,0,5],
    112=>["Rêve du Maire",0,0,5],
    113=>["Fléau",0,0,5],
    114=>["Chambre de Baïra",0,0,5],
    115=>["Crypticône",0,0,5],
    116=>["Temple de Delphes",0,0,5],
    117=>["Veine Tordue",0,0,5],
    118=>["Autel du Culte de Mara",0,0,5],
    119=>["Chute des Âmes en Peine",0,0,5],
    120=>["Vortek",0,0,5],
    121=>["Arsenal Fédéral",0,0,5],

    122=>["Sturmfrau",0,0,5],
    123=>["Abysse Glacée de Skleros",0,0,5],
    124=>["Cratère des Géants",0,0,5],
    125=>["Antre des échos",0,0,5],
    127=>["Grotte de la Marée des Ombres",0,0,5],



    201=>["Base des Vilrequins",0,0,5],
    202=>["Salle Ulta",0,0,5],
    203=>["Crocvenin",0,0,5],
    204=>["Écarlate",0,0,5],
    205=>["Siècle",0,0,5],
    206=>["Manoir",0,0,5],
    207=>["Frontière de Basel",0,0,5],
    208=>["Prison Ossuaire",0,0,5],
    209=>["Guillotine",0,0,5],
    210=>["Temple Spirenfer",0,0,5],
    211=>["Temple de la Rose",0,0,5],
    212=>["Labot Vingot",0,0,5],
    213=>["Cap Hurlant",0,0,5],
    214=>["Abysse de Siècle",0,0,5],
    215=>["Grotte Non Répertoriée",0,0,5],
    216=>["Dimension Dévastée",0,0,5],
    217=>["Cratère Météoritique",0,0,5],
    218=>["Tour Kahlo",0,0,5],

    219=>["Iyernafalo",0,0,5],

    220=>["Terre sacrée de Kamodo",0,0,5],
    221=>["Temple aquatique",0,0,5],
    222=>["Labo Antigravité",0,0,5],
    223=>["Grey Lynn",0,0,5],
    224=>["Bataille Spatiotemporelle",0,0,5],
    225=>["Vallée Batelo",0,0,5],
    226=>["Temple enchanté",0,0,5],
    284=>["Laboratoire de Réno",0,0,5],

    308=>["Ville de Guilde: Couloir de l'Esprit Gardien",0,0,5],

    /*
    102=>["",0,0,5],
    102=>["",0,0,5],
    102=>["",0,0,5],
    102=>["",0,0,5],
    102=>["",0,0,5],
    102=>["",0,0,5],
    102=>["",0,0,5],
    "Plaines du L",
    3=>"Croc Brumeux",
    */
);

$_SESSION["maplist"] = $maplist;


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