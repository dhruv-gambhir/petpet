import pytest
import sys
import os
import uuid

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app
from db import db
from models.adoption_interest_model import AdoptionInterest
from models.adoption_model import Adoption
from models.users_model import Users
from models.pets_model import Pets

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

# Test case for GET all adoption interests when empty
def test_get_all_adoption_interests_empty(client):
    response = client.get('/adoption_interests')
    assert response.status_code == 200
    assert response.json == []

# Test case for GET all adoption interests with data
def test_get_all_adoption_interests_with_data(client):
    user1 = Users(userid=str(uuid.uuid4()), name="User 1", email="user1@example.com")
    db.session.add(user1)
    db.session.commit()

    user2 = Users(userid=str(uuid.uuid4()), name="User 2", email="user2@example.com")
    db.session.add(user2)
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=user1.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=user1.userid, petid=pet.id, description="Test adoption")
    db.session.add(adoption)
    db.session.commit()

    adoption_interest = AdoptionInterest(userid=user2.userid, adoptionlistingid=adoption.id, status="pending")
    db.session.add(adoption_interest)
    db.session.commit()

    response = client.get('/adoption_interests')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['userid'] == user2.userid

# Test case for GET adoption interest by ID
def test_get_adoption_interest_by_id(client):
    user1 = Users(userid=str(uuid.uuid4()), name="User 1", email="user1@example.com")
    db.session.add(user1)
    db.session.commit()

    user2 = Users(userid=str(uuid.uuid4()), name="User 2", email="user2@example.com")
    db.session.add(user2)
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=user1.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=user1.userid, petid=pet.id, description="Test adoption")
    db.session.add(adoption)
    db.session.commit()

    adoption_interest = AdoptionInterest(userid=user2.userid, adoptionlistingid=adoption.id, status="pending")
    db.session.add(adoption_interest)
    db.session.commit()

    response = client.get(f'/adoption_interests/{adoption_interest.id}')
    assert response.status_code == 200
    assert response.json['userid'] == user2.userid

# Test case for POST new adoption interest
def test_create_adoption_interest(client):
    user1 = Users(userid=str(uuid.uuid4()), name="User 1", email="user1@example.com")
    db.session.add(user1)
    db.session.commit()

    user2 = Users(userid=str(uuid.uuid4()), name="User 2", email="user2@example.com")
    db.session.add(user2)
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=user1.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=user1.userid, petid=pet.id, description="Test adoption")
    db.session.add(adoption)
    db.session.commit()

    adoption_interest_data = {
        'userid': user2.userid,
        'status': 'pending'
    }
    response = client.post(f'/adoption_interests/{adoption.id}', json=adoption_interest_data)
    assert response.status_code == 201
    assert response.json['message'] == 'Adoption interest created successfully'

# Test case for PUT update adoption interest
def test_update_adoption_interest(client):
    user1 = Users(userid=str(uuid.uuid4()), name="User 1", email="user1@example.com")
    db.session.add(user1)
    db.session.commit()

    user2 = Users(userid=str(uuid.uuid4()), name="User 2", email="user2@example.com")
    db.session.add(user2)
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=user1.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=user1.userid, petid=pet.id, description="Test adoption")
    db.session.add(adoption)
    db.session.commit()


    adoption_interest = AdoptionInterest(userid=user2.userid, adoptionlistingid=adoption.id, status="pending")
    db.session.add(adoption_interest)
    db.session.commit()

    update_data = {'status': 'accepted'}
    response = client.put(f'/adoption_interests/{adoption_interest.id}', json=update_data)
    assert response.status_code == 200
    assert response.json['message'] == 'Adoption interest updated successfully'

# Test case for DELETE adoption interest
def test_delete_adoption_interest(client):
    user1 = Users(userid=str(uuid.uuid4()), name="User 1", email="user1@example.com")
    db.session.add(user1)
    db.session.commit()

    user2 = Users(userid=str(uuid.uuid4()), name="User 2", email="user2@example.com")
    db.session.add(user2)
    db.session.commit()

    pet = Pets(id=str(uuid.uuid4()), ownerid=user1.userid, name="Buddy", species="Dog", breed="Labrador", age=3)
    db.session.add(pet)
    db.session.commit()

    adoption = Adoption(id=str(uuid.uuid4()), agentid=user1.userid, petid=pet.id, description="Test adoption")
    db.session.add(adoption)
    db.session.commit()

    adoption_interest = AdoptionInterest(userid=user2.userid, adoptionlistingid=adoption.id, status="pending")
    db.session.add(adoption_interest)
    db.session.commit()

    delete_data = {'userid': user2.userid}
    response = client.delete(f'/adoption_interests/{adoption_interest.id}', json=delete_data)
    assert response.status_code == 200
    assert response.json['message'] == 'Adoption interest deleted successfully'

# Test case for GET adoption interest by invalid ID
def test_get_adoption_interest_invalid_id(client):
    response = client.get('/adoption_interests/invalid_id')
    assert response.status_code == 404
