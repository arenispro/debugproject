from flask import Flask, request, jsonify
from flask_cors import CORS # cors helps frontend communicate/make requests to the backend. used with flask 
import mysql.connector
from typing import List, Tuple, Dict, Any 
import bcrypt # hashing
import logging
import requests


logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)
app.testing = True

db_config: Dict[str, str] = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Shuijiao2024',
    'database': 'stock2'
}

logging.info('Flask initialized')

#################################### LOGIN ROUTE ####################################
@app.route('/login', methods=['POST'])
def login() -> Any:
    logging.info('Login request received')

    data: Dict[str, str] = request.json
    username: str = data.get('username', '')
    password: str = data.get('password', '')


    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM user WHERE username = %s", (username,))
        user = cursor.fetchone()

        cursor.close()
        connection.close()

        if user:
            hashed_pw = user.get('password')
            if hashed_pw:
                logging.debug(f'Hashed Password from Database: {hashed_pw}')
                logging.debug(f'Hashed Password Entered: {hash_password(password)}')
                if bcrypt.checkpw(password.encode('utf-8'), hashed_pw.encode('utf-8')): 
                    logging.info('successful!')
                    return jsonify({'message': 'Login successful'}), 200
                else:
                    logging.info('Invalid password')
                    return jsonify({'message': 'Invalid password'}), 401
        else:
            logging.info('User not found')
            return jsonify({'message': 'User not found.'}), 404
    except mysql.connector.Error as error:
        logging.info('Database error')
        return jsonify({'message': 'Database error occured: {}'.format(error)}), 500
    

#################################### REGISTRATION ROUTE ####################################

# Password requirements
# https://www.geeksforgeeks.org/password-validation-in-python/
# https://stackoverflow.com/questions/98768/should-i-impose-a-maximum-length-on-passwords
def password_check(pw):
    special_symbols = ['~','!', '@', '#', '$', '%', '^', '&', '*', '(', ')']
    
    if len(pw) < 12 or len(pw) > 128 or \
        (not any(char.isdigit() for char in pw)) or \
            (not any(char.isupper() for char in pw)) or \
                (not any(char.isupper() for char in pw)) or \
                    (not any(char.islower() for char in pw)) or \
                        (not any(char in special_symbols for char in pw)):

        requirements = """This password does not meet the requirements.\n
        Please make sure your password contains the following:\n
            at least 12 characters,\n
            at least one number,\n
            at least one uppercase letter,\n
            at least one lowercase letter,\n
            and at least one special character.""" 
        return requirements
  

    #if len(pw) > 128:
    #    errors.append('Length should not be greater than 128 characters.')

    #if not any(char.isdigit() for char in pw):
    #    errors.append('Password should have at least one number.')

    #if not any(char.isupper() for char in pw):
    #    errors.append('Password should have at least one uppercase letter.')

    #if not any(char.islower() for char in pw):
    #    errors.append('Password should have at least one lowercase letter.')

    #if not any(char in special_symbols for char in pw):
    #    errors.append('Password should have at least one symbol.')

# Hash password for database
def hash_password(password:str) -> str:
    #hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    #max_length = 45
    #hashed_password = hashed_password[:max_length]
    #return hashed_password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    return hashed_password


@app.route('/register', methods=['POST'])
def register() -> Any:
    logging.info('Registration request received')
    data: Dict[str,str]  = request.json
    first_name: str = data.get('firstName', '')
    last_name: str = data.get('lastName', '')
    email: str = data.get('email', '')
    username: str = data.get('username', '')
    password: str = data.get('password', '')
    confirm_password: str = data.get('confirmPassword', '')
    address: str = data.get('address', '')
    role: str = data.get('role', '')                    
    
    if first_name == '' or last_name == '' or email == '' or username == '' or password == '' or confirm_password == '' or address == '' or role == '':
        return jsonify({'message': "Required boxes not filled."}), 400



    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Check if email is in database
        # https://www.tutorialspoint.com/best-way-to-test-if-a-row-exists-in-a-mysql-table#:~:text=To%20test%20whether%20a%20row,table%2C%20otherwise%20false%20is%20returned.
        # cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
        cursor.execute("SELECT EXISTS(SELECT * from user WHERE email = %s)", (email,))
        email_exists = cursor.fetchone()[0]

        # Check if username is in database
        # cursor.execute("SELECT * FROM user WHERE username = %s", (username,))
        cursor.execute("SELECT EXISTS(SELECT * from user WHERE username = %s)", (username,))
        username_exists = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        if email_exists:
            return jsonify({'message': 'Email already exists. Please use a different email.'}), 400

        if username_exists:
            return jsonify({'message': 'Username already exists. Please choose a different username.'}), 400
        

        password_requirements = password_check(password)
        if password_requirements: 
            return jsonify({'message': password_requirements}), 400
        
        if password != confirm_password:
            return jsonify({'message': "Passwords do not match."}), 400
            
        hashed_password: str = hash_password(password)
      

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("INSERT INTO user (first_name, last_name, email, username, password, address, role) VALUES (%s, %s, %s, %s, %s, %s, %s)", (first_name, last_name, email, username, hashed_password, address, role))
        conn.commit()

        cursor.close()
        conn.close()
        logging.info('User registered successfully')

        return jsonify({'message': 'User registered successfully;)'}), 201
    except mysql.connector.Error as error:
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
 
#################################### EMAIL VALIDATION ROUTE ####################################
@app.route('/email_validation', methods=['POST'])
def email_validation():
    try:
        data = request.get_json()
        email = data.get('email')
        
        url = "https://emailvalidation.abstractapi.com/v1"

        api_key = "675fcddde3194e629aea69c821b98465"

        querystring = {"api_key": "675fcddde3194e629aea69c821b98465", "email": email, "auto-correct": "true" }

        #print (response.text)
        response = requests.request("GET", url, params=querystring)
        result = response.json()
        #return result
        print (response.text)

        if response.ok:
            return jsonify({'message': 'Email validated.', 'result': result}), 200
        else:
            return jsonify({'message': 'Email not validated.'}), 500

    except Exception as e:
        return jsonify({'error': str(e.response.data)}), 500   



############################ Delete Product Function #####################################
@app.route('/deleteproduct', methods=['POST'])
def delete_product() -> Any:
    
    logging.info('Product request received')
    data: Dict[str,str]  = request.json
    product_id: str = data.get('product_id', '')

    ##Required boxes not filled.
    if product_id =='':
        return jsonify({'message': "Required boxes not filled."}), 400
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        #query =("DELETE FROM product WHERE `product_id` =" + str(product_id))
        cursor.execute("DELETE FROM product WHERE `product_id` = " product_id)
        conn.commit()

        cursor.close()
        conn.close()
        logging.info('Product deleted successfully')

        return jsonify({'message': 'Product deleted successfully;)'}), 201
    except mysql.connector.Error as error:
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500


#################################### Add Product ROUTE ####################################

@app.route('/product', methods=['POST'])
def add_product() -> Any:
    logging.info('Product request received')
    data: Dict[str,str]  = request.json
    barcode: str = data.get('barcode', '')
    product_name: str = data.get('product_name', '')
    product_description: str = data.get('product_description', '')
    product_category: str = data.get('product_category', '')
    variant_id: str = data.get('variant_id', '')

    if barcode == '' or product_name == '' or product_description == '' or product_category == '' or variant_id == '':
        return jsonify({'message': "Required boxes not filled."}), 400
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        # Check if product is in database

        cursor.execute("SELECT EXISTS(SELECT * from product WHERE barcode = %s)", (barcode,))
        barcode_exists = cursor.fetchone()[0]

        cursor.execute("SELECT EXISTS(SELECT * from product WHERE product_name = %s)", (product_name,))
        product_exists = cursor.fetchone()[0]

        # Check if product_description is in database
        # cursor.execute("SELECT * FROM product WHERE product_description = %s", (product_description,))
        cursor.execute("SELECT EXISTS(SELECT * from product WHERE product_description = %s)", (product_description,))
        product_description_exists = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        if barcode_exists:
            return jsonify({'message': 'Barcode already exists. Please use a different barcode.'}), 400
        
        if product_exists:
            if product_description_exists:
                return jsonify({'message': 'Product with the same description already exists. Please choose a different product description.'}), 400
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("INSERT INTO product (barcode, product_name, product_description, product_category, variant_id) VALUES (%s, %s, %s, %s, %s)", (barcode, product_name, product_description, product_category, variant_id))
        conn.commit()

        cursor.close()
        conn.close()
        logging.info('Product added successfully')

        return jsonify({'message': 'Product added successfully;)'}), 201
    except mysql.connector.Error as error:
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
    
#################################### Add Inventory ROUTE ####################################

#suggestion for change is in the inventory table it is 
#from current inventory_id, quantity, minimum, maximum, product_id 
    #to  inventory_id, product_id, quantity, minimum, maximum
#this is because no need to input inventory_id if provided product_id on input and itll auto add +1 to the previous inventory_id number

@app.route('/inventory', methods=['POST'])
def add_inventory() -> Any:
    logging.info('Inventory request received')
    data: Dict[str,str]  = request.json
    quantity: str = data.get('quantity', '')
    minimum: str = data.get('minimum', '')
    maximum: str = data.get('maximum', '')
    product_id: str = data.get('product_id', '')

    if quantity == '' or minimum == '' or maximum == '' or product_id == '':
        return jsonify({'message': "Required boxes not filled."}), 400
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        #check if inventory is in database

        cursor.execute("SELECT EXISTS(SELECT * from inventory WHERE product_id = %s)", (product_id,))
        product_exists = cursor.fetchone()[0]
        
        cursor.close()
        conn.close()
        
        if product_exists:
            return jsonify({'message': 'Product already exists. Please use a different product id.'}), 400
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        cursor.execute("INSERT INTO inventory (quantity, minimum, maximum, product_id) VALUES (%s, %s, %s, %s)", (quantity, minimum, maximum, product_id))
        conn.commit()
        
        cursor.close()
        conn.close()
        logging.info('Inventory added successfully')
        
        return jsonify({'message': 'Inventory added successfully;)'}), 201
    except mysql.connector.Error as error:
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
    

#################################### Add Category ROUTE ####################################

@app.route('/category', methods=['POST'])
def add_category() -> Any:
    logging.info('Category request received')
    data: Dict[str,str]  = request.json
    category_name: str = data.get('category_name', '')
    category_description: str = data.get('category_description', '')
    
    if category_name == '' or category_description == '':
        return jsonify({'message': "Required boxes not filled."}), 400
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        #check if category is in database

        cursor.execute("SELECT EXISTS(SELECT * from category WHERE category_name = %s)", (category_name,))
        category_exists = cursor.fetchone()[0]
        
        if category_exists:
            return jsonify({'message': 'Category already exists. Please use a different category name.'}), 400
        
        cursor.execute("INSERT INTO category (category_name, category_description) VALUES (%s, %s)", (category_name, category_description))
        conn.commit()
        
        cursor.close()
        conn.close()
        logging.info('Category added successfully')
        
        return jsonify({'message': 'Category added successfully;)'}), 201
    except mysql.connector.Error as error:
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500

#################################### Add Variant ROUTE ####################################

@app.route('/variant', methods=['POST'])
def add_variant() -> Any:
    logging.info('Variant request received')
    data: Dict[str,str]  = request.json
    variant_name: str = data.get('variant_name', '')
    variant_value: str = data.get('variant_value', '')
    
    if variant_name == '' or variant_value == '':
        return jsonify({'message': "Required boxes not filled."}), 400
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Function to check if variant exists in the database
        def variant_exists(column, value):
            cursor.execute(f"SELECT EXISTS(SELECT * from variant WHERE {column} = %s)", (value,))
            return cursor.fetchone()[0]
        
        # Check if variant_name and variant_value exist
        variant_name_exists = variant_exists("variant_name", variant_name)
        variant_value_exists = variant_exists("variant_value", variant_value)
        
        if variant_name_exists and variant_value_exists:
            # Both variant name and value exist
            return jsonify({'message': 'Variant value already exists. Please use a different variant.'}), 400
        
        else: # Add the variant if either the name or value doesn't exist
            cursor.execute("INSERT INTO variant (variant_name, variant_value) VALUES (%s, %s)", (variant_name, variant_value))
            
            conn.commit()
        
        cursor.close()
        conn.close()
        logging.info('Variant added successfully')
        
        return jsonify({'message': 'Variant added successfully'}), 201
    except mysql.connector.Error as error:
        logging.error('Database error occurred: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500


@app.route("/")
def home() -> str:
    return "Hello Flask!"




if __name__ == '__main__':
    app.run(debug=True)