# SURAIYA KHOJA 

from typing import List, Tuple, Dict, Any 


# Connect to the MySQL database by configuring login credentials and specifying which database to work with.
# For the web application we use main_db_config to store all inventory data. 
# For testing, we use test_db_config, which is a test database used only for testing purposes. 

main_db_config: Dict[str, str] = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Shuijiao2024',
    #'password': 'Ch0colatecake!',
    'database': 'stock3'
}

test_db_config: Dict[str, str] = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Shuijiao2024',
    #'password': 'Ch0colatecake!',
    'database': 'stock3'
}