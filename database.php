<HTML>

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
        <a href="database.php?data=maps"><li><img src="images/maps/s013m.png" /> Régions</li></a>
        <a href="database.php?data=class"><li><img src="images/skillIcon/E0013.png" /> Classes</li></a>
        <a href="3D.php?data=monster"><li><img src="images/skillIcon/m081.png" /> Monstres</li></a>
        <a href="3D.php?data=char"><li><img src="images/skillIcon/m321.png" /> Personnages</li></a>
    </ul>
</div>


<?php

// Datas

$maplist = array(1=>"Aven",
    2=>"Monts Calcaires",
    3=>"Colline tranquille",
    4=>"Forêt Arc-en-Ciel",
    5=>"Monts Arides",
    6=>"Baie Bélouga",
    7=>"Bourbes",
    8=>"Vallée des Rois", 
    9=>"Volcan Avila", 
    10=>"Plaines Dorées",
    11=>"Terres des Dunes Éternelles",
    12=>"Forêt de Delphes",
    13=>"Pic de Noireflammes",
    14=>"Marais Décrépits",
    15=>"Hautes-terres",
    16=>"Croc Brumeux",
    19=>"Vallée Feregal",
    20=>"Désert du Couchant",
    21=>"Jungle Céleste",
    22=>"Forêt Ensorcelée",
    23=>"Crète Diamantée",
    24=>"Pic du Maëlstrom",
    25=>"Vallée de la Mort",
    26=>"Plaines Fleuries",
    27=>"Falaise des Grands Vents",
    28=>"Lagune Enchantée",
    29=>"Côte de Hurlevent",
    30=>"Jungle du Dieu Serpent",
    31=>"Île Cerisier ?",
    32=>"Vallée de Vulcain",
    33=>"Plaines du Levant",
    34=>"Royaume Dévasté"
    /*"Plaines d'Elos",
    Marina d'Edouard 
    Royaume Durango 
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
            echo "<p>$value</p>";

            $keyZ = $key;
            while(strlen($keyZ)<2){
                $keyZ = "0$key";
            }

            $img = "maps/s0".$keyZ."m.png";
        
            if(isset($_POST["img"])){
                if($_POST["img"] == "wallpaper"){
                    $img = "loadingframe/loading_".$key.".png";
                }
            } 
            echo "<img class='pictures' src='images/".$img."' />";
            echo "</div>";
        }
    }else if($_GET["data"] == "---"){
   
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