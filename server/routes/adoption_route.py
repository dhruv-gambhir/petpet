from flask import Blueprint, jsonify, request, abort
from models.adoption_interest_model import AdoptionInterest
from models.users_model import Users
from models.adoption_model import Adoption
from models.pets_model import Pets
from datetime import datetime
import logging
from db import db
from flask import current_app

adoption_bp = Blueprint('adoption_bp', __name__)

# Route to all adoption listings available
@adoption_bp.route('', methods=['GET'])
def get_adoption_listings():

    #for now without jwt auth just use user id in the url
    userid = request.args.get('userid')  # Fetch userid from query parameters
    if not userid:
        abort(400, description="Invalid request. 'userid' is required.")

    adoption_listings = Adoption.query.all()

    
    adoption_list = [{
        'id': adoption.id,
        'agentid': adoption.agentid,
        'name': Users.query.get(adoption.agentid).name,
        'description': adoption.description,
        'status': adoption.status,
        'createdat': adoption.createdat,
        'updatedat': adoption.updatedat,
        'pet': {  # Include pet details in the response
            'id': adoption.petid,
            'name': Pets.query.get(adoption.petid).name,
            'species': Pets.query.get(adoption.petid).species,
            'breed': Pets.query.get(adoption.petid).breed,
            'age': Pets.query.get(adoption.petid).age,
            'sex': Pets.query.get(adoption.petid).sex,
            'color': Pets.query.get(adoption.petid).color,
            'weight': Pets.query.get(adoption.petid).weight,
            'imageurl': Pets.query.get(adoption.petid).imageurl
        },
        # shown interest
        'interested': bool(AdoptionInterest.query.filter_by(userid=userid, adoptionlistingid=adoption.id).first())
    } for adoption in adoption_listings]
    return jsonify(adoption_list), 200

# Route to fetch a single adoption listing by ID (GET)
@adoption_bp.route('/<string:adoption_id>', methods=['GET'])
def get_adoption_listing(adoption_id):
    #for now without jwt auth just use user id in the url
    userid = request.args.get('userid')  # Fetch userid from query parameters
    if not userid:
        abort(400, description="Invalid request. 'userid' is required.")
    adoption = Adoption.query.get(adoption_id)
    if not adoption:
        abort(404, description="Adoption listing not found")

    adoption_data = {
        'id': adoption.id,
        'agentid': adoption.agentid,
        'name': Users.query.get(adoption.agentid).name,
        'pet': {  # Include pet details in the response
            'id': adoption.petid,
            'name': Pets.query.get(adoption.petid).name,
            'species': Pets.query.get(adoption.petid).species,
            'breed': Pets.query.get(adoption.petid).breed,
            'age': Pets.query.get(adoption.petid).age,
            'sex': Pets.query.get(adoption.petid).sex,
            'color': Pets.query.get(adoption.petid).color,
            'weight': Pets.query.get(adoption.petid).weight,
            'imageurl': Pets.query.get(adoption.petid).imageurl
        },
        'description': adoption.description,
        'status': adoption.status,
        'createdat': adoption.createdat,
        'updatedat': adoption.updatedat,
        'interested': bool(AdoptionInterest.query.filter_by(userid=userid, adoptionlistingid=adoption.id).first())
    }
    return jsonify(adoption_data), 200

# Route to create a new adoption listing (POST)
@adoption_bp.route('', methods=['POST'])
def create_adoption_listing():
    data = request.get_json()
    if not data or not data.get('agentid') or not data.get('petid'):
        abort(400, description="Invalid adoption listing data. 'agentid', 'petid' are required.")

    pet_data= data.get('pet')
    if not pet_data or not pet_data.get('name') or not pet_data.get('species') or not pet_data.get('breed') or not pet_data.get('imageurl'):
        abort(400, description="Invalid pet data. 'name', 'species', 'breed', 'image' are required.")
    
    #create a new pet
    new_pet= Pets(
        ownerid=data['agentid'],
        name=pet_data['name'],
        species=pet_data['species'],
        breed=pet_data['breed'],
        age=pet_data.get('age', 0),
        sex= pet_data.get('sex'),
        color= pet_data.get('color'),
        weight= pet_data.get('weight'),
        imageurl=pet_data['imageurl']
    )
    db.session.add(new_pet)
    db.session.flush()  # Flush the session to get the pet ID

    # Create a new adoption listing
    new_adoption = Adoption(
        agentid=data['agentid'],
        petid= new_pet.id,
        description=data['description'],
        status=data.get('status', 'pending')
    )
    db.session.add(new_adoption)
    db.session.commit()
    return jsonify({'message': 'Adoption listing created successfully', 
                    'adoption_id': new_adoption.id,
                    'pet_id': new_pet.id}), 201

# Route to update an adoption listing (PUT)
@adoption_bp.route('/<string:adoption_id>', methods=['PUT'])
def update_adoption_listing(adoption_id):
    adoption = Adoption.query.get(adoption_id)
    if not adoption:
        abort(404, description="Adoption listing not found")

    data = request.get_json()

    #if the request has pet data, update the pet details
    pet_data= data.get('pet')
    new_pet_added= False
    new_petId= None
    if pet_data:
        # if pet id is not present in the data, create a new pet
        if not pet_data.get('id'):
            pet = Pets(
                ownerid=adoption.agentid,
                name=pet_data['name'],
                species=pet_data['species'],
                breed=pet_data['breed'],
                age=pet_data.get('age', 0),
                sex= pet_data.get('sex'),
                color= pet_data.get('color'),
                weight= pet_data.get('weight'),
                imageurl=pet_data['imageurl']
            )
            db.session.add(pet)  # Add the new pet to the session
            db.session.flush()  # Flush to get the new pet.id
            new_pet_added = True
            new_petId = pet.id
        else:
            # if pet id is present in the data, update the pet details
            pet = Pets.query.get(adoption.petid)
            # Check if the pet exists
            if not pet:
                abort(404, description="Pet not found")
            #update pet details
            pet.name = pet_data.get('name', pet.name)
            pet.species = pet_data.get('species', pet.species)
            pet.breed = pet_data.get('breed', pet.breed)
            pet.age = pet_data.get('age', pet.age)
            pet.sex= pet_data.get('sex', pet.sex)
            pet.color= pet_data.get('color', pet.color)
            pet.weight= pet_data.get('weight', pet.weight)
            pet.imageurl = pet_data.get('imageurl', pet.imageurl)

            db.session.add(pet)  # Update the pet details in the session
            db.session.flush()

    
    # Update the adoption listing details

    adoption.agentid = data.get('agentid', adoption.agentid)
    if new_pet_added:
        adoption.petid = new_petId
    else:
        adoption.petid = data.get('petid', adoption.petid)
    adoption.description = data.get('description', adoption.description)
    adoption.status = data.get('status', adoption.status)

    db.session.commit()
    return jsonify({'message': 'Adoption listing updated successfully'}), 200

# Route to delete an adoption listing (DELETE)
@adoption_bp.route('/<string:adoption_id>', methods=['DELETE'])
def delete_adoption_listing(adoption_id):
    adoption = Adoption.query.get(adoption_id)
    if not adoption:
        abort(404, description="Adoption listing not found")

    db.session.delete(adoption)
    db.session.commit()
    return jsonify({'message': 'Adoption listing deleted successfully'}), 200