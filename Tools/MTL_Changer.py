# Ce programme a pour objectif de changer l'extension des fichiers textures des objets 3D
# Pour cela, le programme va ouvrir les fichiers de liaison .MTL et changer l'extension
# Toutes les lignes contenant "DDS" ou "dds" seront changés en "png"

import glob

EdenRep = 'C:\wamp\www\Site free.fr\Eden\\'
folder3D = 'images/3D/' 
#TempoRep = "C:\\wamp\www\\Site free.fr\\Eden\\3D Eden in web\\NIF tests\\"

# currentFolder = "monsters"
# currentFolder = "char"
# currentFolder = "house"
# currentFolder = "items"
# currentFolder = "ride"
currentFolder = "maps"
# currentFolder = "test"

#for file in glob.glob(EdenRep+"images\\monster\\*.mtl"):
for file in glob.glob(EdenRep+"images\\3D\\"+currentFolder+"\\*.mtl"):
#for file in glob.glob(TempoRep+"*.mtl"):
    f = open(file,'r+')
    # Add functionality to remove empty material
    lines = f.readlines()
    i = -1
    for line in lines:
        i = i+1
        if line.strip() == "map_Kd" or line.strip() == "map_Kd images/3D/"+currentFolder+"/":
            # line = ""
            lines[i] = ""
    f.truncate(0) # On clear le fichier
    f.seek(0) # On remet le curseur au début
    f.writelines(lines)
    f.close()
    # Processing
    f = open(file,'r+')
    content = f.read()
    content = content.replace("DDS", "png") 
    content = content.replace("dds", "png") 

    # Only for "items"
    # content = content.replace("/w","/W")

    # content = content.replace("NIF", "png") 
    # content = content.replace("nif", "png") 
    #content = content.replace("map_Kd http://voldre.free.fr/Eden/3D/","map_Kd http://voldre.free.fr/Eden/images/monster/")
        # 'http://voldre.free.fr/'

    if ('map_Kd '+folder3D) not in content: 
        # Si la redirection de map_Kd ne contient pas le path complet :
        if 'map_Kd images/' in content:
            content = content.replace("images","images/3D") # Gestion du changement de répertoire
        else:
            content = content.replace("map_Kd ","map_Kd "+folder3D+currentFolder+"/")
                            # Ou map_Kd http://voldre.free.fr/Eden/images/3D/ ...
    else:
        print(file.split('\\')[-1]+' : contenu déjà à jour')
    f.truncate(0) # On clear le fichier
    f.seek(0) # On remet le curseur au début
    f.write(content) # Puis on écrit

    f.close()
input("Press Enter to continue...")
