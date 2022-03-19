<HTML>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="http://voldre.free.fr/style.css">
    <link rel="stylesheet" href="eden.css">
  
  <!--
    <script src="http://voldre.free.fr/Eden/p5.min.js"></script>
    <script src="sketch.js"></script>
    -->

    <script src="jquery-3.6.0.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

    <link rel="stylesheet" type="text/css" href="loading-bar.css"/>
<script type="text/javascript" src="loading-bar.js"></script>
</head>

<body onload="load()">
<a href="../"><button class="root">Retourner sur le site global</button></a>

<div class="loading-container">
    <img  id="alpaga" src="images/loadingframe/alpaga1.png">
    <img  id="girl" src="images/loadingframe/alpaga3.png">

    <img class="loadingframe" style="top:5px; z-index:2;" src="images/loadingframe/barloading.png">
    <div id="loading-jauge" class="ldBar" 
    data-type="fill" 
    data-fill-dir="ltr"  
    data-img="images/loadingframe/bar.png"
    data-value=0 
    data-duration=6
    data-fill-background="rgba(70,70,70,0.1)">
    </div>
</div>
<script type="text/javascript">

    function load(){
    var jauge = new ldBar("#loading-jauge");
    jauge.set(100);

    console.log(typeof document.getElementById("#alpaga"))

    repeat();

    console.log(jauge)
    }

    var interval1, interval2;
    var timesRun = 0;
    function repeat() {

        $("#alpaga").fadeIn(900);
        $("#girl").fadeIn();

        interval1 = setInterval(move1, 200);
        interval2 = setInterval(move2, 400);

    }

    function move1() {
        console.log($("#alpaga").css("left"))
        $("#alpaga").attr('src',"images/loadingframe/alpaga1.png"); 
        $("#girl").attr('src',"images/loadingframe/alpaga3.png"); 
        $("#alpaga").css("left", "+=13"); 
    }
    function move2() {
        $("#alpaga").attr('src',"images/loadingframe/alpaga2.png"); 
        $("#girl").attr('src',"images/loadingframe/alpaga4.png"); 
        
        timesRun++;

        // Evolution de la vitesse
        if(timesRun < 5){
            $("#alpaga").css("left", "+=3");
        }
        else if(timesRun < 10){
            $("#alpaga").css("left", "+=21"); 
        }else{ $("#alpaga").css("left", "+=4"); }

        if(timesRun == 13){
            clearInterval(interval2)
            clearInterval(interval1)
            $("#girl").css("display","none"); 
            $("#alpaga").attr('src',"images/loadingframe/alpaga5.png"); 

            $(".loading-container").fadeOut(2000);
            setTimeout(() => {
                document.location = 'database.php';
            }, 1500);
        }
        //document.getElementById("#alpaga").style.src = "images/loadingframe/alpaga2.png";
    }
</script>

</body>

</HTML>