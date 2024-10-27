import pytest
from datetime import datetime
import sys 
import os 

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
    pytest unit-test\test_event_route.py

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

def test_get_all_events_empty(client):
    response = client.get('/events')
    assert response.status_code == 200
    assert response.json == []

def test_get_all_events_with_data(client):
    user = Users(userid="377c0030-0ee4-40f9-af8b-1cb9200f9803", name="Event Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()
    
    event = Event(id="a537fe3a-996d-4fbe-a1dc-3dd91656c647", createdby=user.userid, event_name="Sample Event", description="This is a test event.")
    db.session.add(event)
    db.session.commit()
    
    response = client.get('/events')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['event_name'] == "Sample Event"


def test_get_event_by_id(client):
    user = Users(userid="377c0030-0ee4-40f9-af8b-1cb9200f9803", name="Event Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()
    
    event = Event(id="a537fe3a-996d-4fbe-a1dc-3dd91656c647", createdby=user.userid, event_name="Sample Event")
    db.session.add(event)
    db.session.commit()
    
    response = client.get(f'/events/{event.id}?userid={user.userid}')
    assert response.status_code == 200
    assert response.json['event_name'] == "Sample Event"

def test_get_event_by_invalid_id(client):
    user = Users(userid="377c0030-0ee4-40f9-af8b-1cb9200f9803", name="Event Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()

    response = client.get(f'/events/invalid_id?userid={user.userid}')
    assert response.status_code == 404

# Test for creating an event
def test_create_event(client):
    user = Users(userid="377c0030-0ee4-40f9-af8b-1cb9200f9803", name="Event Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()
    
    event_data = {
        'createdby': user.userid,
        'event_name': 'New Event',
        'description': 'Event description',
        'startdate': datetime.now().strftime('%Y-%m-%dT%H:%M')
    }
    response = client.post('/events', json=event_data)
    assert response.status_code == 201
    assert response.json['message'] == 'Event created successfully'

def test_create_event_missing_data(client):
    response = client.post('/events', json={'event_name': 'Incomplete Event'})
    assert response.status_code == 400

# Test for updating an event
def test_update_event(client):
    user = Users(userid="377c0030-0ee4-40f9-af8b-1cb9200f9803", name="Event Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()
    
    event = Event(id="a537fe3a-996d-4fbe-a1dc-3dd91656c647", createdby=user.userid, event_name="Old Event")
    db.session.add(event)
    db.session.commit()
    
    response = client.put(f'/events/{event.id}', json={'event_name': 'Updated Event'})
    assert response.status_code == 200
    assert response.json['message'] == 'Event updated successfully'

def test_update_event_invalid_id(client):
    response = client.put('/events/invalid_id', json={'event_name': 'Updated Event'})
    assert response.status_code == 404


def test_delete_event(client):
    user = Users(userid="377c0030-0ee4-40f9-af8b-1cb9200f9803", name="Event Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()
    
    event = Event(id="a537fe3a-996d-4fbe-a1dc-3dd91656c647", createdby=user.userid, event_name="Event to Delete")
    db.session.add(event)
    db.session.commit()
    
    response = client.delete(f'/events/{event.id}')
    assert response.status_code == 200
    assert response.json['message'] == 'Event deleted successfully'

def test_delete_event_invalid_id(client):
    response = client.delete('/events/invalid_id')
    assert response.status_code == 404


def test_get_events_by_user(client):
    user = Users(userid="377c0030-0ee4-40f9-af8b-1cb9200f9803", name="Event Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()
    
    event = Event(id="a537fe3a-996d-4fbe-a1dc-3dd91656c647", createdby=user.userid, event_name="User Event")
    db.session.add(event)
    db.session.commit()
    
    response = client.get(f'/events/user/{user.userid}')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['event_name'] == "User Event"

def test_get_events_by_user_interest(client):
    user = Users(userid="377c0030-0ee4-40f9-af8b-1cb9200f9803", name="Interested User", email="interested@example.com")
    event_creator = Users(userid="47181821-5af6-4cb4-a036-efeb50bd20e6", name="Event Creator", email="creator@example.com")
    db.session.add_all([user, event_creator])
    db.session.commit()
    
    event = Event(id="a537fe3a-996d-4fbe-a1dc-3dd91656c647", createdby=event_creator.userid, event_name="Interested Event")
    db.session.add(event)
    db.session.commit()
    
    interest = EventInterest(userid=user.userid, eventid=event.id)
    db.session.add(interest)
    db.session.commit()
    
    response = client.get(f'/events/user_interest/{user.userid}')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['event_name'] == "Interested Event"
    assert response.json[0]['interested'] is True

  