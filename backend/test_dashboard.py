# SURAIYA KHOJA 
import pytest
import mysql.connector
from app import app
from typing import List, Tuple, Dict, Any 

# ;/\ANOTHER WORK IN PROGRESS 
# (Dashboard works but testing isn't)
@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_dashboard_route(client):
    response = client.get('/dashboard')

    assert response.status_code == 200

    data = response.json

    assert len(data) > 0
    assert all(key in data[0] for key in ['inventory_id', 'product_name', 'product_description', 'quantity'])




# https://medium.com/@aswens0276/using-pytest-to-setup-dynamic-testing-for-your-flask-apps-postgres-database-locally-and-with-39a14c3dc421
# https://xvrdm.github.io/2017/07/03/testing-flask-sqlalchemy-database-with-pytest/