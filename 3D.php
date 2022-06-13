<?php
include("header.php");
?>

<!-- 

Noesis paramètres avancés pour l'export :
https://www.reddit.com/r/ffxioffline/comments/653onc/noesis_advanced_export_optionscommands/

Noesis Wiki (+ QuickBMS) et d'autres outils à regarder :
https://wiki.vg-resource.com/Noesis , Noesis Download : http://www.richwhitehouse.com/index.php?content=inc_projects.php&filemirror=noesisv4464.zip

-->
<body onload="init()" style="overflow:hidden; text-align:center;margin-top:0px;">
<header class="header3D">
    <!--<input type="button" value="Toggle Wireframe" onclick="mesh.material.wireframe=!mesh.material.wireframe;meshFloor.material.wireframe=!meshFloor.material.wireframe;" />--> 
    <span class="commandes">ZQSD : pour bouger  &nbsp;  &nbsp;  &#8616; : pour changer d'image (sauf sur les maps).  &nbsp; &nbsp; &harr; : pour tourner</span>
    <nav>
    <ul class="menu">
      <?php if(isset($_GET['data'])){ ?>
        <li><a href="3D.php">Designs 3D</a></li>
      <?php } ?>
      <li><a href="index.php">Page principale</a></li>
    </ul>
</nav>
    <!-- 09/06 Ajout du Toggle pour le Background -->
    <div style="margin-right:17px;">
    <p style="margin:0px;">Afficher l'arrière plan</p>
    <label class="switch">
    <input id="backgroundToggle" type="checkbox" <?php if(isset($_COOKIE['backgroundState'])){ echo $_COOKIE['backgroundState'];} ?> />
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
        <a href="3D.php?data=house"><li><img src="images/items/I00466.png" /> Bâtiments</li></a>
        <a href="3D.php?data=items"><li><img src="images/items/W25502.png" /> Armements</li></a>
        <a href="3D.php?data=ride"><li><img src="images/items/i00887.png" /> Montures</li></a>
        <a href="3D.php?data=maps"><li><img src="images/otherIcon/group037.png" /> Donjons</li></a>
    </ul>
</div>
    <?php
exit();
}
?>
<div class="select3D">
    <img id="iconPic" class="iconImg" onerror='document.getElementById("iconPic").style.display = "none"'; />
    <span style="font-size:20px">&#8616;</span> <select onchange="update(); changeIcon();" id="objets">
    <?php
        //$monsterRepository = 'images/monster/';
        if(isset($_GET["data"])){
            $repository = $_GET["data"];
        }
        $files = scandir("images/3D/$repository/");
        foreach($files as $file){
            if(strpos($file,".obj") !== false){
                // On garde tout sauf l'extension
                $file = strtok($file,  '.');  
                if($repository == "maps"){ 
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
</div>
<h2 id="loading"></h2>
<div id="canvasPosition"></div>
    <script type="text/javascript">
    
    document.getElementById("iconPic").style.display = "none";

    function changeIcon(){
        foldersWithIcons = ['items','monsters'];
        currentFolder = window.location.search.split('=')[1];
        if(foldersWithIcons.includes(currentFolder)){
            file = document.getElementById("objets").value.slice(1); // On récupère tout sauf la 1ere lettre

            if(currentFolder == "items"){letter = "W";}else{ letter = "m"}

            // Update 12/06/2022 pour mieux gérer l'affichage ou non de l'icone
            document.getElementById("iconPic").style.display = "block";
            if(currentFolder == "items"){ file = file + "01";}
            document.getElementById("iconPic").src = "images/"+currentFolder+"/"+letter+file+".png";
        }
    }
    </script>
<footer>
<div class="grid-container">
  <div class="grid-item"></div>
  <div class="grid-item"><img id="up" src="images/arrow2.png" style="transform: rotate(0deg);" /></div>
  <div class="grid-item"></div>  
  <div class="grid-item"><img id="prev" src="images/arrow2.png" style="transform: rotate(0deg);" /></div>
  <div class="grid-item"><img id="left" src="images/arrow2.png" style="transform: rotate(270deg);" /></div>
  <div class="grid-item"></div>  
  <div class="grid-item"><img id="right" src="images/arrow2.png" style="transform: rotate(90deg);" /></div>
  <div class="grid-item"></div>
  <div class="grid-item"></div>  
  <div class="grid-item"><img id="down" src="images/arrow2.png" style="transform: rotate(180deg);" /></div>  
  <div class="grid-item"></div>  
  <div class="grid-item"><img id="next" src="images/arrow2.png" style="transform: rotate(180deg);" /></div>  
</div>
</footer>
</body>
</html>