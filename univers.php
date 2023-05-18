<?php
include("header.php");
include("menu.html");
?>
<body>
<a target="_blank" style="color:rgb(0,125,255)" href="https://edeneternal.fandom.com/wiki/">Wiki Eden English (with maps and classes)</a>
<div class="dbMenu">
    <ul>
        <a href="univers.php?data=maps"><li><img src="images/maps/S013m.png" /><p style="display:inline-block;width: 48%;height: 24px;"> Régions </p><a href="univers.php?data=worldmap"><img src="images/worldmapIcon.png" class="mapIcon" ></a></li></a>
        <a href="univers.php?data=class"><li><img src="images/skillIcon/E0013.png" /> Classes</li></a>
        <a href="univers.php?data=videos" class="notranslate"><li><img src="images/uiiconPNG/script00.png" />Trailers / Openings</li></a>
    </ul>
</div>

<?php

global $audioMap;
$audioMap = json_decode(file_get_contents("audioMap.json"),true);

$maplist = $_SESSION["maplist"];

function All($value){
    return true;
}
function Mondes($value){
    if($value["wmap"] <= 2){
        return true;
    }else{ return false; }
}
function Donjons($value){
    if($value["wmap"] <= 2){
        return false;
    }else{ return true; }
}

if(isset($_GET["data"])){
    if($_GET["data"] == "maps"){
        ?>
        <form method="POST" action="univers.php?data=maps">
            <select name="filter">
            <option value="All">Toutes les cartes</option>
            <option value="Mondes">Cartes du monde</option>
            <option value="Donjons">Cartes des Donjons</option>
            </select>
            <input type="submit" value="Modifier">
        </form>
        <h2>Liste des maps</h2>
        <div class='container' style="max-height:545px">
        <?php
            if(!isset($_POST["filter"])){
                $_POST["filter"] = "All";
            }
            foreach(array_filter($maplist, $_POST["filter"]) as $key=>$value){
                echo"<div class='img-block'>";
                echo "<p>".$value["name"]."</p>";
    
                $keyZ = $key;
                while(strlen($keyZ)<3){
                    $keyZ = "0$keyZ";
                }
                $img = "maps/S".$keyZ."m.png";
     
                echo "<a href='univers.php?data=map&map=".$key."'>";
                echo "<div class='hover-animation'>";
                echo "<img class='pictures image-back' src='images/".$img."' />";
                echo "<img class='pictures image-front' src='images/loadingframe/Loading_".$key.".png' />";
                echo "</div></a></div>";
            }
    }else if($_GET["data"] == "worldmap"){
    
        ?>
        <div id="worldmapContainer" class="container" style="overflow-y: hidden;">
        <div class="select3D" style="left:auto;z-index:10;margin:0px;padding:0px;">
            <ul style="display:flex;margin:0px;padding:0px;">
                <li class="mapMenu"  data-map=1>Sud-Ouest</li>
                <li class="mapMenu activate" data-map=0>Central <img src="images/otherIcon/function026.png" class="YVES"></li>
                <li class="mapMenu" data-map=2>Sud-Est</li>
            </ul>
        </div>
            <div class="continent active" id="C0">
            <?php
                foreach($maplist as $key=>$value){
                    if(isset($value["wmap"]) && $value["wmap"]==0){
                        echo "<a href='univers.php?data=map&map=".$key."'><div class='point' style='top:".$value["wmap_x"]."%; left:".$value["wmap_y"]."%;' ><p class='name'>".$value["name"]."</p></div></a>";
                    }
                }
            ?>
                <img id="worldmap01" src="images/mapworld01-YVES.png"/>
            </div>
            <div class="continent" id="C1">
            <?php
                foreach($maplist as $key=>$value){
                    if(isset($value["wmap"]) && $value["wmap"]==1){
                        echo "<a href='univers.php?data=map&map=".$key."'><div class='point' style='top:".$value["wmap_x"]."%; left:".$value["wmap_y"]."%;' ><p class='name'>".$value["name"]."</p></div></a>";
                    }
                }
            ?>
                <img src="images/mapworld02.png"/>
            </div>
            <div class="continent" id="C2">
            <?php
                foreach($maplist as $key=>$value){
                    if(isset($value["wmap"]) && $value["wmap"]==2){
                        echo "<a href='univers.php?data=map&map=".$key."'><div class='point' style='top:".$value["wmap_x"]."%; left:".$value["wmap_y"]."%;' ><p class='name'>".$value["name"]."</p></div></a>";
                    }
                }
            ?>
                <img src="images/mapworld03.png"/>
            </div>
        </div>
       
        <?php
    }else if($_GET["data"] == "class"){
        ?>
        <h3>Wiki Eden Eternal - Fandom</h3>
        <iframe style="width: 97%;
        display: flex;
        flex-direction: column;
        min-height: 600px;
        height: auto !important;" src="https://edeneternal.fandom.com/wiki/Class" title="description"></iframe> 
        <p>Second wiki : https://eden-eternal.fandom.com/fr/wiki/Classes</p>
        <p>Troisième wiki : https://edenfr.wordpress.com/ </p>
        <?php        
    }else if($_GET["data"] == "videos"){
        ?>
        <div class="flexContainer">
        <iframe src="https://www.youtube.com/embed/Ks9kTC_vzLQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <iframe src="https://www.youtube.com/embed/cp1cKHJw_yA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <iframe src="https://www.youtube.com/embed/Jr9b2L2_kvM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <iframe src="https://www.youtube.com/embed/Vf-qP5joSsg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            
 <?php
    }else if($_GET["data"] == "map"){
        echo "<h2>".$maplist[$_GET["map"]]["name"]."<a href='3D.php?data=maps&map=".$_GET["map"]."'> lien </a></h2>";

        $keyZ = $_GET["map"];
        while(strlen($keyZ)<3){
            $keyZ = "0$keyZ";
        }
        $img = "maps/S".$keyZ."m.png";
        
        
        $bgm = $maplist[$_GET["map"]]["bgm"];
        while(strlen($bgm)<3){
            $bgm = "0$bgm";
        }
        echo "<div class='img-block'>";
        echo "<img class='pictures' style='width:300px;' src='images/".$img."' />";
        echo "<img class='pictures' style='width:300px;' src='images/loadingframe/Loading_".$_GET["map"].".png' />";
        echo "</div></a></div>";
        
        echo "<div>";
        // echo "<p>".explode(".",$file)[0]."</p>";
        // echo "<p>OST : ".$audioMap[explode(".",$file)[0]]."</p>";
        echo "<audio loop controls ><source src='bgm/bgm$bgm.ogg' type='audio/ogg' /></audio>";
        echo "</div>";
        echo "<h3>Description</h3>";
        if(isset($maplist[$_GET["map"]]["desc"])){
            $description = str_replace("\\n","<br/>",json_encode($maplist[$_GET["map"]]["desc"]));
            echo "<p>".json_decode($description)."</p>";
        }
    }
}
?>
<script>
    document.querySelector("#worldmapContainer").addEventListener('click', e =>{
        if(e.target.matches('li')){
            if(e.target.dataset.map == null){
                e.target.dataset.map = 0;
            }
            document.querySelector(".activate").classList.remove('activate');
            e.target.classList.add('activate');
            mapID = e.target.dataset.map;
            document.querySelector(".active").classList.remove('active');
            document.querySelector("#C"+mapID).classList.add('active');
        }
    });

    document.querySelector(".YVES").addEventListener('click', e =>{
        if(document.querySelector("#worldmap01").src.includes('YVES')){
            document.querySelector("#worldmap01").src = "images/mapworld012.png";
            // document.querySelectorAll(".point").style.backgroundImage = 'url("images/mapIcon_1.png")';
            // document.querySelectorAll(".point:hover").style.backgroundImage = 'url("images/mapIcon_2.png")';
        }else{  document.querySelector("#worldmap01").src = "images/mapworld01-YVES.png"; 
        }
    })
</script>
</body>
</html> 
