<?php
session_start();


function menu1(){
    file_put_contents("menu.html",
    '<nav style="margin-left:10px;">
        <ul class="menu">
        <!-- <li><a href="">Présentation</a></li> -->
        <li><a href="database.php">Données</a></li>
        <li><a href="3D.php">Designs 3D</a></li>
        <li><a href="univers.php">L\'Univers</a></li>
        <li><a href="contact.php"></a>Contactez-nous</li>
        <li><a href="../">Site général</a></li>
    
        </ul>
    </nav>
    ');
    echo "<p>Menu 1 appliqué</p>";
}
function menu2(){
    file_put_contents("menu.html",
    '<nav style="margin-left:10px;">
        <ul class="menu">
          <li><a href="about.php">À propos de nous</a></li>
          <li><a href="offers.php">Offres</a></li>
          <li><a href="database.php">Données</a></li>
          <li><a href="3D.php">Designs 3D</a></li>
          <li><a href="success.php">Réussites</a></li>
          <li><a href="contact.php"></a>Contactez-nous</li>  
        </ul>
    </nav>
    ');
    echo "<p>Menu 2 appliqué</p>";
}
?>
<p>Changer le menu</p>
<form method="get">
<input type="submit" name="menu1" value="menu1">Menu 1 (Wiki)</input>
<input type="submit" name="menu2" value="menu2">Menu 2 (Company)</input>
</form>

<?php
if(isset($_GET['menu1'])){
    menu1();
}else if(isset($_GET['menu2'])){
    menu2();
}

print_r($_GET);
?>

<a href="database.php">Rejoindre le site</a>