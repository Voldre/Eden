<?php

$name = $_POST['name'];

if(isset($_COOKIE[$name.'JSON'])) {

    // 29/11 : Remove print_r, echo and var_dump, to reduce time of save
    // print_r($_COOKIE[$name.'JSON']);
    // echo "<br/><br/>";
    // print_r(json_decode($_COOKIE[$name.'JSON']));
    $file = json_decode(file_get_contents('JDR'.$name.'.json', true));
    // print_r($file);

    foreach(json_decode($_COOKIE[$name.'JSON']) as $key => $value) {
        $file->$key = $value;
        // print_r($key);
        // print_r($value);
    }

    // var_dump($file);
    file_put_contents('JDR'.$name.'.json', json_encode($file));
}
?>

<meta http-equiv="refresh" content="0; URL=./jdr.html">