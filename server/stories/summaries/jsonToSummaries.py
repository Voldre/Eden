
import os
from zipfile import ZipFile
import json

with open("server/stories/summaries/discord-messages.json", 'r', encoding='utf-8') as file:
  data = json.load(file)

# Chemin pour sauvegarder l'archive
zip_filename = "html_pages.zip"

with ZipFile(zip_filename, 'w') as zip_file:

  for item in data:

    folder = "G" + str(item["groupe"])
    filename = str(item["seance"]) + ".html"
    content = item["content"]

    # Chemin complet du fichier dans le ZIP
    file_path = os.path.join(folder, filename)

    zip_file.writestr(file_path, content)

print(" ---------------------\n",
      f"Archive générée : {os.path.abspath(zip_filename)}\n",
      "---------------------")
