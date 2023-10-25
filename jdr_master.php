<?php 
session_start();
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
        <script src="JDRmaster.js" defer></script>
        <title>Eden JDR</title>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!-- Never forget the viewport ! -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        <?php }else{ 
            // <!-- <p>connected</p> -->
            include 'jdr_master.html';
        } ?>
    </body>
</html>
    