<?php
include("header.php");
?>

<!-- 

Noesis paramètres avancés pour l'export :
https://www.reddit.com/r/ffxioffline/comments/653onc/noesis_advanced_export_optionscommands/

Noesis Wiki (+ QuickBMS) et d'autres outils à regarder :
https://wiki.vg-resource.com/Noesis , Noesis Download : http://www.richwhitehouse.com/index.php?content=inc_projects.php&filemirror=noesisv4464.zip

-->
<body onload="init(1152, 648)" style="overflow:hidden; text-align:center;margin-top:0px;">
<header style="display:flex;justify-content:space-between;margin-bottom:-5px;">
    <input type="button" value="Toggle Wireframe" onclick="mesh.material.wireframe=!mesh.material.wireframe;meshFloor.material.wireframe=!meshFloor.material.wireframe;" /> ZQSD : pour bouger.  &nbsp; &nbsp; &#8616; : pour changer d'image (sauf sur les maps).  &nbsp; &nbsp; &harr; : pour tourner
  
<a href="index.php"><button class="root" style="margin-right: 27px;">Retourner au menu  d'Eden</button></a>

    <!-- 09/06 Ajout du Toggle pour le Background -->
    <div>
    <p style="margin:0px;margin-right:15px;">Afficher l'arrière plan</p>
    <label class="switch">
    <input id="backgroundToggle" type="checkbox" <?php if(isset($_COOKIE['backgroundState'])){ echo $_COOKIE['backgroundState'];} ?> />
    <span class="slider round"></span>
    </label>
    </div>
    
</header>
<img id="iconPic" class="iconImg" />
<h2 id="loading"></h2>
<span style="font-size:20px;">&#8616;</span> <select onchange="update(); changeIcon();" id="objets">
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
                if($repository == "map"){ 
                    if($file[0] == "S"){ // Si le fichier est bien une carte (S***.obj), # 1er char = "S"
                        if(isset($_SESSION["maplist"][substr($file,1)][0])){
                            $mapName = $_SESSION["maplist"][substr($file,1)][0];
                            echo "<option value=$file>$mapName</option>";
                        }else{
                            echo "<option value=$file>$file</option>";
                        }
                    }
                }else{
                    echo "<option value=$file>$file</option>";
                }
            }
        }
    ?>
        <!--<option value="Axe">Hache</option>
        <option value="bird">Oiseau</option>-->
    </select>
    <script type="text/javascript">
    
    document.getElementById("iconPic").style.display = "none";

    function changeIcon(){
        if(window.location.search.split('=')[1] == "items"){
            file = document.getElementById("objets").value.slice(1); // On récupère tout sauf le "w" "W"

            letter = ["w","W"];
            
            document.getElementById("iconPic").style.display = "none";
            for (let i = 0; i < letter.length; i++) {
                if(UrlExists("http://voldre.free.fr/Eden/images/itemIcon/"+letter[i]+file+"01.png")){
                    document.getElementById("iconPic").style.display = "block";
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