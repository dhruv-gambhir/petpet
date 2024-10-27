import pytest
from datetime import datetime
import sys 
import os 
import uuid

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app  
from db import db
from models.pets_model import Pets
from models.users_model import Users

'''
cd server 
run test cases specificed in this file:
    pytest unit-test\test_event_interest_route.py

run all test cases:
    pytest

'''

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_get_pets_list(client):
    # Generate a test UUID for user_id
    test_user_id = str(uuid4())
    
    # Create and insert test user into the database
    user = Users(userid=test_user_id, name="User Two", email="usertwo@example.com")
    
    # Create a single pet linked to the test user
    pet = Pets(
        id=str(uuid4()),
        ownerid=test_user_id,
        name="Buddy",
        species="Dog",
        breed="Golden Retriever",
        age=5,
        sex="male",
        color="Golden",
        weight=30.0,
        imageurl="https://example.com/buddy.jpg"
    )
    
    # Add user and pet to the session and commit to the in-memory database
    with client.application.app_context():
        db.session.add(user)
        db.session.add(pet)
        db.session.commit()

    # Make a GET request to the endpoint
    response = client.get(f'/pets/user/{test_user_id}')
    
    # Assertions
    assert response.status_code == 200
    data = response.get_json()
    
    # Check that only one pet is returned
    assert len(data) == 1
    # Verify the data of the single pet
    assert data[0]['name'] == "Buddy"
    assert data[0]['species'] == "Dog"
    assert data[0]['breed'] == "Golden Retriever"
    assert data[0]['age'] == 5
    assert data[0]['sex'] == "male"
    assert data[0]['color'] == "Golden"
    assert data[0]['weight'] == 30.0
    assert data[0]['imageurl'] == "https://example.com/buddy.jpg"

def test_create_pet(client):
    # Generate a test UUID for user_id
    test_user_id = str(uuid4())

    # Create and insert a test user to fulfill the foreign key constraint
    user = Users(userid=test_user_id, name="User Three", email="userthree@example.com")
    
    # Add user to the session and commit to the in-memory database
    with client.application.app_context():
        db.session.add(user)
        db.session.commit()

    # Pet data for POST request
    pet_data = {
        "ownerid": test_user_id,
        "name": "Rocky",
        "species": "Dog",
        "breed": "Bulldog",
        "age": 4,
        "sex": "male",
        "color": "Brown",
        "weight": 25.0,
        "imageurl": "https://example.com/rocky.jpg"
    }

    # Send POST request to create a new pet
    response = client.post('/pets', json=pet_data)
    
    # Assertions
    assert response.status_code == 201  # Check if pet creation was successful
    data = response.get_json()
    assert data['message'] == 'Pet created successfully'
    assert 'pet_id' in data  # Check if pet_id is returned

    # Verify the pet was added to the database
    with client.application.app_context():
        pet_in_db = Pets.query.filter_by(id=data['pet_id']).first()
        assert pet_in_db is not None
        assert pet_in_db.name == "Rocky"
        assert pet_in_db.species == "Dog"
        assert pet_in_db.breed == "Bulldog"
        assert pet_in_db.age == 4
        assert pet_in_db.sex == "male"
        assert pet_in_db.color == "Brown"
        assert pet_in_db.weight == 25.0
        assert pet_in_db.imageurl == "https://example.com/rocky.jpg"
