<?php
$dir = './images/jdrgalerie';
$files = scandir($dir);
print_r($files);

file_put_contents('JDRgalery.json', json_encode($files));

?>