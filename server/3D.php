<?php
include("header.php");

if(isset($_GET["data"])){
    $repository = $_GET["data"];
    $files = scandir("images/3D/$repository/");
}

?>

<!-- 

Noesis paramètres avancés pour l'export :
https://www.reddit.com/r/ffxioffline/comments/653onc/noesis_advanced_export_optionscommands/

Noesis Wiki (+ QuickBMS) et d'autres outils à regarder :
https://wiki.vg-resource.com/Noesis , Noesis Download : http://www.richwhitehouse.com/index.php?content=inc_projects.php&filemirror=noesisv4464.zip

-->

<script defer type="module" src="three.min.js"></script>
<script defer type="module" src="MTLLoader.js"></script>
<script defer type="module" src="OBJLoader.js"></script>
<script defer type="module" src="threeEden.js"></script>

<body style="overflow:hidden; text-align:center;margin-top:0px;">
    <header class="header3D">
        <!--<input type="button" value="Toggle Wireframe" onclick="mesh.material.wireframe=!mesh.material.wireframe;meshFloor.material.wireframe=!meshFloor.material.wireframe;" />--> 
        <span class="commandes">ZQSD : bouger  &nbsp;  &nbsp; ↨ (R/F) : monter/descendre &nbsp; &nbsp; &harr; : tourner  &nbsp; &nbsp; <span class='customCommand'></span></span>
        <nav>
        <ul class="menu">
        <?php if(isset($_GET['data'])){ ?>
            <li><a href="3D.php" class="notranslate">3D Designs</a></li>
        <?php } ?>
        <li><a href="index.php">Page principale</a></li>
        </ul>
        </nav>
        <!-- 09/06 Ajout du Toggle pour le Background -->
        <div style="margin-right:17px;">
        <label class="switch" title="Afficher l'arrière plan" id="iconBG">
        <input id="bgToggle" type="checkbox" <?php if(isset($_COOKIE['bgState'])){ echo $_COOKIE['bgState'];} ?> />
        <span class="slider round"></span>
        </label>
        <label class="switch" title="Jouer la musique" id="iconBGM">
        <input id="bgmToggle" type="checkbox" <?php if(isset($_COOKIE['bgmState'])){ echo $_COOKIE['bgmState'];} ?> />
        <span class="slider round"></span>
        </label>
        <!-- 07/05 Ajout du Toggle pour white background -->
        <label class="switch" title="White background" id="iconWhiteBG">
        <input id="whiteBgToggle" type="checkbox" <?php if(isset($_COOKIE['whiteBgState'])){ echo $_COOKIE['whiteBgState'];} ?> />
        <span class="slider round"></span>
        </label>
        </div>
        
    </header>
<?php 
if(!isset($_GET["data"])){
    ?>
    
<div class="dbMenu">
    <ul>
        <a href="3D.php?data=monsters"><li><img src="images/monsters/m081.png" /> Ennemis / Persos</li></a>
        <!--<a href="3D.php?data=char"><li><img src="images/skillIcon/m321.png" /> Costumes (RGB)</li></a>-->
        <a href="3D.php?data=house"><li><img src="images/items/I00466.png" alt="Bâtiments" /> Bâtiments</li></a>
        <a href="3D.php?data=items"><li><img src="images/items/W25502.png" alt="Armements" /> Armements</li></a>
        <a href="3D.php?data=ride"><li><img src="images/items/i00887.png" alt="Montures" /> Montures</li></a>
        <a href="3D.php?data=maps"><li><img src="images/otherIcon/group037.png" alt="Donjons" /> Donjons</li></a>
    </ul>
</div>
    <?php
exit();
}
?>
<div class="select3D">
    <img id="iconPic" class="iconImg" onerror='document.getElementById("iconPic").style.display = "none"'; />
    <span style="font-size:20px">&#8616;</span> 
    <select id="objets">
    <?php
        if($repository == "maps"){
            echo "<option value=''>Sélectionner ...</option>";

            $maplist = json_decode(file_get_contents("maps.json"),true);
        }
        foreach($files as $file){
            if(strpos($file,".obj") !== false){
                // On garde tout sauf l'extension
                $file = strtok($file,  '.');  
                if($repository == "maps"){ 
                    if($file[0] == "S"){ // Si le fichier est bien une carte (S***.obj), # 1er char = "S"
                        
                        if(isset($maplist[ intval(substr($file,1)) ])){
                            $mapName = $maplist[ intval(substr($file,1))]["name"];
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
    </select>
    <select id="colors">
    <!-- Colors (variants) Select -->
    <?php
        if($repository == "monsters"){
            // Create all colors options
            foreach($files as $file){
                if(strpos($file,".png") !== false){
                    // On garde tout sauf l'extension
                    $file = strtok($file,  '.');  
                    echo "<option value=$file>".substr($file,-2)."</option>";
                }
            }    
        }    
    ?>
   </select>
</div>
<h2 id="loading" class="notranslate"></h2>
<div id="canvasPosition"></div>
<audio loop><source type="audio/ogg" /></audio>
<footer>
<div class="grid-container">
  <div class="grid-item"><img id="turnLeft" src="images/layout/arrow2.png" alt="Arrow" style="transform: rotate(235deg);" /></div>
  <div class="grid-item"><img id="up" src="images/layout/arrow2.png" alt="Arrow" style="transform: rotate(0deg);" /></div>
  <div class="grid-item"><img id="turnRight" src="images/layout/arrow2.png" alt="Arrow" style="transform: rotate(125deg);" /></div>  
  <div class="grid-item"><img id="prev" src="images/layout/arrow2.png" alt="Arrow" style="transform: rotate(0deg);" /></div>
  <div class="grid-item"><img id="left" src="images/layout/arrow2.png" alt="Arrow" style="transform: rotate(270deg);" /></div>
  <div class="grid-item"></div>  
  <div class="grid-item"><img id="right" src="images/layout/arrow2.png" alt="Arrow" style="transform: rotate(90deg);" /></div>
  <div class="grid-item"></div>
  <div class="grid-item"></div>  
  <div class="grid-item"><img id="down" src="images/layout/arrow2.png" alt="Arrow" style="transform: rotate(180deg);" /></div>  
  <div class="grid-item"></div>  
  <div class="grid-item"><img id="next" src="images/layout/arrow2.png" alt="Arrow" style="transform: rotate(180deg);" /></div>  
</div>
</footer>
</body>
</html>