<?php

session_start();

print_r($_SESSION['login']);

if(isset($_SESSION['login'])){
    $file = file_get_contents('JDRpersos.json', true);
    file_put_contents('JDRpersos_backup.json', $file);
    echo "JDRpersos_backup.json saved";
}else{
    echo "Not connected";
}
?>

<meta http-equiv="refresh" content="2; URL=./jdr.html">