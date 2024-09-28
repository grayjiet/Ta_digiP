import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Cafe
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

def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False

@app.route('/cafes', methods=['GET'])
def get_cafes():
    if request.method == 'GET':
        location = request.args.get('location', None)
        
        # Query if location is provided
        if location:
            cafes = Cafe.query.filter_by(location=location).all()
        else:
            cafes = Cafe.query.all()
        
        # For the sorting of cafes by employee count
        cafes_sorted = sorted(cafes, key=lambda cafe: len(cafe.employees), reverse=True)

        if cafes_sorted:
            return jsonify({
                "cafes": [
                    {
                        "id": cafe.id,
                        "name": cafe.name,
                        "description": cafe.description,
                        "logo": cafe.logo,
                        "location": cafe.location,
                        "employee_count": len(cafe.employees)
                    } for cafe in cafes_sorted
                ]
            }), 200
        return jsonify({
            "message": "No cafes found"
            }), 404

   
@app.route('/cafe', methods=['POST'])
def create_cafe():
    data = request.json
    new_cafe = Cafe(
        name=data['name'],
        description=data.get('description', ''),
        logo=data.get('logo', ''),
        location=data['location']
    )
    db.session.add(new_cafe)
    db.session.commit()
    return jsonify({
        "message": "Cafe created successfully", "cafe_id": new_cafe.id
        }), 201


@app.route('/cafe/<string:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_cafe(id):
    if not is_valid_uuid(id):
        return jsonify({
            "message": "Invalid Cafe ID format"
            }), 400

    cafe = Cafe.query.get(id)
    if not cafe:
        return jsonify({
            "message": "Cafe not found"
            }), 404

    if request.method == 'GET':
        return jsonify({
            "id": cafe.id,
            "name": cafe.name,
            "description": cafe.description,
            "logo": cafe.logo,
            "location": cafe.location
        }), 200

    elif request.method == 'PUT':
        data = request.json
        cafe.name = data.get('name', cafe.name)
        cafe.description = data.get('description', cafe.description)
        cafe.logo = data.get('logo', cafe.logo)
        cafe.location = data.get('location', cafe.location)

        db.session.commit()
        return jsonify({
            "message": "Cafe updated successfully"
            }), 200

    elif request.method == 'DELETE':
        db.session.delete(cafe)
        db.session.commit()
        return jsonify({
            "message": "Cafe deleted successfully"
            }), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)