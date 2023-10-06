<?php 

$chatgptkey = getenv('chatgpt_api'); 

if(!isset($chatgptkey)){
    echo false;
}else{
    echo $chatgptkey;
}
?>