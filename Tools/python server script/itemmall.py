import psycopg2
from psycopg2 import sql
from tqdm import tqdm

#  python3 '.\python script\itemmall.py'

# Paramètres de connexion à la base de données
conn_params = {
    'dbname': 'fnaccount', # 'fndb1', # or fnaccount
    'user': 'postgres',
    'password': 'eden',
    'host': '192.168.1.33',  # ou l'adresse IP du serveur PostgreSQL
    'port': '5432',  # port par défaut de PostgreSQL
}

try:
    # Connexion à la base de données
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()

    print('connected')
    
    money_ezur_point=3
    group_amelio=5

    cursor.execute('SELECT current_database();')

    print(cursor.fetchall())
    
    # Reset itemmall for this group
    cursor.execute("DELETE FROM itemmall WHERE item_group = %s AND money_unit = %s;",(group_amelio,money_ezur_point,))
    # Exemple d'insertion de données dans une table
    insert_query = """
    INSERT INTO itemmall (item_id,item_group,item_index, item_num,money_unit,sell, point, special_price,item_color,sell_date, not_sell_date,num_limit,recognized_percentage, level_limit)
    VALUES (%s, %s, %s,  %s, %s,%s, 1, 0,0,0, 0,0,0, 0);
    """

    first_id = 36792
    last_id = 36951

    for index,id in tqdm(enumerate(range(first_id,last_id))):
        data = (id,group_amelio,index, 20,money_ezur_point,1)
        cursor.execute(insert_query, data)

    # Validation des modifications
    conn.commit()

    print("Les données ont été insérées avec succès!")

except (Exception, psycopg2.DatabaseError) as error:
    print(f"Erreur lors de l'insertion de données : {error}")
    # En cas d'erreur, annuler les modifications
    conn.rollback()

finally:
    # Fermer la connexion
    if conn:
        cursor.close()
        conn.close()
        print("La connexion à la base de données a été fermée.")