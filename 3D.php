<HTML>
<!-- 

Noesis paramètres avancés pour l'export :
https://www.reddit.com/r/ffxioffline/comments/653onc/noesis_advanced_export_optionscommands/

Noesis Wiki (+ QuickBMS) et d'autres outils à regarder :
https://wiki.vg-resource.com/Noesis , Noesis Download : http://www.richwhitehouse.com/index.php?content=inc_projects.php&filemirror=noesisv4464.zip

-->
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="http://voldre.free.fr/style.css">
    <link rel="stylesheet" href="http://voldre.free.fr/Eden/eden.css">

    <meta charset="utf-8">
    <title>Démonstration 3D</title>
    <script type="text/javascript" src="three.min.js"></script>
    <script type="text/javascript" src="MTLLoader.js"></script>
    <script type="text/javascript" src="OBJLoader.js"></script>

    <script type="text/javascript" src="threeEden.js"></script>
</head>

<body onload="init(1152, 648)" style="overflow:hidden; text-align:center;">
    <a href="index.php"><button class="root">Retourner au menu d'Eden</button></a>

    <select onchange="update()" id="objets">
    <?php
        //$monsterRepository = 'images/monster/';
        if(isset($_GET["data"])){
            $repository = $_GET["data"];
        }else{ $repository = "monster"; }
        $files = scandir("images/$repository/");
        foreach($files as $file){
            if(strpos($file,".obj") !== false){
                // On garde tout sauf l'extension
                $file = strtok($file,  '.');
                echo "<option value=$file>$file</option>";
                echo"<$file>";
            }
        }
    ?>
        <!--<option value="Axe">Hache</option>
        <option value="bird">Oiseau</option>-->
    </select>
    <!--<button onclick="update()">Afficher</button>-->
    <br/>
    <span style="position:absolute;top:0px;left:0px;"><input type="button" value="Toggle Wireframe" onclick="mesh.material.wireframe=!mesh.material.wireframe;meshFloor.material.wireframe=!meshFloor.material.wireframe;"/> ZQSD : pour bouger. &nbsp; &nbsp; &nbsp; Les flèches : pour tourner</span>

</body>

</html>