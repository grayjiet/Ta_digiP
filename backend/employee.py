import random
import string
from datetime import datetime, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import Cafe, db, Employee
import os
from dotenv import load_dotenv

# Load the environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Use environment variables for database configuration
db_user = os.getenv('DATABASE_USER')
db_password = os.getenv('DATABASE_PASSWORD')
db_host = os.getenv('DATABASE_HOST')
db_port = os.getenv('DATABASE_PORT')
db_name = os.getenv('DATABASE_NAME')

# Configure the database connection
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def generate_employee_id():
    prefix = 'UI'
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    return prefix + suffix

@app.route('/employees', methods=['GET'])
def get_employees():
    cafe_name = request.args.get('cafe', None)

    if cafe_name:
        # Join Employee and Cafe tables and filter by cafe name for finding employees that work in the specified cafe
        employees = Employee.query.join(Cafe).filter(Cafe.name == cafe_name).all()
    else:
        # Get all employees if no cafe is specified
        employees = Employee.query.all()

    if not employees:
        return jsonify({
            "message": "No employees found"
            }), 404

    now_utc = datetime.now(timezone.utc)

    # Convert employee start date to offset-aware datetime and sort by days worked
    employees_sorted = sorted(
        employees,
        key=lambda employee: (now_utc - employee.start_date.replace(tzinfo=timezone.utc)).days,
        reverse=True
    )

    return jsonify({
        "employees": [
            {
                "id": employee.id,
                "name": employee.name,
                "email_address": employee.email_address,
                "phone_number": employee.phone_number,
                "gender": employee.gender,
                "start_date": employee.start_date.strftime('%Y-%m-%d'),
                "days_worked": (now_utc - employee.start_date.replace(tzinfo=timezone.utc)).days,
                "cafe": employee.cafe.name if employee.cafe else ""
            }
            for employee in employees_sorted
        ]
    }), 200

@app.route('/employee', methods=['POST'])
def create_employee():
    data = request.json

    required_fields = ['name', 'email_address', 'phone_number', 'gender', 'start_date', 'cafe_id']
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Missing required fields"
            }), 400

    cafe = Cafe.query.get(data['cafe_id'])
    if not cafe:
        return jsonify({
            "message": "Cafe not found"
            }), 404

    new_employee = Employee(
        name=data['name'],
        email_address=data['email_address'],
        phone_number=data['phone_number'],
        gender=data['gender'],
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
        cafe_id=data['cafe_id']  
    )

    db.session.add(new_employee)
    db.session.commit()

    return jsonify({
        "message": "Employee created successfully", "employee_id": new_employee.id
        }), 201

@app.route('/employee/<string:id>', methods=['GET'])
def get_employee(id):
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({
            "message": "Employee not found"
            }), 404

    now_utc = datetime.now(timezone.utc)

    return jsonify({
        "id": employee.id,
        "name": employee.name,
        "email_address": employee.email_address,
        "phone_number": employee.phone_number,
        "gender": employee.gender,
        "start_date": employee.start_date.strftime('%Y-%m-%d'),
        "cafe_id": employee.cafe_id,
        "days_worked": (now_utc - datetime.combine(employee.start_date, datetime.min.time(), timezone.utc)).days
    }), 200

@app.route('/employee/<string:id>', methods=['PUT'])
def update_employee(id):
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({
            "message": "Employee not found"
            }), 404

    data = request.json

    employee.name = data.get('name', employee.name)
    employee.email_address = data.get('email_address', employee.email_address)
    employee.phone_number = data.get('phone_number', employee.phone_number)
    employee.gender = data.get('gender', employee.gender)
    employee.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date() if 'start_date' in data else employee.start_date

    if 'cafe_id' in data:
        cafe = Cafe.query.get(data['cafe_id'])
        if not cafe:
            return jsonify({
                "message": "Cafe not found"
                }), 404
        employee.cafe_id = data['cafe_id']

    db.session.commit()
    return jsonify({
        "message": "Employee updated successfully"
        }), 200


@app.route('/employee/<string:id>', methods=['DELETE'])
def delete_employee(id):
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({
            "message": "Employee not found"
            }), 404

    db.session.delete(employee)
    db.session.commit()
    return jsonify({
        "message": "Employee deleted successfully"
        }), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)