import pytest
from flask import jsonify
import sys
import os 

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app  
from db import db
from models.users_model import Users
from config import Config

'''
cd server 
run test cases specificed in this file: 
    pytest test\test_users_api.py
run all test cases:
    pytest 
'''
@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    # app.config['SQLALCHEMY_DATABASE_URI'] == Config.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

# Test for listing all users
def test_list_all_users_empty(client):
    response = client.get('/users/all')
    assert response.status_code == 404
    assert response.json == {'message': 'No users found'}

def test_list_all_users_with_data(client):
    # Add a test user to the database
    user = Users(userid="e7e9f6d2-d8e0-4f93-a6c0-2343b4b8a43c", name="John Doe", email="john@example.com")
    db.session.add(user)
    db.session.commit()
    
    response = client.get('/users/all')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['name'] == 'John Doe'

# Test for getting user by email
def test_get_user_id_by_email(client):
    user = Users(userid="c9a47cb1-fb4e-43b3-85a1-2d629d8302be", name="Jane Smith", email="jane@example.com")
    db.session.add(user)
    db.session.commit()
    
    response = client.get('/users/id/email/jane@example.com')
    assert response.status_code == 200
    assert response.json == {'user_id': 'c9a47cb1-fb4e-43b3-85a1-2d629d8302be'}

def test_get_user_id_by_nonexistent_email(client):
    response = client.get('/users/id/email/nonexistent@example.com')
    assert response.status_code == 404

# Test for creating a new user
def test_create_user(client):
    response = client.post('/users',
                           json={'name': 'New User', 'email': 'newuser@example.com'})
    print("here")
    print(response.json)
    assert response.status_code == 201
    assert response.json['message'] == 'User created successfully'

def test_create_user_with_existing_email(client):
    user = Users(userid="c9be1711-03f4-4b5b-a65d-1a808d8ceece", name="Existing User", email="existing@example.com")
    db.session.add(user)
    db.session.commit()
    
    response = client.post('/users', json={'name': 'New User', 'email': 'existing@example.com'})
  
    assert response.status_code == 400

# Test for updating a user by user ID
def test_update_user(client):
    user = Users(userid="377c0030-0ee4-40f9-af8b-1cb9200f9803", name="Old Name", email="old@example.com")
    db.session.add(user)
    db.session.commit()

    response = client.put('/users/377c0030-0ee4-40f9-af8b-1cb9200f9803', json={'name': 'Updated Name'})
    assert response.status_code == 200
    assert response.json['message'] == 'User updated successfully'

# Test for updating a user by email
def test_update_user_by_email(client):
    user = Users(userid="7ca8527a-9546-4275-8ba2-4bd1b60c9719", name="Another Name", email="another@example.com")
    db.session.add(user)
    db.session.commit()

    response = client.put('/users/email/another@example.com', json={'name': 'Another Updated Name'})
    assert response.status_code == 200
    assert response.json['message'] == 'User updated successfully by email'

