import json

def setJSON(json_file,PythonDico):
    # Serializing json 
    json_string = json.dumps(PythonDico)

    with open(json_file, "w") as outfile:
        outfile.write(json_string)

def getJSON(json_file):

    # Opening JSON file
    with open(json_file, 'r') as openfile:
        python_dictionary_from_json = json.load(openfile)
    
    if python_dictionary_from_json == None:
        print("ERREUR : Le contenu du fichier JSON n'a pas pu être récupéré")
    return python_dictionary_from_json


import fandom
fandom.set_wiki("edeneternal")
fandom.page("Maps")
maps = fandom.page("Maps")
"""
print(maps.title)
print(maps.plain_text)
print(maps.content)
print(maps.summary)
print(maps._summary)
print(maps.wiki)
print(maps.pageid)

for x in range(2000,2700,25):
    try:
        myPage = fandom.page(pageid = x)
        print(myPage.title)
    except:
        print("Page n°" + str(x) + " n'existe pas")
"""




print(fandom.search("Angor Quarry", results=10000))

# listPages = fandom.search("Angor Quarry", results=10000)
dungeonPage = fandom.page(title="Angor Quarry")

print(dungeonPage.content['sections'][2]['content'].split('\n'))

listBosses = dungeonPage.content['sections'][2]['content'].split('\n')

listContent = []

for page in listBosses:
    bossPage = fandom.page(title = page)
    print(bossPage.content['sections'][0]['sections'][1]['content'])
    # if(myPage.content.title)
    # print(type(myPage.content['content']))
    # if myPage.content.sections[0].title == "Drops":
        # listContent.append(myPage.content)

# setJSON("test.json",listContent)
input("Press Enter to continue...")