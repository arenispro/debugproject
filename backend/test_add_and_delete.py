# SURAIYA KHOJA
import pytest
import mysql.connector
from app import app
from typing import List, Tuple, Dict, Any 



# https://testdriven.io/blog/flask-pytest/

# Test client 
@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


#################################### Testing Add Category ####################################
# Required boxes
def  test_required_category_boxes(client):
    # category_name, category_description

    data = {
        'category_name': 'Shoes',
        'category_description': '',
    } 

    
    response = client.post('/addCategory', json=data)
    assert response.status_code == 400
    assert 'message' in response.json
    


# Successful add category 
def  test_successful_add_category(client):
    # category_name, category_description

    data = {
        'category_name': 'Pants',
        'category_description': 'All types of pants',
    }, 
    {
        'category_name': 'Shirts',
        'category_description': 'All types of shirts',
    },
    {
        'category_name': 'Shoes',
        'category_description': 'All types of shoes',
    }
    for d in data: 
        response = client.post('/addCategory', json=d)
        assert response.status_code == 201
        assert 'message' in response.json


# Category exists 
def  test_category_exists(client):
    # category_name, category_description

    data = {
        'category_name': 'Pants',
        'category_description': 'All types of pants',
    }

    response = client.post('/addCategory', json=data)
    assert response.status_code == 400
    assert 'message' in response.json


#################################### Testing Add Variant ####################################
# Required boxes
def test_required_variant_boxes(client):
    # variant_name, variant_value
    data = {
        'variant_name': 'Size',
        'variant_value': ''
    }, 
    {
        'variant_name': '',
        'variant_value': '1'        
    }
    for d in data: 
        response = client.post('/addVariant', json = d)
        assert response.status_code == 400
        assert 'message' in response.json   

# Successful add variant
def test_successful_add_variant(client):
    # variant_name, variant_value
    data = {
        'variant_name': 'Size',
        'variant_value': 'Super big'
    }, 
    {
        'variant_name': 'Size',
        'variant_value': 'Super small'
    }, 
    {
        'variant_name': 'Color',
        'variant_value': 'green'
    },
    {
        'variant_name': 'Color',
        'variant_value': 'Not green'
    }

    for d in data: 
        response = client.post('/addVariant', json = d)
        assert response.status_code == 201
        assert 'message' in response.json


# Variant name and variant value exists
def test_variant_name_and_value_exists(client):
    # variant_name, variant_value
    data = {
        'variant_name': 'Size',
        'variant_value': 'Super big'
    }

    response = client.post('/addVariant', json = data)
    assert response.status_code == 400
    assert 'message' in response.json


#################################### Testing Add Product ####################################
# Required boxes not filled
def test_required_product_boxes(client):
    #barcode, product_name, product_description, product_category, variant_id
 
    data = {
        'barcode': '',
        'product_name': 'Nike Sneakers',
        'product_description': 'sneakers w nike',
        'product_category': '3',
        'variant_id': '3',
    }
    response = client.post('/addProduct', json=data)
    assert response.status_code == 400
    assert 'message' in response.json

# Successful add product
def test_successful_add_product(client):
    #barcode, product_name, product_description, product_category, variant_id
 
    data = {
        'barcode': '1234567890',
        'product_name': 'Nike Sneakers',
        'product_description': 'sneakers w nike',
        'product_category': '3',
        'variant_id': '3',
    }, 
    {
        'barcode': '',
        'product_name': 'Adidas Sneakers',
        'product_description': 'sneakers w adidas',
        'product_category': '3',
        'variant_id': '4',
    },
    {
        'barcode': '123',
        'product_name': 'Puma Sneakers',
        'product_description': 'sneakers w puma',
        'product_category': '3',
        'variant_id': '1',
    }
    for d in data:
        response = client.post('/addProduct', json=d)
        assert response.status_code == 201
        assert 'message' in response.json



# Barcode exists
def test_barcode_exists(client):
    #barcode, product_name, product_description, product_category, variant_id
 
    data = {
        'barcode': '1234567890',
        'product_name': 'Mittens',
        'product_description': 'Matching mittens with panda bear print;)',
        'product_category': '1',
        'variant_id': '1',
    }
    response = client.post('/addProduct', json=data)
    assert response.status_code == 400
    assert 'message' in response.json

# Product exists
def test_product_exists(client):
    #barcode, product_name, product_description, product_category, variant_id
 
    data = {
        'barcode': 'H4PPY',
        'product_name': 'Puma Sneakers',
        'product_description': 'sneakers w puma',
        'product_category': '1',
        'variant_id': '1',
    }
    response = client.post('/addProduct', json=data)
    assert response.status_code == 400
    assert 'message' in response.json

#################################### Testing Add Inventory ####################################
# Successful add inventory 
def test_successful_add_inventory(client):
    # quantity, minimum, maximum, product_id
    data = {
        'quantity': 50,
        'minimum': 10,
        'maximum': 100,
        'product_id': 3
    }

    response = client.post('/addInventory', json=data)
    assert response.status_code == 201
    assert 'message' in response.json

# Required boxes
def test_required_inventory_boxes(client):
    # quantity, minimum, maximum, product_id
    data = {
        'quantity': 50,
        'minimum': '',
        'maximum': '',
        'product_id': 3
    }

    response = client.post('/addInventory', json=data)
    assert response.status_code == 400
    assert 'message' in response.json

# Product exists (checked with product_id)
def test_product_exists_for_inventory(client):
    # quantity, minimum, maximum, product_id
    data = {
        'quantity': 50,
        'minimum': 5,
        'maximum': 100,
        'product_id': 3
    }

    response = client.post('/addInventory', json=data)
    assert response.status_code == 400
    assert 'message' in response.json

#################################### Testing Delete Inventory ####################################
# Successful delete inventory 
def  test_successful_delete_inventory(client):
    data = {'inventory_id': '1'}
    response = client.post('/deleteinventory', json=data)
    assert response.status_code == 201

# Empty field
def test_empty_field_delete_inventory(client):
    data = {'category_id': ''}
    response = client.post('/deleteinventory', json=data)
    assert response.status_code == 400

# Invalid inventory_id 

#################################### Testing Delete Product ####################################
# Successful delete product
def test_successful_delete_product(client):
    data = {'product_id':'1'}
    response = client.post('/deleteproduct', json=data)
    assert response.status_code == 201
    assert 'message' in response.json


# Missing product_id
def test_delete_product_missing_id(client):
    data = {'product_id': ''}
    response = client.post('/deleteproduct', json=data)
    assert response.status_code == 400

# Invalid product_id

#################################### Testing Delete Variant ####################################
# Successful delete variant 
def  test_successful_delete_variant(client):
    data = {'variant_id': '1'}
    response = client.post('/deletevariant', json=data)
    assert response.status_code == 201

# Empty field
def test_empty_field_delete_variant(client):
    data = {'variant_id': ''}
    response = client.post('/deletevariant', json=data)
    assert response.status_code == 400

# Invalid variant_id 


#################################### Testing Delete Category ####################################
# Successful delete category 
def  test_successful_delete_category(client):
    data = {'category_id': '1'}
    response = client.post('/deletecategory', json=data)
    assert response.status_code == 201

# Empty field
def test_empty_field_delete_category(client):
    data = {'category_id': ''}
    response = client.post('/deletecategory', json=data)
    assert response.status_code == 400

# Invalid category_id 