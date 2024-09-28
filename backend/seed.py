import uuid
import mysql.connector
from mysql.connector import Error
from models import db, Cafe, Employee
from datetime import datetime
from flask import Flask
import os
from dotenv import load_dotenv
import time
import sys

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Use environment variables for database configuration
db_user = os.getenv('DATABASE_USER')
db_password = os.getenv('DATABASE_PASSWORD')
db_host = os.getenv('DATABASE_HOST')
db_port = os.getenv('DATABASE_PORT')
db_name = os.getenv('DATABASE_NAME')

print(f"Database user: {db_user}") 


app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# time is set to ensure that the database is created before the tables are created ***
def drop_and_create_database():
    connection = None
    max_retries = 10
    retry_delay = 5 
    for attempt in range(max_retries):
        try:
            connection = mysql.connector.connect(host=db_host, user=db_user, password=db_password)
            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(f"DROP DATABASE IF EXISTS {db_name}")
                print(f"Dropped database: {db_name}")

                cursor.execute(f"CREATE DATABASE {db_name}")
                print(f"Created database: {db_name}")

                cursor.close()
                break # Exit the loop if the database was created successfully
        except Exception as e:
            print(f"Attempt {attempt + 1} of {max_retries} - Error: {e}")
            time.sleep(retry_delay)
        finally:
            if connection and connection.is_connected():
                connection.close()
                print("MySQL connection is closed")
    else:
        print("Failed to connect to the database after multiple attempts.")
        sys.exit(1)


def seed_data():
    # Create cafes
    cafe1 = Cafe(
        name='Cafe 1',
        description='The best coffee in town',
        logo='cafe1.png',
        location='Main Street'
    )
    cafe2 = Cafe(
        name='Cafe 2',
        description='Where coffee meets creativity',
        logo='cafe2.png',
        location='Market Square'
    )
    cafe3 = Cafe(
        name='Cafe 3',
        description='Hip spot with artisanal coffee',
        logo='cafe3.png',
        location='Downtown'
    )
    cafe4 = Cafe(
        name='Cafe 4',
        description='Quick and quality espresso',
        logo='cafe4.png',
        location='City Center'
    )

    # Add cafes to the session and commit to generate their IDs
    db.session.add(cafe1)
    db.session.add(cafe2)
    db.session.add(cafe3)
    db.session.add(cafe4)
    db.session.commit()

    # Create employees with custom IDs
    employee1 = Employee(
        name='John Doe',
        email_address='john.doe@example.com',
        phone_number='91234567',
        gender='Male',
        start_date=datetime(2022, 1, 1),
        cafe_id=cafe1.id  
    )
    employee2 = Employee(
        name='Jane Smith',
        email_address='jane.smith@example.com',
        phone_number='81234567',
        gender='Female',
        start_date=datetime(2022, 2, 15),
        cafe_id=cafe2.id  
    )
    employee3 = Employee(
        name='Mike Johnson',
        email_address='mike.johnson@example.com',
        phone_number='81234567',
        gender='Male',
        start_date=datetime(2022, 3, 10),
        cafe_id=cafe3.id  
    )
    employee4 = Employee(
        name='Emily Davis',
        email_address='emily.davis@example.com',
        phone_number='91234567',
        gender='Female',
        start_date=datetime(2022, 4, 20),
        cafe_id=cafe4.id  
    )

    # Add employees to the session and commit
    db.session.add(employee1)
    db.session.add(employee2)
    db.session.add(employee3)
    db.session.add(employee4)
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        drop_and_create_database()
        db.create_all()
        seed_data()