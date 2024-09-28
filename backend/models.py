import uuid
import random
import string
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates

db = SQLAlchemy()

class Cafe(db.Model):
    __tablename__ = 'cafes'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(256), nullable=False)
    logo = db.Column(db.String(256), nullable=True)  # Logo nullable
    location = db.Column(db.String(100), nullable=False)
    employees = db.relationship('Employee', backref='cafe', cascade="all, delete", lazy=True) # The cascading ensures all employees under is also deleted

    def __init__(self, name, description, logo=None, location=''):
        self.name = name
        self.description = description
        self.logo = logo
        self.location = location

def generate_employee_id():
    prefix = 'UI'
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    return prefix + suffix

class Employee(db.Model):
    __tablename__ = 'employees'

    id = db.Column(db.String(9), primary_key=True, default=generate_employee_id, unique=True)
    name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(8), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    cafe_id = db.Column(db.String(36), db.ForeignKey('cafes.id'), nullable=True)

    def __init__(self, name, email_address, phone_number, gender, start_date=None, cafe_id=None):
        self.id = generate_employee_id()
        self.name = name
        self.email_address = email_address
        self.phone_number = phone_number
        self.gender = gender
        self.start_date = start_date or datetime.now(timezone.utc)
        self.cafe_id = cafe_id

    @validates('phone_number')
    def validate_phone_number(self, key, phone_number):
        if len(phone_number) != 8 or phone_number[0] not in ['8', '9']:
            raise ValueError("Phone number must start with 8 or 9 and be 8 digits long")
        return phone_number
    

# Note to self:
# cafe_id as a Foreign Key:
# The cafe_id field is a foreign key referencing the id field of the Cafe model. 
# Its set to nullable=False, meaning every employee must be associated with one café.