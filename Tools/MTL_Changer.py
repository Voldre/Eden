# Ce programme a pour objectif de changer l'extension des fichiers textures des objets 3D
# Pour cela, le programme va ouvrir les fichiers de liaison .MTL et changer l'extension
# Toutes les lignes contenant "DDS" ou "dds" seront changés en "png"

import glob

EdenRep = 'C:\wamp\www\Site free.fr\Eden\\'
#TempoRep = "C:\\wamp\www\\Site free.fr\\Eden\\3D Eden in web\\NIF tests\\"

#currentFolder = "monster"
#currentFolder = "char"
#currentFolder = "house"
#currentFolder = "items"
# currentFolder = "ride"
currentFolder = "map/toTest"

#for file in glob.glob(EdenRep+"images\\monster\\*.mtl"):
for file in glob.glob(EdenRep+"images\\"+currentFolder+"\\*.mtl"):
#for file in glob.glob(TempoRep+"*.mtl"):
    f = open(file,'r+')
    content = f.read()
    content = content.replace("DDS", "png") 
    content = content.replace("dds", "png") 
    # content = content.replace("NIF", "png") 
    # content = content.replace("nif", "png") 
    #content = content.replace("map_Kd http://voldre.free.fr/Eden/3D/","map_Kd http://voldre.free.fr/Eden/images/monster/")
        # 'http://voldre.free.fr/'
    if 'map_Kd images/' not in content: 
        # Si la redirection de map_Kd ne contient pas le path complet :
        content = content.replace("map_Kd ","map_Kd images/"+currentFolder+"/")
                            # Ou map_Kd http://voldre.free.fr/Eden/images/ ...
    f.truncate(0) # On clear le fichier
    f.seek(0) # On remet le curseur au début
    f.write(content) # Puis on écrit

    f.close()
