<?php
include("header.php");
include("menu2.html");
?>
<body>
<div class="dbMenu">
    <ul>
        <a href="univers.php?data=maps"><li><img src="images/maps/S013m.png" /><p style="display:inline-block;width: 48%;height: 24px;"> Régions </p><a href="univers.php?data=worldmap"><img src="images/worldmapIcon.png" class="mapIcon" ></a></li></a>
        <a href="univers.php?data=class"><li><img src="images/skillIcon/E0013.png" /> Classes</li></a>
        <a href="univers.php?data=videos"><li><img src="images/uiiconPNG/script00.png" />Trailers / Openings</li></a>
    </ul>
</div>

<?php

$maplist = $_SESSION["maplist"];

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
        <div class="container" style="overflow-y: hidden;">
        <div class="continent" style="max-width:70%; max-height:70%:" >
        <?php
            foreach($maplist as $key=>$value){
                if(isset($value[3]) && $value[3]==0){
                    echo "<a href='univers.php?data=map&map=".$key."'><div class='point' style='top:".$value[1]."%; left:".$value[2]."%;' ><p class='name'>".$value[0]."</p></div></a>";
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
                    echo "<a href='univers.php?data=map&map=".$key."'><div class='point' style='top:".$value[1]."%; left:".$value[2]."%;' ><p class='name'>".$value[0]."</p></div></a>";
                }
            }
        ?>
        <img src="images/mapworld02.png" style="max-width:47%;" />
    
        <?php
            foreach($maplist as $key=>$value){
                if(isset($value[3]) && $value[3]==1){
                    echo "<a href='univers.php?map=".$key."'><div class='point' style='top:".$value[1]."%; left:".$value[2]."%;' ><p class='name'>".$value[0]."</p></div></a>";
                }
            }
        ?>
        <img src="images/mapworld03.png" style="max-width:47%;" />
    
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
        <iframe src="https://www.youtube.com/embed/Jr9b2L2_kvM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <iframe src="https://www.youtube.com/embed/Vf-qP5joSsg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 <?php
    }else if($_GET["data"] == "map"){
        echo "<h2>".$maplist[$_GET["map"]]["name"]."<a href='3D.php?data=maps&map=".$_GET["map"]."'> lien </a></h2>";
    }
}
?>
</body>
</html> 
