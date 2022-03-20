<HTML>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="http://voldre.free.fr/style.css">
    <link rel="stylesheet" href="http://voldre.free.fr/Eden/eden.css">

    <meta charset="utf-8">
    <title>Demo 05</title>
    <script type="text/javascript" src="three.min.js"></script>
    <script type="text/javascript" src="MTLLoader.js"></script>
    <script type="text/javascript" src="OBJLoader.js"></script>

    <script type="text/javascript" src="demo.js"></script>
</head>

<body style="text-align:center;">
    <a href="../"><button class="root">Retourner sur le site global</button></a>

    <select id="objets">
        <option value="Axe">tesHache</option>
    <?php
        $monsterRepository = 'http://voldre.free.fr/Eden/images/monster/';
        $files = scandir($monsterRepository);
        foreach($files as $file){
            if(str_contains($file,".obj")){
                // On garde tout sauf l'extension
                $file = strtok($file,  '.');
                echo "<option value=$file>$file</option>";
            }
        }
    ?>
        <option value="bird">testOiseau</option>
    </select>
    <button onclick="update()">Afficher</button>
    <br/>
    <span style="position:absolute;top:0px;left:0px;"><input type="button" value="Toggle Wireframe" onclick="mesh.material.wireframe=!mesh.material.wireframe;meshFloor.material.wireframe=!meshFloor.material.wireframe;"/>
        <br/>ZQSD<br/>pour bouger<br/><br/>Les flèches<br/>pour tourner</span>

</body>

</html>