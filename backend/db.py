# SURAIYA KHOJA

import mysql.connector
from config import test_db_config, main_db_config

class DatabaseConnection:

    def __init__(self, environment):
        self.environment = environment

    def create_connection(self):
        if self.environment == 'testing':
            return mysql.connector.connect(**test_db_config)
        else:
            return mysql.connector.connect(**main_db_config)