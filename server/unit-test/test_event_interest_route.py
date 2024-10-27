import pytest
from datetime import datetime
import sys 
import os 
import uuid

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app  
from db import db
from models.event_model import Event
from models.event_interest_model import EventInterest
from models.users_model import Users
from db import db

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


def generate_uuid():
    return str(uuid.uuid4())

def test_get_all_event_interests_empty(client):
    response = client.get('/event_interests')
    assert response.status_code == 200
    assert response.json == []

def test_get_all_event_interests_with_data(client):
    user_id = generate_uuid()
    event_id = generate_uuid()
    user = Users(userid=user_id, name="User One", email="userone@example.com")
    event = Event(id=event_id, createdby=user_id, event_name="Test Event")
    db.session.add_all([user, event])
    db.session.commit()
    
    event_interest = EventInterest(eventid=event_id, userid=user_id, status="pending")
    db.session.add(event_interest)
    db.session.commit()
    
    response = client.get('/event_interests')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['status'] == "pending"
    assert response.json[0]['eventid'] == event_id



def test_get_event_interest_by_id(client):
    user_id = generate_uuid()
    event_id = generate_uuid()
    user = Users(userid=user_id, name="User One", email="userone@example.com")
    event = Event(id=event_id, createdby=user_id, event_name="Test Event")
    db.session.add_all([user, event])
    db.session.commit()
    
    event_interest = EventInterest(eventid=event_id, userid=user_id, status="pending")
    db.session.add(event_interest)
    db.session.commit()
    
    response = client.get(f'/event_interests/{event_id}')
    assert response.status_code == 200
    assert response.json['status'] == "pending"
    assert response.json['eventid'] == event_id
    assert response.json['userid'] == user_id

def test_get_event_interest_by_invalid_id(client):
    response = client.get(f'/event_interests/{generate_uuid()}')
    assert response.status_code == 404


def test_create_event_interest(client):
    user_id = generate_uuid()
    event_id = generate_uuid()
    user = Users(userid=user_id, name="User One", email="userone@example.com")
    event = Event(id=event_id, createdby=user_id, event_name="Test Event")
    db.session.add_all([user, event])
    db.session.commit()
    
    event_interest_data = {
        'eventid': event_id,
        'userid': user_id,
        'status': 'pending'
    }
    response = client.post('/event_interests', json=event_interest_data)
    assert response.status_code == 201
    assert response.json['message'] == 'Event interest created successfully'
    assert 'event_interest_id' in response.json

def test_create_event_interest_missing_data(client):
    response = client.post('/event_interests', json={'eventid': generate_uuid()})
    assert response.status_code == 400


def test_update_event_interest(client):
    user_id = generate_uuid()
    event_id = generate_uuid()
    user = Users(userid=user_id, name="User One", email="userone@example.com")
    event = Event(id=event_id, createdby=user_id, event_name="Test Event")
    db.session.add_all([user, event])
    db.session.commit()
    
    event_interest = EventInterest(eventid=event_id, userid=user_id, status="pending")
    db.session.add(event_interest)
    db.session.commit()
    
    response = client.put(f'/event_interests/{event_interest.id}', json={'status': 'decided'})
    assert response.status_code == 200
    assert response.json['message'] == 'Event interest updated successfully'

def test_update_event_interest_invalid_id(client):
    response = client.put(f'/event_interests/{generate_uuid()}', json={'status': 'decided'})
    assert response.status_code == 404


def test_delete_event_interest(client):
    user_id = generate_uuid()
    event_id = generate_uuid()
    user = Users(userid=user_id, name="User One", email="userone@example.com")
    event = Event(id=event_id, createdby=user_id, event_name="Test Event")
    db.session.add_all([user, event])
    db.session.commit()
    
    event_interest = EventInterest(eventid=event_id, userid=user_id, status="pending")
    db.session.add(event_interest)
    db.session.commit()
    
    response = client.delete(f'/event_interests/{event_id}', json={'userid': user_id})
    assert response.status_code == 200
    assert response.json['message'] == 'Event interest deleted successfully'

def test_delete_event_interest_invalid_id(client):
    response = client.delete(f'/event_interests/{generate_uuid()}', json={'userid': generate_uuid()})
    assert response.status_code == 404

# if __name__ == '__main__':
#     pytest.main()