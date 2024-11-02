<?php

session_start();

    if(isset($_POST['action'])){
        if ($_POST['action'] == "jdrGalerie") { 
            $dir = './images/jdrgalerie';
            $files = scandir($dir);
            print_r($files);
            
            // Files must not contain any accents !!!
            file_put_contents('JDRgalery.json', json_encode($files,JSON_UNESCAPED_UNICODE));
        }
        
        if ($_POST['action'] == "wallpaper") { 
            $dir = './images/wallpaper';
            $files = scandir($dir);
            echo json_encode($files,JSON_UNESCAPED_UNICODE);
        }

        if ($_POST['action'] == "chatGpt") { 
            $chatgptkey = getenv('chatgpt_api'); 

            if(!isset($chatgptkey)){
                echo false;
            }else{
                echo $chatgptkey;
            } 
        }

        if ($_POST['action'] === "saveFile") { 
            
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
                file_put_contents('JDR'.$name.'.json', json_encode($file,JSON_UNESCAPED_UNICODE));
                echo true;
            } 
            echo false;
        }
        
        if ($_POST['action'] === "saveBackup") {            
            if(isset($_SESSION['login'])){
                $file = file_get_contents('JDRpersos.json', true);
                file_put_contents('JDRpersos_backup.json', $file);
                echo "JDRpersos_backup.json saved, <br/>";
                
                $file2 = file_get_contents('JDRplayer.json', true);
                file_put_contents('JDRplayer_backup.json', $file2);
                echo "JDRplayer_backup.json saved";
            }else{
                echo "Not connected";
            }
        }

        if($_POST['action'] === 'logout'){
            session_destroy();
            echo true;
        }
    }
?>
