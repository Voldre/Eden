<?php
session_start();


// Datas
$_SESSION["maplist"] = array(1=>["Aven",26.5,64.9,0],
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

?>
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="http://voldre.free.fr/style.css">
    <link rel="stylesheet" href="http://voldre.free.fr/Eden/eden.css">

    <!--<script src="jquery-3.6.0.min.js"></script>-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

    <meta charset="utf-8">
    <title>Démonstration 3D</title>
    <script type="text/javascript" src="three.min.js"></script>
    <script type="text/javascript" src="MTLLoader.js"></script>
    <script type="text/javascript" src="OBJLoader.js"></script>

    <script type="text/javascript" src="threeEden.js"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FPLLJ4M61Z"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-FPLLJ4M61Z');
    </script>


    <!-- Never forget the viewport ! -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
