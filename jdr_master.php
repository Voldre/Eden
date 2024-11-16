<?php 
session_start();

if(isset($_GET['logout'])){
    session_destroy();
    echo "window.location.href = http://voldre.free.fr/Eden/jdr_master.php";
    // header("Location: http://http://voldre.free.fr/Eden/jdr_master.php", true, 301);  
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="description" content="Eden Eternal - Fiches de personnages pour JDR (Jeu De Rôle)">
        <link rel="stylesheet" href="http://voldre.free.fr/style.css">
        <link rel="stylesheet" href="eden.css">
        <link rel="stylesheet" href="JDRstyle.css">
        <!--<script src="jquery-3.6.0.min.js"></script>-->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        
        <script type="module" src="JDRmaster.js" defer></script>
        
        <title>Eden JDR</title>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!-- Never forget the viewport ! -->
        <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86">
        <!-- <link type="text/css" rel="stylesheet" charset="UTF-8" href="https://www.gstatic.com/_/translate_http/_/ss/k=translate_http.tr.69JJaQ5G5xA.L.W.O/d=0/rs=AN8SPfpC36MIoWPngdVwZ4RUzeJYZaC7rg/m=el_main_css"><script type="text/javascript" charset="UTF-8" src="https://translate.googleapis.com/_/translate_http/_/js/k=translate_http.tr.fr.xzcOHDlE6Fc.O/d=1/exm=el_conf/ed=1/rs=AN8SPfrWILEaI2rfUPi9GzxamtXuZkMSHg/m=el_main"></script> -->
    </head>
    <body>
        <nav style="margin-left:10px;">
            <ul class="menu">
                <!-- <li><a href="">Présentation</a></li> -->       
        <li><a href="univers.php">L'Univers</a></li>
            <!--  # Races # Classes -->
        <li><a href="jdr.html">Fiches de persos</a></li>
                <!--  # Races # Classes -->
        <li><a href="3D.php">Designs 3D</a></li>
            </ul>
        </nav>
        <?php
        if(!isset($_SESSION['login'])){
        ?>
        <form action="JDRlogin.php" method="post">
            <input type="text" name="username" required />
        <input type="password" name="mdp" required />
        <input type="submit" name="login" value="Connexion" />
        </form>
        <br/>
        <!-- For player -->
        <div id="toast"></div>
        <label for="tour">Tour n°</label>
        <input type="number" name="tour" id="tour" value="1" style="width: 46px" />
        <div class="infoEnnemi" id="e0">
            <div class="enemyType" >
                <div class="classic">
                <select name="ennemi" class="ennemi"></select>
                <img class="icon" style="width: 45px; height: 45px;" src="" alt="">
                </div>
            </div>
            <p class="visuel"></p>
            <br/>
            <input style='width: 38px;' type='number' id="pv" name="pv"></input>
            <input style='width: 38px;' type='number' id="pvmax" name="pvmax"></input>
            <label for="pv">PV/Max </label><span id="weaknesses"></span>
            <img src="images/layout/combat_boss.png" id="boss_icon" class="hide icon" style="float: right" />
            <br />
            <p class="competence"></p>
            <p class="competence"></p>
            <p class="competence"></p>
            <p class="competence"></p>
            <div class="stats">
                <div class="stat" ><label for="force">Force</label>
                    <input type='number' min="1" max="17" id="force" name="force"></input>
                    <input type='number' min="-10" max="10" class="statB"></input>
                </div>
                <div class="stat" ><label for="dexté">Dextérité</label>
                    <input type='number' min="1" max="17" id="dexté" name="dexté"></input>
                    <input type='number' min="-10" max="10" class="statB"></input>
                </div>
                <div class="stat" ><label for="intel">Intelligence</label>
                    <input type='number' min="1" max="17" id="intel" name="intel"></input>
                    <input type='number' min="-10" max="10" class="statB"></input>
                </div>
                <div class="stat" ><label for="charisme">Charisme</label>
                    <input type='number' min="1" max="17" id="charisme" name="charisme"></input>
                    <input type='number' min="-10" max="10" class="statB"></input>
                </div>
                <div class="stat" ><label for="esprit">Esprit</label>
                    <input type='number' min="1" max="17" id="esprit" name="esprit"></input>
                    <input type='number' min="-10" max="10" class="statB"></input>
                </div>
            </div>
            <p id="infos" class="hide"></p>
            <input type="text" class="commentaire" placeholder="est étourdi, attiré par, enragé, ... prépare une ataque..."></input>
            <button name="nextTurn" class="nextTurn" style="float: none;" id="pnjTurnE">+</button>
            <br/>
            <div id="buffs">
                <input type="number"/>
                <input type="text" class="buff" placeholder="effet / montant / durée"></input>
                <br/>
                <input type="number"/>
                <input type="text" class="buff" placeholder="effet / montant / durée"></input>
                <br/>
                <input type="number"/>
                <input type="text" class="buff" placeholder="effet / montant / durée"></input>
                <br/>
                <input type="number"/>
                <input type="text" class="buff" placeholder="effet / montant / durée"></input>
            </div>
            <div class="enemyDesc">
            <p id="drop" class="hide"></p>
            <p id="desc"></p>
            </div>
        </div>
        <div class="playersInfo hide">
            <input type="text" id="pList" style="width:125px"></input><button name="updatePInfo" id="updatePInfo">Update</button>  &nbsp; Nb P : <input type="number" name="nbP" id="nbP" value="3" style="width:10px"></input>, PV et DGT : <span id="variation"></span>
            <ul id="pInfo"></ul>
        </div>
        <footer style="margin-bottom:60px">
            <br/>
            <button id="buttonIframe" style="z-index: 10;  position: absolute;">Afficher le site</button>
            <iframe class="hide" src="http://voldre.free.fr/Eden/univers.php?data=worldmap" style="width: 100vw; height: 92vh;border-top: 4px double wheat; margin-left: -8px;" frameborder="0"></iframe>
        </footer>
        <?php }else{ 
            // <!-- <p>connected</p> -->
            include 'jdr_master.html';
        } ?>
    </body>
</html>
    