<?php

$name = $_POST['name'];

if($name == "persos" && isset($_COOKIE[$name.'JSON'])) {
    file_put_contents('JDR'.$name.'.json', $_COOKIE[$name.'JSON']);
    print_r($_COOKIE[$name.'JSON']);
}


if(($name == "skills" || $name == "eqpt") && isset($_COOKIE[$name.'JSON'])) {

    $file = file_get_contents('JDR'.$name.'.json', true);
    $file = json_decode($file);
    print_r($file);

    
    foreach(json_decode($_COOKIE[$name.'JSON']) as $key => $value) {
        $file->$key = $value;
        print_r($key);
        print_r($value);
    }

    var_dump($file);
    file_put_contents('JDR'.$name.'.json', json_encode($file));
}
?>

<meta http-equiv="refresh" content="5; URL=./jdr.html">