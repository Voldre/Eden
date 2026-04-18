<?php

session_start();
header("Access-Control-Allow-Origin: http://voldre.free.fr");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY");

// With following in .htaccess (for security) : 
// <Files "*.log">
// Order allow,deny
// Deny from all
// </Files>

function error_logger($message, $currentDate = null)
{
    $log_file = __DIR__ . '/error.log';
    $date = isset($currentDate) ? $currentDate : date('Y-m-d H:i:s');
    $full_message = "[$date] $message\n";

    // Utilisation de error_log avec un fichier personnalisé
    // error_log($full_message . PHP_EOL, 3, $log_file);
    file_put_contents($log_file, $full_message, FILE_APPEND);
}

function logger($message, $currentDate = null)
{
    $log_file = __DIR__ . '/log.log';
    $date = isset($currentDate) ? $currentDate : date('Y-m-d H:i:s');
    $full_message = "[$date] $message\n";

    file_put_contents($log_file, $full_message, FILE_APPEND);
}


$apiKey = getenv("API_KEY");

$origin = $_SERVER['HTTP_ORIGIN'];
if ($origin === "http://voldre.free.fr") {
} else {
    $providedKey = $_SERVER['HTTP_X_API_KEY'];
    if ($providedKey !== $apiKey) {
        error_logger("Tentative d'accès bloqué");
        http_response_code(403);
        echo "Accès interdit";
        exit;
    }
}

try {
    $name = $_POST['name'];
    $cookieName = $name . 'JSON';
    if (isset($_POST['loginRequired']) && !isset($_SESSION['moymoyLogin'])) {
        error_logger("Login is required for this request.");
        echo false;
    }

    if (isset($_POST['action'])) {
        if ($_POST['action'] === "saveFile") {
            $filename = $name . '.json';
            if (isset($_COOKIE[$cookieName]) && !empty($_COOKIE[$cookieName])) {

                logger("Try to save file on $filename, cookie : " . $_COOKIE[$cookieName]);

                if (!file_exists($filename)) {
                    error_logger("File '$filename' does not exist.");
                    echo false;
                    return;
                }

                $data = json_decode(file_get_contents($filename), true);
                if ($data === null) {
                    error_logger("Invalid JSON in '$filename'.");
                    echo false;
                    return;
                }

                $newData = json_decode($_COOKIE[$cookieName], true);
                if (!is_array($newData) || !isset($newData['id'])) {
                    error_logger("Invalid JSON in cookie or missing 'id'.");
                    echo false;
                    return;
                }

                $found = false;
                // Search data with id
                foreach ($data as $index => $item) {
                    if (isset($item['id']) && $item['id'] === $newData['id']) {
                        if ($_POST['toDelete'] == "1") {
                            array_splice($data, $index, 1);
                        } else {
                            // Replace the data
                            $data[$index] = $newData;
                        }
                        $found = true;
                        break;
                    }
                }
                // Else add it
                if (!$found) {
                    $data[] = $newData;
                }

                file_put_contents(
                    $filename,
                    json_encode($data, JSON_PRETTY_PRINT),
                    LOCK_EX
                );

                echo true;
                return;
            } else {
                error_logger("Cookie " . $name . "JSON does not exist : " . json_encode($_POST));
            }
            echo false;
            return;
        }

        if ($_POST['action'] === 'logout') {
            session_destroy();
            echo true;
            return;
        }

        if ($_POST['action'] === 'login') {
            if (!isset($_POST['username']) || !isset($_POST['password'])) {
                error_logger('Mot de passe et login nécessaire');
                echo false;
                return;
            } else {
                if (
                        // Only "me"
                    ($_POST['username'] == getenv('eden_master_username') && password_verify($_POST['password'], getenv('eden_master_hash')))
                ) {
                    $_SESSION['moymoyLogin'] = true;
                    echo true;
                    return;
                } else {
                    unset($_SESSION);
                    error_logger("Bad connexion : " . json_encode($_POST));
                    echo false;
                    return;
                }
            }
        }

        if ($_POST['action'] === 'logged') {
            if (isset($_SESSION['moymoyLogin'])) {
                echo 1;
            } else {
                echo 0;
            }
            return;
        }

        echo "Unknown action: " . $_POST['action'];
    }
} catch (Exception $e) {
    error_logger("Error catched : " . $e->getMessage());
    error_logger("Error operation : " . json_encode($_POST));
    if (isset($_COOKIE[$cookieName])) {
        error_logger("Error cookie content : " . json_encode($_COOKIE[$cookieName]));
    }
    error_logger("Error session : " . json_encode($_SESSION));
}
?>