<?php

session_start();

print_r($_POST);
echo  password_hash($_POST['mdp'], PASSWORD_BCRYPT)."<br/>";
echo  password_hash($_POST['mdp'], PASSWORD_BCRYPT);
if(isset($_POST['login'])){
    if(!isset($_POST['username']) || !isset($_POST['mdp'])){
        exit('Mot de passe et login nécessaire');
    }else{
        if($_POST['username'] == "etincellia" && password_verify($_POST['mdp'], '$2y$10$axhMYbrOHajA7PouuLWjC.B5spkil3cTKR4EbIZ6/uxOL/BRNU4pK')){
            echo '<h3>Connected</h3>';
            $_SESSION['login'] = true;
        }else{
            echo '<h3>Erreur de connexion.</h3>';
            unset($_SESSION);
        }
    }
}else{
    echo 'Pas de login saisi';
}
?>
<meta http-equiv="refresh" content="5; URL=./jdr_master.php">
