import pytest
from datetime import datetime
import sys
import os
import uuid

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app
from db import db
from models.adoption_model import Adoption
from models.pets_model import Pets
from models.users_model import Users
from models.adoption_interest_model import AdoptionInterest

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

def test_get_all_adoption_listings_empty(client):
    response = client.get('/adoption_listings')
    assert response.status_code == 200
    assert response.json == []

def test_get_all_adoption_listings_with_data(client):
    user = Users(userid=str(uuid.uuid4()), name="Adoption Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=user.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=user.userid, petid=pet.id, description="Loving dog needs a home.")
    db.session.add(adoption)
    db.session.commit()

    response = client.get('/adoption_listings')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['description'] == "Loving dog needs a home."
    assert response.json[0]['pet']['name'] == "Buddy"

def test_get_adoption_listing_by_user(client):
    user = Users(userid=str(uuid.uuid4()), name="Adoption Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=user.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=user.userid, petid=pet.id, description="Loving dog needs a home.")
    db.session.add(adoption)
    db.session.commit()

    response = client.get(f'/adoption_listings/user/{user.userid}')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['description'] == "Loving dog needs a home."

def test_create_adoption_listing(client):
    user = Users(userid=str(uuid.uuid4()), name="Adoption Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()

    pet_data = {
        'name': 'Buddy',
        'species': 'Dog',
        'breed': 'Labrador',
        'age': 3,
        'imageurl': 'http://example.com/buddy.jpg'
    }
    adoption_data = {
        'agentid': user.userid,
        'description': 'Loving dog needs a home',
        'pet': pet_data
    }
    
    response = client.post('/adoption_listings', json=adoption_data)
    assert response.status_code == 201
    assert response.json['message'] == 'Adoption listing created successfully'

def test_create_adoption_listing_missing_data(client):
    response = client.post('/adoption_listings', json={'agentid': str(uuid.uuid4())})
    assert response.status_code == 400

def test_update_adoption_listing(client):
    user = Users(userid=str(uuid.uuid4()), name="Adoption Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=user.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=user.userid, petid=pet.id, description="Old description")
    db.session.add(adoption)
    db.session.commit()

    response = client.put(f'/adoption_listings/{adoption.id}', json={'description': 'Updated description'})
    assert response.status_code == 200
    assert response.json['message'] == 'Adoption listing updated successfully'

def test_update_adoption_listing_invalid_id(client):
    response = client.put('/adoption_listings/invalid_id', json={'description': 'Updated description'})
    assert response.status_code == 404

def test_delete_adoption_listing(client):
    user = Users(userid=str(uuid.uuid4()), name="Adoption Creator", email="creator@example.com")
    db.session.add(user)
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=user.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=user.userid, petid=pet.id, description="To be deleted")
    db.session.add(adoption)
    db.session.commit()

    response = client.delete(f'/adoption_listings/{adoption.id}')
    assert response.status_code == 200
    assert response.json['message'] == 'Adoption listing deleted successfully'

def test_delete_adoption_listing_invalid_id(client):
    response = client.delete('/adoption_listings/invalid_id')
    assert response.status_code == 404

def test_get_adoption_listing_interest(client):
    user = Users(userid=str(uuid.uuid4()), name="Interested User", email="interested@example.com")
    adoption_creator = Users(userid=str(uuid.uuid4()), name="Adoption Creator", email="creator@example.com")
    db.session.add_all([user, adoption_creator])
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=adoption_creator.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=adoption_creator.userid, petid=pet.id, description="Interested in")
    db.session.add(adoption)
    db.session.commit()

    interest = AdoptionInterest(userid=user.userid, adoptionlistingid=adoption.id)
    db.session.add(interest)
    db.session.commit()

    response = client.get(f'/adoption_listings/user_interest/{user.userid}')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['description'] == "Interested in"
    assert response.json[0]['interested'] is True
