<?php
session_start();

// Allow from any origin
// if (isset($_SERVER['HTTP_ORIGIN'])) {
//     // should do a check here to match $_SERVER['HTTP_ORIGIN'] to a
//     // whitelist of safe domains
//     header("Access-Control-Allow-Origin: {*}");
//     header('Access-Control-Allow-Credentials: true');
//     header('Access-Control-Max-Age: 86400');    // cache for 1 day
// }
?>
<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="UTF-8">

    <meta name="description"
        content="Eden Eternal Wiki avec des designs 3D (Monstres, Donjons, Armes, Personnages) ainsi que les musiques et l'univers du jeu.">

    <link rel="stylesheet" href="http://voldre.free.fr/style.css">
    <link rel="stylesheet" href="eden.css">

    <!--<script src="jquery-3.6.0.min.js"></script>-->
    <script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

    <title>Eden Wiki</title>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Never forget the viewport ! -->
    <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86">
</head>

<!-- Google tag (gtag.js) -->
<!-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-FPLLJ4M61Z"></script> 
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-FPLLJ4M61Z');
    </script>
    -->

<div id="google_translate_element" style="float:right;">
</div>

<style>
    .goog-te-banner-frame.skiptranslate {
        display: none !important;
    }

    body {
        top: 0px !important;
    }

    .goog-tooltip {
        display: none !important;
    }

    .goog-tooltip:hover {
        display: none !important;
    }

    .goog-text-highlight {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }

    .goog-logo-link {
        display: none !important;
    }

    .goog-te-gadget {
        font-size: 0;
        user-select: none;
    }

    select {
        border: 0px;
        background-image: -webkit-linear-gradient(top, transparent, rgba(0, 0, 0, 0.4));
        background-image: -moz-linear-gradient(top, transparent, rgba(0, 0, 0, 0.4));
        background-image: -o-linear-gradient(top, transparent, rgba(0, 0, 0, 0.4));
        background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4));
        -webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.1), 0 1px 1px rgba(0, 0, 0, 0.2);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.1), 0 1px 1px rgba(0, 0, 0, 0.2);
    }
</style>

<!-- <script defer type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script> -->