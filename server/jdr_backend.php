<?php

session_start();

$log_file = __DIR__ . '/JDRerror.log';
// With following in .htaccess (for security) : 
// <Files "*.log">
// Order allow,deny
// Deny from all
// </Files>

function logger($message, $currentDate = null)
{
    global $log_file;
    $date = $currentDate ?? date('Y-m-d H:i:s');
    $full_message = "[$date] $message\n";

    // Utilisation de error_log avec un fichier personnalisé
    // error_log($full_message . PHP_EOL, 3, $log_file);
    file_put_contents($log_file, $full_message, FILE_APPEND);
}

try {
    // logger(message: "New operation : " . json_encode($_POST));

    if (isset($_POST['action'])) {
        if ($_POST['action'] == "jdrGalerie") {
            $dir = './images/jdrgalerie';
            $files = scandir($dir);
            print_r($files);

            // Files must not contain any accents !!!
            file_put_contents('JDRgalery.json', json_encode($files, JSON_UNESCAPED_UNICODE));
        }

        if ($_POST['action'] == "wallpaper") {
            $dir = './images/wallpaper';
            $files = scandir($dir);
            echo json_encode($files, JSON_UNESCAPED_UNICODE);
        }

        if ($_POST['action'] == "chatGpt") {
            $chatgptkey = getenv('chatgpt_api');

            if (!isset($chatgptkey)) {
                echo false;
                logger("ChatGPT key does not exists");
            } else {
                echo $chatgptkey;
            }
        }

        if ($_POST['action'] === "saveFile") {

            $name = $_POST['name'];

            if (isset($_COOKIE[$name . 'JSON'])) {

                // 29/11 : Remove print_r, echo and var_dump, to reduce time of save
                // print_r($_COOKIE[$name.'JSON']);
                // echo "<br/><br/>";
                // print_r(json_decode($_COOKIE[$name.'JSON']));
                $file = json_decode(file_get_contents('JDR' . $name . '.json', true));
                // print_r($file);

                foreach (json_decode($_COOKIE[$name . 'JSON']) as $key => $value) {
                    $file->$key = $value;
                    // print_r($key);
                    // print_r($value);
                }

                // var_dump($file);
                file_put_contents('JDR' . $name . '.json', json_encode($file, JSON_UNESCAPED_UNICODE));
                echo true;
            } else {
                logger("Cookie " . $name . "JSON' does not exist : " . json_encode($_POST));
            }
            echo false;
        }

        if ($_POST['action'] === "saveBackup") {
            if (isset($_SESSION['login'])) {
                $file = file_get_contents('JDRpersos.json', true);
                file_put_contents('JDRpersos_backup.json', $file);
                echo "JDRpersos_backup.json saved, <br/>";

                $file2 = file_get_contents('JDRplayer.json', true);
                file_put_contents('JDRplayer_backup.json', $file2);
                echo "JDRplayer_backup.json saved";
            } else {
                echo "Not connected";
                logger("Try to save backup without connexion");
            }
        }

        if ($_POST['action'] === 'logout') {
            session_destroy();
            echo true;
        }

        if ($_POST['action'] === 'logging') {
            logger("Frontend error : " . $_POST['value'], $_POST['date']);
            echo true;
        }

    } else if (isset($_POST['login'])) {
        if (!isset($_POST['username']) || !isset($_POST['mdp'])) {
            exit('Mot de passe et login nécessaire');
        } else {
            if ($_POST['username'] == "etincellia" && password_verify($_POST['mdp'], '$2y$10$axhMYbrOHajA7PouuLWjC.B5spkil3cTKR4EbIZ6/uxOL/BRNU4pK')) {
                $_SESSION['login'] = true;
                echo '<h3>Connecté</h3>';
                echo '<meta http-equiv="refresh" content="0; URL=./jdr_master.php">';
            } else {
                unset($_SESSION);
                echo '<h3>Erreur de connexion</h3>';
                echo '<meta http-equiv="refresh" content="0; URL=./jdr.html">';

                logger("Bad connexion : " . json_encode($_POST));
            }
        }
    }
} catch (Exception $e) {
    logger("Error catched : " . $e->getMessage());
    logger("Error operation : " . json_encode($_POST));
    if (isset($_COOKIE[$name . 'JSON'])) {
        logger("Error cookie content : " . json_encode($_COOKIE[$name . 'JSON']));

    }
    logger("Error session : " . json_encode($_SESSION));
}
?>