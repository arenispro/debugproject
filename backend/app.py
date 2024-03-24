from flask import Flask, request, jsonify, redirect, url_for, session
from flask_cors import CORS # cors helps frontend communicate/make requests to the backend. used with flask
import mysql.connector
from typing import List, Tuple, Dict, Any 
import bcrypt # hashing
import logging
import requests
from db import DatabaseConnection
import json
from config import test_db_config, main_db_config
from flask_session import Session
from datetime import timedelta
from flask_login import LoginManager
from flask import session
import re


# SURAIYA 
logging.basicConfig(level=logging.DEBUG)



USE_TEST_DB = False # Change to True when testing 

app = Flask(__name__)
# Below two are for sessions, not working very well
app.config['SESSION_TYPE'] = 'filesystem'
#app.session_interface = FilesystemSessionInterface()
app.secret_key = 'greengreengrass'
Session(app)

CORS(app)

# Configs for session
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
app.config['SESSION_COOKIE_SECURE'] = True  # Ensure cookie is only sent over HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
#CORS(app, supports_credentials=True)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)


app.testing = USE_TEST_DB


# If USE_TEST_DB variable is set to True, testing is being done and the test database should be used. 
# If USE_TEST_DB variable is set to False, the product database is in use. 
if USE_TEST_DB:
    db_config = test_db_config
else: 
    db_config = main_db_config


#db_connection = DatabaseConnection(environment = 'production')
#db_connection = db_connection.create_connection()



# Database login
#go to config.py and change the password and database to match yours
#db_config: Dict[str, str] = {
#   'host': 'localhost',
#    'user': 'root',
#    'password': 'Ch0colatecake!',
#    'database': 'my_inventory'
#}


global roles
roles ='Amin';#added to implement roles

logging.info('Flask initialized')




#################################### LOGIN ROUTE - SURAIYA ####################################
'''
    Connecting to the database using a connector: https://dev.mysql.com/doc/connector-python/en/connector-python-example-connecting.html 
    This route is called when the user is on the login page. The backend receives the username and password entered by the user before 
    verifying that the user exists in the database and that the password matches the one stored for that username. 
'''
@app.route('/login', methods = ['POST'])
def login() -> Any:
    print("ACCESSED LOGIN")
    logging.info('Login request received')
    # Store data received by frontend in variables 
    data: Dict[str, str] = request.json
    username: str = data.get('username', '')
    password: str = data.get('password', '')

    if (username == '' or password == ''):
        return jsonify({'message': "Required boxes not filled."}), 400


    try:
        # Connect to the database 
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Find and retrieve the username received by frontend in the database (user table)
        cursor.execute("SELECT * FROM user WHERE username = %s", (username,))
        user = cursor.fetchone()


        global roles
        roles = user.get('role') # ADDED TO IMPLEMENT ROLES

        # Close connection with the database 
        cursor.close()
        connection.close()

        # If the user was found in the database, retrieve the hashed password associated with the given username. Compare user provided
        # password with password in database. Return a message if successful or unsuccessful (with error message).
        if user:
            hashed_pw = user.get('password')
            if hashed_pw:
                #logging.debug(f'Hashed Password from Database: {hashed_pw}')
                #logging.debug(f'Hashed Password Entered: {hash_password(password)}')
                if bcrypt.checkpw(password.encode('utf-8'), hashed_pw.encode('utf-8')): 
                    session['username'] = username
                    session_data = session.get('username')
                    session.modified = True
                    print("Session Data:", session_data)

                    logging.info('successful!')
                    return jsonify({'message': 'Login successful'},{'roles':roles}), 200 #added the second bracket for roles implementation JUSTIN
                else:
                    logging.info('Invalid password')
                    return jsonify({'message': 'Invalid password'}), 401
        else:
            logging.info('User not found')
            return jsonify({'message': 'User not found.'}), 404
    except mysql.connector.Error as error:
        logging.info('Database error')
        return jsonify({'message': 'Database error occured: {}'.format(error)}), 500
    

#################################### REGISTRATION ROUTE - SURAIYA ####################################
'''
    Password requirements: https://www.geeksforgeeks.org/password-validation-in-python/
                           https://stackoverflow.com/questions/98768/should-i-impose-a-maximum-length-on-passwords
    Given a password, this functions verifies that it fills all the requirements for a secure password. 
    It returns a string of all the requirements to be displayed to the user.
'''
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

# Hash password for database: https://stackoverflow.com/questions/48761260/bcrypt-encoding-error
# After successful registration, this function takes the given password and hashes it. 
# it returns the hashed password to be stored in the database. 
def hash_password(password:str) -> str:
    #hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    #max_length = 45
    #hashed_password = hashed_password[:max_length]
    #return hashed_password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    return hashed_password
'''
    This route is called when the user is on the registration page. After the user enters the required data on the registration page, it
    is sent to the backend, where tests are done to make sure the account can be registered. 
'''
@app.route('/register', methods=['POST'])
def register() -> Any:
    # Store data from frontend in variables.
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
    
    # Verify that all required boxes are filled by returning a message to be displayed if they are not. 
    if first_name == '' or last_name == '' or email == '' or username == '' or password == '' or confirm_password == '' or address == '' or role == '':
        return jsonify({'message': "Required boxes not filled."}), 400



    try:
        # Connect to the database. 
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Check if email is in database: https://www.tutorialspoint.com/best-way-to-test-if-a-row-exists-in-a-mysql-table#:~:text=To%20test%20whether%20a%20row,table%2C%20otherwise%20false%20is%20returned.
        # cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
        cursor.execute("SELECT EXISTS(SELECT * from user WHERE email = %s)", (email,))
        email_exists = cursor.fetchone()[0] 

        # Check if username is in database
        # cursor.execute("SELECT * FROM user WHERE username = %s", (username,))
        cursor.execute("SELECT EXISTS(SELECT * from user WHERE username = %s)", (username,))
        username_exists = cursor.fetchone()[0]

        # Close connection with database. 
        cursor.close()
        conn.close()

        # Handle if email or username exists by returning a message to be displayed. 
        if email_exists:
            return jsonify({'message': 'Email already exists. Please use a different email.'}), 400

        if username_exists:
            return jsonify({'message': 'Username already exists. Please choose a different username.'}), 400
        
        # Call password_check function to verify password fills requirements. 
        password_requirements = password_check(password)

        # Handle if password does not fill requirements by returning a message to be displayed. 
        if password_requirements: 
            return jsonify({'message': password_requirements}), 400
        
        if password != confirm_password:
            return jsonify({'message': "Passwords do not match."}), 400
        
        # Hash password before entering into database for added security. 
        hashed_password: str = hash_password(password)
      
        # Connect to the database. 
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Insert user given data into the database. 
        cursor.execute("INSERT INTO user (first_name, last_name, email, username, password, address, role) VALUES (%s, %s, %s, %s, %s, %s, %s)", (first_name, last_name, email, username, hashed_password, address, role))
        conn.commit()

        # Close connection to database.
        cursor.close()
        conn.close()
        logging.info('User registered successfully')

        return jsonify({'message': 'User registered successfully;)'}), 201
    except mysql.connector.Error as error:
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
 
#################################### EMAIL VALIDATION ROUTE (didn't work yet) - SURAIYA ####################################
# This route is supposed to verify that an email provided by a user exists. It calls an API with the given email and retrieves 
# the json response. If the email was verified, it would return a message to be displayed on the screen. (It would do the same if 
# the email was not verified too.) Wasn't working though, and I was working on a limited number of free API requests. 
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

    # except requests.RequestException as e
    except Exception as e:
        return jsonify({'error': str(e.response.data)}), 500   


#################################### Product ROUTE - BOBBY ####################################
#https://www.tutorialspoint.com/how-can-you-perform-inner-join-on-two-tables-using-mysql-in-python
    #https://www.geeksforgeeks.org/flask-app-routing/
@app.route('/product', methods=['GET'])
def product() -> Any:
    try:
        # function creates an address for the product table from the database. 
        logging.info('Pulling Product request received')
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Retrieve Product data from the database
        #cursor.execute("SELECT * FROM product")
        #product_data = cursor.fetchall()
        #modify the sql query so now in the product page I can see variant and category data.
        cursor.execute("""
            SELECT 
                product.product_id,
                product.barcode,
                product.product_name,
                product.product_description,
                product.product_category,
                category.category_name,
                product.variant_id,
                variant.variant_name,
                variant.variant_value
            FROM 
                product
            JOIN 
                category ON product.product_category = category.category_id
            JOIN
                variant ON product.variant_id = variant.variant_id
        """)
        product_data = cursor.fetchall()

        # Close cursor and connection
        cursor.close()
        conn.close()

        # Convert Product data to JSON format
        product_json = []
        for row in product_data:
            product_json.append({
                'product_id': row[0],
                'barcode': row[1],
                'product_name': row[2],
                'product_description': row[3],
                'product_category': row[4],
                'category_name': row[5],#for category name ie innerwear
                'variant_id': row[6],
                'variant_name': row[7], #variant name shape color 
                'variant_value': row[8] # large green
            })

        return jsonify({'product': product_json}), 200
    except mysql.connector.Error as error:
        # Handle database errors
        logging.error('Database error occurred: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500


#################################### Inventory ROUTE - BOBBY ####################################
    
    #https://www.tutorialspoint.com/how-can-you-perform-inner-join-on-two-tables-using-mysql-in-python
    #https://www.geeksforgeeks.org/flask-app-routing/
@app.route('/inventory', methods=['GET'])
def inventory() -> Any:
    try:
        # function creates an address for the Inventory table from the database. 
        logging.info('Pulling Inventory request received')
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Retrieve inventory data from the database
        #need product table for product name
        cursor.execute("""
            SELECT 
                product.product_id,
                product.product_name,
                inventory.inventory_id,
                inventory.quantity,
                inventory.price,
                inventory.minimum,
                inventory.maximum
            FROM 
                product
            JOIN 
                inventory ON product.product_id = inventory.product_id
        """)
        inventory_data = cursor.fetchall()

        # Close cursor and connection
        cursor.close()
        conn.close()

        # Convert inventory data to JSON format
        inventory_json = []
        for row in inventory_data:
            inventory_json.append({
                'product_id': row[0],
                'product_name': row[1],
                'inventory_id': row[2],
                'quantity': row[3],
                'price': row[4],
                'minimum': row[5],
                'maximum': row[6]
            })

        return jsonify({'inventory': inventory_json}), 200
    except mysql.connector.Error as error:
        # Handle database errors
        logging.error('Database error occurred: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
#################################### Category ROUTE - BOBBY ####################################
@app.route('/category', methods=['GET'])
def category() -> Any:
    try:
        # function creates an address for the Category table from the database. 
        logging.info('Pulling Category request received')
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Retrieve Category data from the database
        cursor.execute("SELECT * FROM category")
        category_data = cursor.fetchall()

        # Close cursor and connection
        cursor.close()
        conn.close()

        # Convert Category data to JSON format
        category_json = []
        for row in category_data:
            category_json.append({
                'category_id': row[0],
                'category_name': row[1],
                'category_description': row[2]
            })

        return jsonify({'category': category_json}), 200
    except mysql.connector.Error as error:
        # Handle database errors
        logging.error('Database error occurred: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
#################################### Variant ROUTE - BOBBY ####################################
@app.route('/variant', methods=['GET'])
def variant() -> Any:
    try:
        # function creates an address for the Variant table from the database. 
        logging.info('Pulling Variant request received')
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Retrieve Variant data from the database
        cursor.execute("SELECT * FROM variant")
        variant_data = cursor.fetchall()

        # Close cursor and connection
        cursor.close()
        conn.close()

        # Convert Variant data to JSON format
        variant_json = []
        for row in variant_data:
            variant_json.append({
                'variant_id': row[0],
                'variant_name': row[1],
                'variant_value': row[2]
            })

        return jsonify({'variant': variant_json}), 200
    except mysql.connector.Error as error:
        # Handle database errors
        logging.error('Database error occurred: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500

#################################### Add Product ROUTE - BOBBY ####################################
    
      #https://www.geeksforgeeks.org/flask-app-routing/

@app.route('/addProduct', methods=['POST'])
def add_product() -> Any:
    '''
    Add a new product to the database.
    reuturns a response with a status code of 201 if the product was added successfully, or 
    returns a response with a status code of 400 if the product was not added successfully.
    raises a response with a status code of 500 if the database connection failed.
    '''
    logging.info('Creating Product request received')
    data: Dict[str,str]  = request.json
    barcode: str = data.get('barcode', '')
    product_name: str = data.get('product_name', '')
    product_description: str = data.get('product_description', '')
    product_category: str = data.get('product_category', '')
    variant_id: str = data.get('variant_id', '')
    '''
    using dictionary allows for access and  handling of JSON data from requests.
    JSON data needs to be parsed and processed before it can be added to the database.
    data: Dict[str, str] = request.json parses the JSON data from the request into a dictionary 
    where the keys are strings and the values are strings. This allows for retrieval of values 
    of different fields such as 'barcode', 'product_name', 'product_description
    using dictionary allows for the code to be structured and access and manipulating data to be easier
    '''

    # Check if all required fields are filled
    if barcode == '' or product_name == '' or product_description == '' or product_category == '' or variant_id == '':
        return jsonify({'message': "Required boxes not filled."}), 400
    
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Check if barcode already exists in the database
        cursor.execute("SELECT EXISTS(SELECT * from product WHERE barcode = %s)", (barcode,))
        barcode_exists = cursor.fetchone()[0]

        # Check if product name already exists in the database
        cursor.execute("SELECT EXISTS(SELECT * from product WHERE product_name = %s)", (product_name,))
        product_exists = cursor.fetchone()[0]

        # Check if product_description is in database
        # cursor.execute("SELECT * FROM product WHERE product_description = %s", (product_description,))
        cursor.execute("SELECT EXISTS(SELECT * from product WHERE product_description = %s)", (product_description,))
        product_description_exists = cursor.fetchone()[0]

        #close connection
        cursor.close()
        conn.close()

        # If barcode already exists, return an error message
        if barcode_exists:
            return jsonify({'message': 'Barcode already exists. Please use a different barcode.'}), 400
        
        # If product name and description combination already exists, return an error message
        if product_exists:
            if product_description_exists:
                return jsonify({'message': 'Product with the same description already exists. Please choose a different product description.'}), 400
        
        # Re-establish database connection to insert the new product
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        #create new row in database and insert new product
        cursor.execute("INSERT INTO product (barcode, product_name, product_description, product_category, variant_id) VALUES (%s, %s, %s, %s, %s)", (barcode, product_name, product_description, product_category, variant_id))
        conn.commit()

        cursor.close()
        conn.close()
        logging.info('Product added successfully')

        return jsonify({'message': 'Product added successfully;)'}), 201
    except mysql.connector.Error as error:
        #There is a problem with the database connection with MySQL
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
    
########3boobby creating a regex check for price######
    
#https://www.geeksforgeeks.org/us-currency-validation-using-regular-expressions/  
   # https://regex101.com/r/FPl92N/1
def is_valid_price(str):
    # Define the pattern to match "$X.XX" format
    regex = "^\\d+\\.\\d{2}$"
    # Compile the ReGex
    p = re.compile(regex)
 
    # If the string is empty
    # return false
    if (str == None):
        return False
 
    # Return if the string
    # matched the ReGex
    if(re.search(p, str)):
        return True
    else:
        return False
    #################################### Add Inventory ROUTE - BOBBY ####################################

#suggestion for change is in the inventory table it is 
#from current inventory_id, quantity, minimum, maximum, product_id 
    #to  inventory_id, product_id, quantity, minimum, maximum
#this is because no need to input inventory_id if provided product_id on input and itll auto add +1 to the previous inventory_id number

@app.route('/addInventory', methods=['POST'])
def add_inventory() -> Any:
    '''
    Add a new inventory to the database.
    reuturns a response with a status code of 201 if the inventory was added successfully, or 
    returns a response with a status code of 400 if the inventory was not added successfully.
    raises a response with a status code of 500 if the database connection failed.
    '''
    logging.info(' Creating Inventory request received')
    data: Dict[str,str]  = request.json
    quantity: str = data.get('quantity', '')
    price: str = data.get('price', '')
    minimum: str = data.get('minimum', '')
    maximum: str = data.get('maximum', '')
    product_id: str = data.get('product_id', '')
    '''
    Allows for retrieval of values of fields such as 'quantity', 'price' , 'minimum', 'maximum', 'product_id'
    '''
    # Check if all required fields are filled
    if quantity == '' or price == '' or minimum == '' or maximum == '' or product_id == '':
        return jsonify({'message': "Required boxes not filled."}), 400
    #check if price is a valid number
    
    if is_valid_price(price) == False  or float(price) <= 0:
        # Price is a valid double number and it's non-negative
        return jsonify({'message': "Price must be a more than $0 and decimals in 2 places"}), 400
    # Check if minimum is a non-negative integer
    if not (minimum.isdigit() and int(minimum) >= 0):
        return jsonify({'message': "Minimum value must be a non-negative integer."}), 400
    # Check if minimum is less than maximum
    if not (minimum.isdigit() and maximum.isdigit() and int(minimum) < int(maximum)):
        return jsonify({'message': "Maximum value must be more than minimum value."}), 400
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        #check if product_id is in database 
        cursor.execute("SELECT EXISTS(SELECT * from inventory WHERE product_id = %s)", (product_id,))
        product_exists = cursor.fetchone()[0]
        
        #close connection
        cursor.close()
        conn.close()
        
        # If product_id exist that mean you cant add the same inventory for that product
        if product_exists:
            return jsonify({'message': 'Product already exists. Please use a different product id.'}), 400
        # Re-establish database connection to insert the new product
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        #create new row in database and insert new inventory
        cursor.execute("INSERT INTO inventory (quantity, price, minimum, maximum, product_id) VALUES (%s, %s, %s, %s, %s)", (quantity, price, minimum, maximum, product_id))
        conn.commit()
        
        cursor.close()
        conn.close()
        logging.info('Inventory added successfully')
        
        return jsonify({'message': 'Inventory added successfully;)'}), 201
    except mysql.connector.Error as error:
        #There is a problem with the database connection with MySQL
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
    #################################### Add Category ROUTE - BOBBY ####################################

@app.route('/addCategory', methods=['POST'])
def add_category() -> Any:
    #Add a new category
    logging.info('Creating Category request received')
    data: Dict[str,str]  = request.json
    category_name: str = data.get('category_name', '')
    category_description: str = data.get('category_description', '')
    #allows for retrieval of values of fields such as 'category_name', 'category_description'
    
    # Check if all required fields are filled
    if category_name == '' or category_description == '':
        return jsonify({'message': "Required boxes not filled."}), 400
    
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        #check if category is in database
        cursor.execute("SELECT EXISTS(SELECT * from category WHERE category_name = %s)", (category_name,))
        category_exists = cursor.fetchone()[0]
        #cant create new category if it is already in database
        if category_exists:
            return jsonify({'message': 'Category already exists. Please use a different category name.'}), 400
        
        #create new row in database and insert new category
        cursor.execute("INSERT INTO category (category_name, category_description) VALUES (%s, %s)", (category_name, category_description))
        conn.commit()
        
        #close connection
        cursor.close()
        conn.close()
        logging.info('Category added successfully')
        
        return jsonify({'message': 'Category added successfully;)'}), 201
    except mysql.connector.Error as error:
        #There is a problem with the database connection with MySQL
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
    
    #################################### Add Variant ROUTE - BOBBY ####################################
#for repeated code, documentation is in addProduct
@app.route('/addVariant', methods=['POST'])
def add_variant() -> Any:
    logging.info('Creating Variant request received')
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
            #can have shape, circle and cretae shape,square but not shape,circle and create shape,circle
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
    
############################ Update Inventory Bobby #####################################
#changing data in inventory table to new amount/maximum/minimum
@app.route('/updateInventory', methods=['POST'])
def update_inventory() -> Any:
    data: Dict[str,str]  = request.json
    product_id = data.get('product_id', '')
    quantity = data.get('quantity')
    price = data.get('price')
    minimum = data.get('minimum')
    maximum = data.get('maximum')
     #Need to know which product inventory to update
    if product_id == '':
        return jsonify({'message': "Required Product Id."}), 400
    if quantity == '' and price == '' and minimum == '' and maximum == '':
        return jsonify({'message': "Need to fill what needs to be changed"}), 400
    
    try:
         # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        #sql command for slecting the product id from the database
        cursor.execute("SELECT * from inventory WHERE product_id = %s", (product_id,))
        product_id_exists = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        if not product_id_exists:
            return jsonify({'message': 'Product not found.'}), 404
        # Re-establish database connection update inventory
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Update the inventory based on the provided data
        if quantity:
            #updating quantity it must be 0 or more and a number should not be hard limited
            if quantity.isdigit() and int(quantity) >= 0:
                cursor.execute("UPDATE inventory SET quantity = %s WHERE product_id = %s", (quantity, product_id))
            else:
                return jsonify({'message': "Quantity needs to be 0 or greater"}), 400
 
        if price:
            if is_valid_price(price) == False  or float(price) <= 0:
                # Price is a valid double number and it's non-negative
                return jsonify({'message': "Price must be a more than $0 and decimals in 2 places"}), 400
            # Price is a valid double number and it's non-negative
            else:
                cursor.execute("UPDATE inventory SET price = %s WHERE product_id = %s", (price, product_id))

        if minimum:
        # Fetch the maximum value from the inventory table
            cursor.execute("SELECT maximum FROM inventory WHERE product_id = %s", (product_id,))
            maximum_ = cursor.fetchone()
            #logic for minimum vs maximum minimum must be more than 0 
            if int(minimum) < 0:
                return jsonify({'message': 'Provided minimum value must be 0 or more.'}), 400
            elif int(maximum_[0]) < int(minimum):
                #inputted minimum must be less than current maximum
                return jsonify({'message': 'Provided minimum value must be less than the existing maximum value.'}), 400
            else:
                cursor.execute("UPDATE inventory SET minimum = %s WHERE product_id = %s", (minimum, product_id))
        if maximum:
        # Fetch the maximum value from the inventory table
            cursor.execute("SELECT minimum FROM inventory WHERE product_id = %s", (product_id,))
            minimum_ = cursor.fetchone()
            #making sure inputted maximum is more than the existing minimum
            if int(maximum) > int(minimum_[0]) :
                cursor.execute("UPDATE inventory SET maximum = %s WHERE product_id = %s", (maximum, product_id))
            else:
                return jsonify({'message': 'Provided maximum value must be more than the existing minimum value.'}), 400
            


        conn.commit()
        cursor.close()
        conn.close()
        logging.info('Inventory added successfully')
        
        return jsonify({'message': 'Inventory added successfully;)'}), 201
    except mysql.connector.Error as error:
        #There is a problem with the database connection with MySQL
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500




    
############################ Delete Product Route nick #####################################
# DeleteProduct API for delete function.
# A non-empty product ID is required.
# Then a SQL query will be executed to remove the product in the database.

@app.route('/deleteProduct', methods=['DELETE'])
def delete_product() -> Any:
    
    logging.info('Delete Product request received')
    data: Dict[str,str]  = request.json
    product_id: str =data.get('product_id', '')

    if product_id == '':
        return jsonify({'message': "Required boxes not filled."}), 400
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT EXISTS(SELECT * from product WHERE product_id = %s)", (product_id,))
        product_id_exists = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        if not product_id_exists:
            return jsonify({'message': 'Product not found.'}), 404
        # Re-establish database connection to delete the product
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
    
        cursor.execute("DELETE FROM product WHERE product_id = %s", (product_id,))
        conn.commit()
        cursor.close()
        conn.close()
        logging.info('Product deleted successfully')
        return jsonify({'message': "Product deleted successfully"}), 201
    except mysql.connector.Error as error:
        logging.error('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500


#############################Delete Variant Route Nick############################
# DeleteVariant API for delete function.
# A non-empty variant ID is required.
# Then a SQL query will be executed to remove the variant in the database.

@app.route('/deleteVariant', methods=['DELETE'])
def delete_variant() -> Any:
    
    logging.info('Delete variant request received')
    data: Dict[str,str]  = request.json
    variant_id: str =data.get('variant_id','')

    if variant_id =='':
        return jsonify({'message': "Required boxes not filled."}), 400
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
    
    
        cursor.execute("SELECT EXISTS(SELECT * from variant WHERE variant_id = %s)", (variant_id,))
        variant_id_exists = cursor.fetchone()[0]
        
        cursor.close()
        conn.close()
        
        if not variant_id_exists:
            return jsonify({'message': 'Variant not found.'}), 404
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM variant WHERE variant_id = %s", (variant_id,))
        conn.commit()
        cursor.close()
        conn.close()
        logging.info('variant deleted successfully')
        
        return jsonify({'message': "variant deleted successfully"}), 201
    except mysql.connector.Error as error:
        logging.error('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500




###################################Delete Inventory Route Nick ########################################
# DeleteInventory API for delete function.
# A non-empty inventory ID is required.
# Then a SQL query will be executed to remove the inventory in the database.

@app.route('/deleteInventory', methods=['DELETE'])
def delete_inventory() -> Any:
    logging.info('Delete inventory request received')
    data: Dict[str,str]  = request.json
    inventory_id: str =data.get('inventory_id','')

    if inventory_id =='':
        return jsonify({'message': "Required boxes not filled."}), 400
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT EXISTS(SELECT * from inventory WHERE inventory_id = %s)", (inventory_id,))
        inventory_id_exists = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        if not inventory_id_exists:
            return jsonify({'message': 'Inventory not found.'}), 404
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM inventory WHERE inventory_id = %s", (inventory_id,))
        conn.commit()
        cursor.close()
        conn.close()
        logging.info('inventory deleted successfully')
        return jsonify({'message': "inventory deleted successfully"}), 201
    except mysql.connector.Error as error:
        logging.error('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500



############################ Delete Category Route Nick #####################################
# DeleteCategory API for delete function.
# A non-empty category ID is required.
# Then a SQL query will be executed to remove the category in the database.

@app.route('/deleteCategory', methods=['DELETE'])
def delete_category() -> Any:
    
    logging.info('Delete category request received')
    data: Dict[str,str]  = request.json
    category_id: str =data.get('category_id','')

    if category_id =='':
        return jsonify({'message': "Required boxes not filled."}), 400
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT EXISTS(SELECT * from category WHERE category_id = %s)", (category_id,))
        category_id_exists = cursor.fetchone()[0]
        cursor.close()
        conn.close()

        if not category_id_exists:
            return jsonify({'message': 'Category not found.'}), 404
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM category WHERE category_id = %s", (category_id,))
        conn.commit()
        cursor.close()
        conn.close()
        logging.info('Category deleted successfully')
        return jsonify({'message': "Category deleted successfully"}), 201
    except mysql.connector.Error as error:
        logging.error('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500


'''
    This function is going to be in charge of creating a dictionary from the multiple rows fetched from our database.
    It is only implemented for 4 columns tho. so it needs to be revised to handle multiple column if it is going to be 
    used often in different ways.
    If I decide to rewrite this function it is important to notice that the keys in the dictionary would have to be 
    different and maybe specified ex(id, product_name,etc)
    
'''

#################################### SHOW LOW STOCK-NICK ####################################
#Show low stock products in ascending order from top to bottom
#Table shows product ID, quantity, product name, barcode and category information
@app.route('/showLowStock', methods=['GET'])
def show_low_stock() -> Any:
    try:
        # function creates an address for the Variant table from the database. 
        logging.info('Pulling Low Stock request received')
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        
        #query to get product list sorted based on its inventory quantity
        #if same quantity, the list is sorted based on product barcode 
        query='''
        SELECT product.product_id, quantity, barcode, product_name, category_name, variant_value
        FROM product
        INNER JOIN category
        ON product.product_category=category.category_id
        INNER JOIN variant
        ON product.variant_id = variant.variant_id
        LEFT JOIN inventory
        ON inventory.product_id=product.product_id
        ORDER BY quantity, barcode
        LIMIT 20;
        '''
        
        cursor.execute(query)
        low_stock_data = cursor.fetchall()
        #fetch all data from table

        # Close cursor and connection
        cursor.close()
        conn.close()

        # Convert Low Stock data to JSON format
        lowstock = []
        for row in low_stock_data:
            lowstock.append({
                'product_id': row[0],
                'inventory_quantity': row[1],
                'product_barcode': row[2],
                'product_name': row[3],
                'category_name': row[4],
                'variant_value': row[5]
            })

        return jsonify({'lowstock': lowstock}), 200
    except mysql.connector.Error as error:
        # Handle database errors
        logging.error('Database error occurred: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500
    





#################################### DASHBOARD ROUTE - SURAIYA ####################################
'''
    The dashboard is the main page of the product. It displays inventory information and gives users options to interact with the 
    inventory. 
'''
@app.route("/dashboard", methods=['GET'])
#@login_required
def dashboard() -> Any:
    print("IN THE DASH")
    session_data = session.get('username')
    session.modified = True
    print("Session Data:", session_data)
  

#################################### FETCH INVENTORY ROUTE - JUSTIN ####################################
def rows_to_dict(rows):
    json_dict = []
    for row in rows:
        # Convert each row tuple to a dictionary
        row_dict = {
            'inventory_id': row[0],
            'product_name': row[1],
            'product_description': row[2],
            'quantity': row[3],
            'roles':roles,
            #'product_category':row[4]
        }
        json_dict.append(row_dict)
    return json_dict

@app.route("/fetch_inventory", methods=['GET'])
def fetch_inventory() -> Any:
    print("ACCESSED FETCH INV")

    try :
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()



        cursor.execute("SELECT inventory_id, product_name, product_description, quantity FROM inventory JOIN product ON inventory.product_id = product.product_id")
        rows = cursor.fetchall() #This rows variable has all the rows in it, I have to deconstruct each rows
        #Fetchall had to be used because it is the only way to retrieve all the data from the query. https://www.geeksforgeeks.org/querying-data-from-a-database-using-fetchone-and-fetchall/
        #Fetchone only select the first row, so Looping through it is not an option either
        #data =json.load(rows) #This gave me a lot of errors

        json_dict = rows_to_dict(rows) #new dictionary made out of the result of fecthall

        cursor.close()
        return jsonify(json_dict) #jsonify(data)
    except mysql.connector.Error as error:
        logging.info('Database error occured: %s', error)
        return jsonify({'message': 'Database error occurred: {}'.format(error)}), 500




#################################### LOGOUT ROUTE (not working yet)- SURAIYA ####################################
'''
    Logging out route allows users to logout. If the user logs out, they will not be able to access the dashboard until they login. 
    If they try to access the dash, they are redirected to the login page. 
    Maybe uses sessions to do this (?), but mainly local storage. Sessions were being tricky. 
'''
@app.route("/logout", methods=['POST'])
def logout() -> Any:
    print("ACCESSED LOGOUT ROUTE")
    #session.clear()
    try:
        session_data_before = session.get('username')
        print("Session Data Before Logout:", session_data_before)
        session.clear()
        session.modified = True
        session_data_after = session.get('username')
        print("Session Data After Logout:", session_data_after)

        response_data = {'message': 'Logout successful'}
        response = jsonify(response_data)
        response.delete_cookie('session', domain='localhost', secure=True, httponly=True)
        
        return response, 200
    except Exception as e:
        error_message = 'Logout failed: {}'.format(str(e))
        return jsonify({'error': error_message}), 500


#################################### FILTERING ROUTES - Suraiya ####################################
'''
    filter_page is the page the user can go to if they want to find products by filtering them. Users can only filter by 
    category and variant, so this route fetches that information from the database to give options to user. (This basically 
    renders categories and variants, doesn't do any actual filtering!) 
'''
@app.route('/filter_page')
def filter_page():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT category_id, category_name, category_description FROM category")
        categories = cursor.fetchall()

        cursor.execute("SELECT variant_id, variant_name, variant_value FROM variant")
        variants = cursor.fetchall()

        cursor.close()


        return jsonify({
            'categories': categories,
            'variants': variants
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


'''
    filter_products gets called to do the filtering. It takes the category and variant the user chooses as parameters and 
    accesses the database with them. Once it finds products with the specific category and/or variant, it returns them to
    frontend as a json array.
'''
@app.route('/filter_products', methods=['GET'])
def get_products():
    try:
        category_id = request.args.get('category')
        variant_id = request.args.get('variant')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "SELECT product_id, barcode, product_name, product_description, product_category, variant_id FROM product"
        params = []

        if category_id is not None and variant_id is not None:
            query += " WHERE product_category = %s AND variant_id = %s"
            params = [category_id, variant_id]
        elif category_id is not None:
            query += " WHERE product_category = %s"
            params = [category_id]
        elif variant_id is not None:
            query += " WHERE variant_id = %s"
            params = [variant_id]

        cursor.execute(query, params)
        products = cursor.fetchall()
        cursor.close()

        response = jsonify(products)
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route("/")
def home() -> str:
    return "Hello Flask! this means server is up and running\nDatabase: my_inventorry"

# Suraiya 
# Disable caching: https://stackoverflow.com/questions/34066804/disabling-caching-in-flask
# Trying it out for sessions
@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'

    return r

if __name__ == '__main__':
    app.run(debug=True)