<!DOCTYPE html>
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

    <!--<script src="jquery-3.6.0.min.js"></script>-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

    <meta charset="utf-8">
    <title>Démonstration 3D</title>
    <script type="text/javascript" src="three.min.js"></script>
    <script type="text/javascript" src="MTLLoader.js"></script>
    <script type="text/javascript" src="OBJLoader.js"></script>

    <script type="text/javascript" src="threeEden.js"></script>
</head>
<body onload="init(1152, 648)" style="overflow:hidden; text-align:center;">
    <a href="index.php"><button class="root">Retourner au menu  d'Eden</button></a>
    <span style="font-size:20px">&#8616;</span> <select onchange="update(); changeIcon();" id="objets">
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
            }
        }
    ?>
        <!--<option value="Axe">Hache</option>
        <option value="bird">Oiseau</option>-->
    </select>
    <h2 id="loading"></h2>
        <img id="iconPic" class="iconImg" />

    <!--<button onclick="update()">Afficher</button>-->
    <br/>
    <span style="position:absolute;top:0px;left:0px;"><input type="button" value="Toggle Wireframe" onclick="mesh.material.wireframe=!mesh.material.wireframe;meshFloor.material.wireframe=!meshFloor.material.wireframe;"/> ZQSD : pour bouger.  &nbsp; &nbsp; &nbsp; &#8616; : pour changer d'image (sauf sur les maps).  &nbsp; &nbsp;   &harr; : pour tourner</span>

    <script type="text/javascript">
    
    document.getElementById("iconPic").style.visibility = "hidden";

    function changeIcon(){
        if(window.location.search.split('=')[1] == "items"){
            file = document.getElementById("objets").value.slice(1); // On récupère tout sauf le "w" "W"

            letter = ["w","W"];
            
            document.getElementById("iconPic").style.visibility = "hidden";
            for (let i = 0; i < letter.length; i++) {
                if(UrlExists("http://voldre.free.fr/Eden/images/itemIcon/"+letter[i]+file+"01.png")){
                    document.getElementById("iconPic").style.visibility = "visible";
                    document.getElementById("iconPic").src = "http://voldre.free.fr/Eden/images/itemIcon/"+letter[i]+file+"01.png";
                    break;
                }
            }
        }
    }

    function UrlExists(url)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!=404;
    }
    </script>

    <div style="display:none;" id="listTextures"></div>
</body>

</html>