
from flask import Blueprint, jsonify, request, abort
from models.sitting_request_model import SittingRequests
from models.pets_sitting_request_model import PetSittingRequests
from models.sitter_interest_model import SitterInterests
from models.users_model import Users
from models.pets_model import Pets
from datetime import datetime
from db import db

sitting_request_bp = Blueprint('sitting_request_bp', __name__)

@sitting_request_bp.route('', methods=['GET'])
def get_sitting_requests():
    #for now without jwt auth just use user id in the url
    userid = request.args.get('userid')  # Fetch userid from query parameters
    if not userid:
        abort(400, description="Invalid request. 'userid' is required.")

    sitting_requests = SittingRequests.query.all()

    #keeping the pet details seperate from the all sitting request details, 
    #only specific sitting request details will be able to see pet list 
    sitting_request_list = [{
        'id': sitting_request.id,
        'userid': sitting_request.userid,
        'name': Users.query.get(sitting_request.userid).name,
        'pay': sitting_request.pay,
        'startdate': sitting_request.startdate.strftime('%Y-%m-%d %H:%M:%S') if sitting_request.startdate else None,
        'enddate': sitting_request.enddate.strftime('%Y-%m-%d %H:%M:%S') if sitting_request.enddate else None,
        'description': sitting_request.description,
        'status': sitting_request.status,
        'createdat': sitting_request.createdat,
        'location': sitting_request.location,
        'tasktype': sitting_request.tasktype,
        'interested': bool(SitterInterests.query.filter_by(userid=userid, sittingrequestid=sitting_request.id).first())
    } for sitting_request in sitting_requests]
    return jsonify(sitting_request_list), 200

# Route to fetch a single sitting request by ID (GET)
@sitting_request_bp.route('/<string:sitting_request_id>', methods=['GET'])
def get_sitting_request_with_pet(sitting_request_id):
    sitting_request = SittingRequests.query.get(sitting_request_id)
    #for now without jwt auth just use user id in the url
    userid = request.args.get('userid')  # Fetch userid from query parameters
    if not userid:
        abort(400, description="Invalid request. 'userid' is required.")

    if not sitting_request:
        abort(404, description="Sitting request not found")

   # assumed pets are already created and associated with the user 
   # Query the PetSittingRequests table for all pets associated with the sitting request
    pet_sitting_requests = PetSittingRequests.query.filter_by(sittingrequestid=sitting_request_id).all()

    # Query the Pets table for each petid in pet_sitting_requests
    pet_info = []
    for pet_sitting in pet_sitting_requests:
        pet = Pets.query.get(pet_sitting.petid)
        if pet:
            pet_info.append({
                'id': pet.id,
                'name': pet.name,
                'species': pet.species,
                'breed': pet.breed,
                'age': pet.age,
                'sex': pet.sex, 
                'color': pet.color,
                'weight': pet.weight,
                'imageurl': pet.imageurl
            })

    sitting_request_data = {
        'id': sitting_request.id,
        'userid': sitting_request.userid,
        'name': Users.query.get(sitting_request.userid).name,
        'pay': sitting_request.pay,
        'startdate': sitting_request.startdate.strftime('%Y-%m-%d %H:%M:%S') if sitting_request.startdate else None,
        'enddate': sitting_request.enddate.strftime('%Y-%m-%d %H:%M:%S') if sitting_request.enddate else None,
        'description': sitting_request.description,
        'status': sitting_request.status,
        'createdat': sitting_request.createdat,
        'location': sitting_request.location,
        'tasktype': sitting_request.tasktype,
        'interested': bool(SitterInterests.query.filter_by(userid=userid, sittingrequestid=sitting_request.id).first())
    }
    return jsonify(
        {'sitting_request': sitting_request_data, 'pets': pet_info}
    ), 200

# Route to create a new sitting request (POST)
@sitting_request_bp.route('', methods=['POST'])
def create_sitting_request():

    data= request.get_json()
    if not data or not data.get('userid'):
        abort(400, description="Invalid sitting request data. 'userid' is required.")
    
    # Assumed that pets are alearly created and associated with the user 
    # Check for the list of pet as "pets" in the request
    pet_data = data.get('pets')
    if not pet_data or not isinstance(pet_data, list):
        abort(400, description="Invalid pet data. List 'pets' is required.")

    # Use datetime.datetime to parse both date and time
    try:
        startdate = datetime.strptime(data.get('startdate'), '%Y-%m-%d %H:%M:%S') if data.get('startdate') else None
    except ValueError:
        abort(400, description="Invalid date format for 'startdate'. Expected format: YYYY-MM-DD HH:MM:SS")

    # Use datetime.datetime to parse both date and time
    try:
        enddate = datetime.strptime(data.get('enddate'), '%Y-%m-%d %H:%M:%S') if data.get('enddate') else None
    except ValueError:
        abort(400, description="Invalid date format for 'enddate'. Expected format: YYYY-MM-DD HH:MM:SS")
    
    # Create a new sitting request
    new_sitting_request = SittingRequests(
        userid=data['userid'],
        pay=data['pay'],
        startdate=startdate,
        enddate=enddate,
        description=data['description'],
        status=data.get('status', 'pending'),
        tasktype=data.get('tasktype'),
        location=data.get('location'),
   
    )

    db.session.add(new_sitting_request)
    db.session.flush()  # Flush the session to get the sitting request ID

    # Create a new pet for each pet data in the list
    new_pet_sitting_request_ids=[]
    for pet in pet_data:
            if not pet.get('id'):
                abort(400, description="Invalid pet data. 'id' is required for each pet.")
    for pet in pet_data:
        #also need to add the pet to the pet_sitting_requests table
        new_pet_sitting_request = PetSittingRequests(
            sittingrequestid=new_sitting_request.id,
            petid= pet.get('id')
        )
        db.session.add(new_pet_sitting_request)
        db.session.flush() # Flush the session to get the pet_sitting_request ID
        new_pet_sitting_request_ids.append(new_pet_sitting_request.id)
    db.session.commit()

    #should return the sitting request id and list of new pet_sitting_request id
    return jsonify({'message': 'Sitting request created successfully', 
                    'sitting_request_id': new_sitting_request.id, 
                    'pet_sitting_request_ids': new_pet_sitting_request_ids
                    }), 201

# Route to update a sitting request (PUT)
# Not using this -> needs to update for new pet api too 
@sitting_request_bp.route('/<string:sitting_request_id>', methods=['PUT'])
def update_sitting_request(sitting_request_id):
    sitting_request = SittingRequests.query.get(sitting_request_id)
    if not sitting_request:
        abort(404, description="Sitting request not found")

    data = request.get_json()

    # Update sitting request fields
    sitting_request.userid = data.get('userid', sitting_request.userid)
    sitting_request.pay = data.get('pay', sitting_request.pay)
    sitting_request.startdate = datetime.strptime(data['startdate'], '%Y-%m-%d %H:%M:%S').date()
    sitting_request.enddate = datetime.strptime(data['enddate'], '%Y-%m-%d %H:%M:%S').date()
    sitting_request.description = data.get('description', sitting_request.description)
    sitting_request.status = data.get('status', sitting_request.status)
    sitting_request.location = data.get('location', sitting_request.location)  # Add location field

    # Check for pet data in the request
    pet_data = data.get('pets')
    if pet_data:
        for pet in pet_data:
            # If the pet already exists (check by pet_id), update it
            if 'id' in pet:
                existing_pet = Pets.query.get(pet['id'])
                if existing_pet:
                    existing_pet.name = pet.get('name', existing_pet.name)
                    existing_pet.species = pet.get('species', existing_pet.species)
                    existing_pet.breed = pet.get('breed', existing_pet.breed)
                    existing_pet.age = pet.get('age', existing_pet.age)
                    existing_pet.sex= pet.get('sex', existing_pet.sex)
                    existing_pet.color= pet.get('color', existing_pet.color)
                    existing_pet.weight= pet.get('weight', existing_pet.weight)
                    existing_pet.imageurl = pet.get('imageurl', existing_pet.imageurl)
            else:
                # If pet data is new, create a new pet and add to the sitting request
                new_pet = Pets(
                    ownerid=sitting_request.userid,
                    name=pet['name'],
                    species=pet['species'],
                    breed=pet.get('breed'),
                    age=pet.get('age', 0),
                    sex= pet.get('sex'),
                    color= pet.get('color'),
                    weight= pet.get('weight'),
                    imageurl=pet.get('imageurl')
                )
                db.session.add(new_pet)
                db.session.flush()  # Flush to get the new pet ID

                # Create a new PetSittingRequests entry
                new_pet_sitting_request = PetSittingRequests(
                    sittingrequestid=sitting_request.id,
                    petid=new_pet.id
                )
                db.session.add(new_pet_sitting_request)

    db.session.commit()
    return jsonify({'message': 'Sitting request updated successfully'}), 200


# Route to delete a sitting request (DELETE)
@sitting_request_bp.route('/<string:sitting_request_id>', methods=['DELETE'])
def delete_sitting_request(sitting_request_id):
    sitting_request = SittingRequests.query.get(sitting_request_id)
    if not sitting_request:
        abort(404, description="Sitting request not found")

    # Delete all associated pets from the PetSittingRequests table
    pet_sitting_requests = PetSittingRequests.query.filter_by(sittingrequestid=sitting_request_id).all()
    for pet_sitting_request in pet_sitting_requests:
        db.session.delete(pet_sitting_request)

    #Delete all sitter interests associated with this sitting request
    sitter_interests = SitterInterests.query.filter_by(sittingrequestid=sitting_request_id).all()
    for sitter_interest in sitter_interests:
        db.session.delete(sitter_interest)

    db.session.delete(sitting_request)
    db.session.commit()
    return jsonify({'message': 'Sitting request and related sitter interests and PetSittingRequests have been deleted successfully'}), 200

# Route to fetch all sitting request of a user (GET)
@sitting_request_bp.route('/user/<string:user_id>', methods=['GET'])
def get_user_sitting_requests(user_id):
    sitting_requests = SittingRequests.query.filter_by(userid=user_id).all()

    sitting_request_list = [{
        'id': sitting_request.id,
        'userid': sitting_request.userid,
        'name': Users.query.get(sitting_request.userid).name,
        'pay': sitting_request.pay,
        'startdate': sitting_request.startdate.strftime('%Y-%m-%d %H:%M:%S') if sitting_request.startdate else None,
        'enddate': sitting_request.enddate.strftime('%Y-%m-%d %H:%M:%S') if sitting_request.enddate else None,
        'description': sitting_request.description,
        'status': sitting_request.status,
        'createdat': sitting_request.createdat,
        'location': sitting_request.location,
        'tasktype': sitting_request.tasktype
    } for sitting_request in sitting_requests]
    return jsonify(sitting_request_list), 200


# Route to fetch all sitting request of a user (GET)
@sitting_request_bp.route('/user_interest/<string:user_id>', methods=['GET'])
def get_user_sitting_requests_interest(user_id):
    sitting_requests_interest = SitterInterests.query.filter_by(userid=user_id)
    sitting_requests = [SittingRequests.query.get(interest.sittingrequestid) for interest in sitting_requests_interest]

    sitting_request_list = [{
        'id': sitting_request.id,
        'userid': sitting_request.userid,
        'name': Users.query.get(sitting_request.userid).name,
        'pay': sitting_request.pay,
        'startdate': sitting_request.startdate.strftime('%Y-%m-%d') if sitting_request.startdate else None,
        'enddate': sitting_request.enddate.strftime('%Y-%m-%d') if sitting_request.enddate else None,
        'description': sitting_request.description,
        'status': sitting_request.status,
        'createdat': sitting_request.createdat,
        'location': sitting_request.location,
        'interested': True,
        # 'tasktype': sitting_request.tasktype
    } for sitting_request in sitting_requests]
    return jsonify(sitting_request_list), 200