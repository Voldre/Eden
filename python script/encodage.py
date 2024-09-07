import os
import chardet
import fnmatch
import unicodedata

# Ce script permet d'encoder correctement les fichiers T_.ini qui contiennent
# les traductions FR (ou US) du jeu.
# A noter : l'encodage attendu est ANSI, car le jeu ne supporte pas l'UTF8
# La solution actuelle garde les accents, supprime les "caractères spéciaux"
# et pour que le texte soit bien interprété, les accents sont suivi d'un espace

def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return ''.join([c for c in nfkd_form if not unicodedata.combining(c)])


def add_space_after_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    
    # Construire une nouvelle chaîne en ajoutant un espace après chaque caractère accentué
    output_str = ''
    for c in nfkd_form:
        if unicodedata.combining(c):  # Si c'est un accent
            output_str += c + '_'  # Ajouter l'accent et un _
        else:
            output_str += c  # Ajouter le caractère sans modification
    
    # Normaliser la chaîne pour recombiner les accents avec leurs caractères de base
    return unicodedata.normalize('NFC', output_str)

def replace_special_characters(input_str):
    replacements = {
        '«': '"',
        '»': '"',
        '…': '...',
        '‘': ''',
        '’': ''',
        '“': '"',
        '”': '"',
        '–': '-',
        '—': '--'
    }
    for char, replacement in replacements.items():
        input_str = input_str.replace(char, replacement)

    return input_str


def convertfile_encoding(filename, file_path, output_path, from_encoding='Windows-12', to_encoding='ANSI'):# to_encoding='utf-8'):
    # Lire le contenu du fichier d'entrée

    if False :

        with open(file_path, 'rb') as file:
            raw_data = file.read()

        # Détecter l'encodage
        result = chardet.detect(raw_data)
        encoding = result['encoding']
        confidence = result['confidence']

        print(f"Fichier : {filename} - Encodage : {encoding}, confiance {round(confidence,2)*100}%\n")

        # Si l'encodage détecté match celui attendu, on procède à la conversion
        # if from_encoding in encoding :
            
        # Lire le fichier avec l'encodage d'origine et le convertir en UTF-8
        with open(file_path, 'r', encoding=encoding, errors='ignore') as file:
            content = file.read()

    # Lire le fichier
    with open(file_path, 'r', errors='ignore') as file:
        content = file.read()

    # Remplacer les caractères spécifiques
    content_no_accents = add_space_after_accents(content)  # content # remove_accents(content)
    content_cleaned = replace_special_characters(content_no_accents)

    with open(output_path, 'w',errors='ignore') as file:#, encoding=to_encoding, errors='ignore') as file:
        file.write(content_cleaned)
        # print(f"Fichier converti en UTF-8 et sauvegardé sous {output_path}")
        print(f"Fichier sauvegardé {output_path}")

    # else:
    #     print(f"L'encodage détecté n'est pas {from_encoding}. Aucune conversion effectuée pour {filename}.")


def convert_directory_files(directory, file_pattern='t_*'):         # \db_utf8
    returned_path = r'C:\Users\ec\Downloads\Downloader\Extract2\data\db_ansi\\'
    # Parcourir tous les fichiers dans le répertoire spécifié
    for root, _, files in os.walk(directory):
        for filename in fnmatch.filter(files, file_pattern):
            file_path = os.path.join(root, filename)
            output_path = f"{returned_path}{filename}"

            # Convertir l'encodage du fichier
            convertfile_encoding(filename,file_path, output_path)

# Chemin vers le répertoire contenant les fichiers
directory_path = r'C:\Users\ec\Downloads\Downloader\Extract2\data\db'

# Convertir tous les fichiers commençant par "t" dans le répertoire spécifié
convert_directory_files(directory_path)