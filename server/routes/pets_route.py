from flask import Blueprint, jsonify, request, abort
from models.users_model import Users
from models.pets_model import Pets
from datetime import datetime
from db import db


pets_bp = Blueprint('pets_bp', __name__)

# Route to fetch all pets given a user (GET)
@pets_bp.route('/user/<string:user_id>', methods=['GET'])
def get_pets_list(user_id):
    pets = Pets.query.filter_by(userid=user_id).all()

    pet_list = [{
        'id': pet.id,
        'ownerid': pet.ownerid,
        'name': pet.name,
        'species': pet.type,
        'breed': pet.breed,
        'age': pet.age,
        'sex': pet.sex,
        'color': pet.color,
        'weight': pet.weight,
        'imageurl': pet.imageurl
    } for pet in pets]

    jsonify(pet_list), 200

# Route to post a new pet (POST)
@pets_bp.route('', methods=['POST'])
def create_pet():
    data = request.get_json()
    if not data or not data.get('ownerid') or not data.get('name') or not data.get('species'):
        abort(400, description="Invalid pet data. 'userid', 'name', and 'species' are required.")

    if not Users.query.get(data['ownerid']):
        abort(404, description="Owner not found")

    new_pet = Pets(
        ownerid=data['ownerid'],
        name=data['name'],
        species=data['species'],
        breed=data.get('breed'),
        sex= data.get('sex'),
        age=data.get('age', 0),
        color=data.get('color'),
        weight=data.get('weight', 0),
        imageurl=data.get('imageurl')
    )
    db.session.add(new_pet)
    db.session.commit()
    return jsonify({'message': 'Pet created successfully', 'pet_id': new_pet.id}), 201

# Update a pet (PUT)
@pets_bp.route('/<string:pet_id>', methods=['PUT'])
def update_pet(pet_id):
    pet = Pets.query.get(pet_id)
    if not pet:
        abort(404, description="Pet not found")

    data = request.get_json()
    if not data:
        abort(400, description="Invalid pet data")

    if data.get('ownerid') and not Users.query.get(data['ownerid']):
        abort(404, description="Owner not found")

    pet.ownerid = data.get('ownerid', pet.userid)
    pet.name = data.get('name', pet.name)
    pet.species = data.get('species', pet.species)
    pet.breed = data.get('breed', pet.breed)
    pet.sex= data.get('sex', pet.sex)
    pet.age = data.get('age', pet.age)
    pet.color = data.get('color', pet.color)
    pet.weight = data.get('weight', pet.weight)
    pet.imageurl = data.get('imageurl', pet.imageurl)

    db.session.commit()
    return jsonify({'message': 'Pet updated successfully', 'pet_id': pet.id}), 200

