import os
from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
import uuid
from datetime import datetime

app = Flask(__name__)

# PostgreSQL database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL", 'postgresql://myuser:mypassword@localhost/mydb')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Models
class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    createdby = db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # UUID as string
    event_name = db.Column(db.String(255))
    description = db.Column(db.Text)
    location = db.Column(db.String(255))
    startdate = db.Column(db.Date)
    cost = db.Column(db.Integer)
    status = db.Column(db.Enum('pending', 'decided', 'accepted', 'rejected', name='status_enum'), default='pending')
    createdat = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    #add relationship to user table
    user = db.relationship('Users', backref='events_created')

    

class Adoption(db.Model):
    __tablename__ = 'adoption_listings'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    agentid= db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # Foreign Key of the user table (UUID as string)
    petid= db.Column(db.String(36), db.ForeignKey('pets.id'), nullable=False)  # Foreign Key of the pet table UUID as string
    description = db.Column(db.Text) # Description of the pet
    status = db.Column(db.Enum('pending', 'decided', name='status_enum'), default='pending') # Status of the adoption listing
    createdat = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    updatedat = db.Column(db.TIMESTAMP, onupdate=db.func.current_timestamp())

    #add relationship to user table and pet table
    users = db.relationship('Users', backref='adoption_listings_created')
    # Define the relationship with cascade delete
    pets = db.relationship('Pets', backref='adoption', cascade="all, delete", lazy=True)

class AdoptionInterest(db.Model):
    __tablename__ = 'adoption_interests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    userid= db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # Foreign Key of the user table (UUID as string)
    status = db.Column(db.Enum('pending', 'decided', name='status_enum'), default='pending') # Status of the adoption listing
    createdat = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    #add relationship to user table
    users = db.relationship('Users', backref='adoption_interests_created')

    
class EventInterest(db.Model):
    __tablename__ = 'event_interests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    eventid= db.Column(db.String(36), db.ForeignKey('events.id'), nullable=False)  # Foreign Key of the event table (UUID as string)
    userid= db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # Foreign Key of the user table (UUID as string)
    status = db.Column(db.Enum('pending', 'decided', name='status_enum'), default='pending') # Status of the adoption listing
    createdat = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    #add relationship to user table and event table
    users =  db.relationship('Users', backref='event_interests_created_of_user')
    events = db.relationship('Event', backref='event_interests_created')

class Users(db.Model):
    __tablename__ = 'users'
    userid = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    name= db.Column(db.String(255))  # Name of the user
    email= db.Column(db.String(255), unique=True, nullable=False)  # Email of the user
    phonenumber= db.Column(db.String(20))  # Phone number of the user
    createdat = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    updatedat = db.Column(db.TIMESTAMP, onupdate=db.func.current_timestamp())
    bio = db.Column(db.Text)  # Bio of the user
    imageurl = db.Column(db.Text)  # Image URL of the user
    isagency= db.Column(db.Boolean, default=False)  # Boolean to check if the user is an agency
    address= db.Column(db.String(255))  # Address of the user
    licensenumber= db.Column(db.String(200))  # License number of the user

    #add relationship to event table, adoption table, adoption interest table, event interest table
    events = db.relationship('Event', backref='users_of_event')
    adoption_listings = db.relationship('Adoption', backref='users_of_adoption')
    adoption_interests = db.relationship('AdoptionInterest', backref='users_of_adoption_interest')
    event_interests = db.relationship('EventInterest', backref='users_of_event_interest')
    sitting_requests= db.relationship('SittingRequests', backref='users_of_sitting_request')
    sitter_interests= db.relationship('SitterInterests', backref='users_of_sitter_interest')


class Pets(db.Model):
    __tablename__ = 'pets'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    ownerid= db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # Foreign Key of the user table (UUID as string)
    name= db.Column(db.String(100))  # Name of the pet
    sex = db.Column(db.Enum('male', 'female', name='sex_enum')) # sex of the pet
    species= db.Column(db.String(50))  # Species of the pet
    breed= db.Column(db.String(100))  # Breed of the pet
    age= db.Column(db.Integer)  # Age of the pet
    imageurl= db.Column(db.Text)  # Image URL of the pet
    createdat= db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    #add relationship to user table
    users = db.relationship('Users', backref='pets_owned')
    pet_sitting_requests= db.relationship('PetSittingRequests', backref='pets_info')

class SittingRequests(db.Model):
    __tablename__ = 'sitting_requests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    userid= db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # Foreign Key of the user table (UUID as string)
    pay= db.Column(db.Integer)  # Pay for the sitting request
    startdate= db.Column(db.Date)  # Start date of the sitting request
    enddate= db.Column(db.Date)  # End date of the sitting request
    description= db.Column(db.Text)  # Description of the sitting request
    status= db.Column(db.Enum('pending', 'decided', name='status_enum'), default='pending')  # Status of the sitting request
    createdat= db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    tasktype= db.Column(db.Enum('day_boarding', 'doggy_day_care', 'dog_walking', 'home_visits', 'house_sitting', name='task_enum'))  # Type of the task

    #add relationship to user table and sitter interest table and pet sitting request table
    sitter_interest= db.relationship('SitterInterests', backref='sitting_requests_made')
    pet_sitting_requests= db.relationship('PetSittingRequests', backref='sitting_requests_of_pets')

class SitterInterests(db.Model):
    __tablename__ = 'sitter_interests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    userid= db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # Foreign Key of the user table (UUID as string)
    sittingrequestid= db.Column(db.String(36), db.ForeignKey('sitting_requests.id'), nullable=False)  # Foreign Key of the sitting request table (UUID as string)
    status= db.Column(db.Enum('pending', 'decided', name='status_enum'), default='pending')  # Status of the sitting interest
    createdat= db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    #add relationship to user table and sitting request table
    user =  db.relationship('Users', backref='sitter_interests_made')
    sitting_request= db.relationship('SittingRequests', backref='sitter_interests_of_request')


class PetSittingRequests(db.Model):
    __tablename__ = 'pet_sitting_requests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    sittingrequestid= db.Column(db.String(36), db.ForeignKey('sitting_requests.id'), nullable=False)  # Foreign Key of the sitting request table (UUID as string)
    petid= db.Column(db.String(36), db.ForeignKey('pets.id'), nullable=False)  # Foreign Key of the pet table (UUID as string)

    #add relationship to sitting request table and pet table
    sitting_requests= db.relationship('SittingRequests', backref='petlist')
    pets= db.relationship('Pets', backref='pet_sitting_requests_made')


# Route to fetch all event listings (GET)
@app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    event_list = [{
        'id': event.id,
        'createdby': event.createdby,
        'event_name': event.event_name,
        'description': event.description,
        'location': event.location,
        'startdate': event.startdate.strftime('%Y-%m-%d') if event.startdate else None,
        'cost': event.cost,
        'status': event.status,
        'createdat': event.createdat
    } for event in events]
    return jsonify(event_list), 200

# Route to fetch a single event by ID (GET)
@app.route('/events/<string:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        abort(404, description="Event not found")

    event_data = {
        'id': event.id,
        'createdby': event.createdby,
        'event_name': event.event_name,
        'description': event.description,
        'location': event.location,
        'startdate': event.startdate.strftime('%Y-%m-%d') if event.startdate else None,
        'cost': event.cost,
        'status': event.status,
        'createdat': event.createdat
    }
    return jsonify(event_data), 200

# Route to create a new event (POST)
@app.route('/events', methods=['POST'])
def create_event():
    data = request.get_json()
    if not data or not data.get('event_name') or not data.get('createdby'):
        abort(400, description="Invalid event data. 'event_name' and 'createdby' are required.")
    
    try:
        startdate = datetime.strptime(data.get('startdate'), '%Y-%m-%d').date() if data.get('startdate') else None
    except ValueError:
        abort(400, description="Invalid date format for 'startdate'. Expected format: YYYY-MM-DD")

    new_event = Event(
        createdby=data['createdby'],
        event_name=data['event_name'],
        description=data.get('description'),
        location=data.get('location'),
        startdate=startdate,
        cost=data.get('cost', 0),
        status=data.get('status', 'pending')
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'message': 'Event created successfully', 'event_id': new_event.id}), 201

# Route to update an event (PUT)
@app.route('/events/<string:event_id>', methods=['PUT'])
def update_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        abort(404, description="Event not found")

    data = request.get_json()

    try:
        if 'startdate' in data:
            startdate = datetime.strptime(data.get('startdate'), '%Y-%m-%d').date()
            event.startdate = startdate
    except ValueError:
        abort(400, description="Invalid date format for 'startdate'. Expected format: YYYY-MM-DD")

    event.event_name = data.get('event_name', event.event_name)
    event.description = data.get('description', event.description)
    event.location = data.get('location', event.location)
    event.cost = data.get('cost', event.cost)
    event.status = data.get('status', event.status)

    db.session.commit()
    return jsonify({'message': 'Event updated successfully'}), 200

# Route to delete an event (DELETE)
@app.route('/events/<string:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        abort(404, description="Event not found")

    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'}), 200

# Route to fetch all event interests (GET)
@app.route('/event_interests', methods=['GET'])
def get_event_interests():
    event_interests = EventInterest.query.all()
    event_interest_list = [{
        'id': event_interest.id,
        'eventid': event_interest.eventid,
        'userid': event_interest.userid,
        'status': event_interest.status,
        'createdat': event_interest.createdat
    } for event_interest in event_interests]
    return jsonify(event_interest_list), 200

# Route to fetch a single event interest by ID (GET)
@app.route('/event_interests/<string:event_interest_id>', methods=['GET'])
def get_event_interest(event_interest_id):
    event_interest = EventInterest.query.get(event_interest_id)
    if not event_interest:
        abort(404, description="Event interest not found")

    event_interest_data = {
        'id': event_interest.id,
        'eventid': event_interest.eventid,
        'userid': event_interest.userid,
        'status': event_interest.status,
        'createdat': event_interest.createdat
    }
    return jsonify(event_interest_data), 200

# Route to create a new event interest (POST)
@app.route('/event_interests', methods=['POST'])
def create_event_interest():
    data = request.get_json()
    if not data or not data.get('eventid') or not data.get('userid'):
        abort(400, description="Invalid event interest data. 'eventid' and 'userid' are required.")

    new_event_interest = EventInterest(
        eventid=data['eventid'],
        userid=data['userid'],
        status=data.get('status', 'pending')
    )
    db.session.add(new_event_interest)
    db.session.commit()
    return jsonify({'message': 'Event interest created successfully', 'event_interest_id': new_event_interest.id}), 201

# Route to update an event interest (PUT)
@app.route('/event_interests/<string:event_interest_id>', methods=['PUT'])
def update_event_interest(event_interest_id):
    event_interest = EventInterest.query.get(event_interest_id)
    if not event_interest:
        abort(404, description="Event interest not found")

    data = request.get_json()
    event_interest.eventid = data.get('eventid', event_interest.eventid)
    event_interest.userid = data.get('userid', event_interest.userid)
    event_interest.status = data.get('status', event_interest.status)

    db.session.commit()
    return jsonify({'message': 'Event interest updated successfully'}), 200

# Route to delete an event interest (DELETE)
@app.route('/event_interests/<string:event_interest_id>', methods=['DELETE'])
def delete_event_interest(event_interest_id):
    event_interest = EventInterest.query.get(event_interest_id)
    if not event_interest:
        abort(404, description="Event interest not found")

    db.session.delete(event_interest)
    db.session.commit()
    return jsonify({'message': 'Event interest deleted successfully'}), 200

# Route to all adoption listings available
@app.route('/adoption_listings', methods=['GET'])
def get_adoption_listings():
    adoption_listings = Adoption.query.all()
    adoption_list = [{
        'id': adoption.id,
        'agentid': adoption.agentid,
        'description': adoption.description,
        'status': adoption.status,
        'createdat': adoption.createdat,
        'updatedat': adoption.updatedat,
        'pet': {  # Include pet details in the response
            'id': adoption.pet.id,
            'name': adoption.pet.name,
            'species': adoption.pet.species,
            'breed': adoption.pet.breed,
            'age': adoption.pet.age,
            'image_url': adoption.pet.image_url
        }
    } for adoption in adoption_listings]
    return jsonify(adoption_list), 200

# Route to fetch a single adoption listing by ID (GET)
@app.route('/adoption_listings/<string:adoption_id>', methods=['GET'])
def get_adoption_listing(adoption_id):
    adoption = Adoption.query.get(adoption_id)
    if not adoption:
        abort(404, description="Adoption listing not found")

    adoption_data = {
        'id': adoption.id,
        'agentid': adoption.agentid,
        'pet': {  # Include pet details in the response
            'id': adoption.pet.id,
            'name': adoption.pet.name,
            'species': adoption.pet.species,
            'breed': adoption.pet.breed,
            'age': adoption.pet.age,
            'image_url': adoption.pet.image_url
        },
        'description': adoption.description,
        'status': adoption.status,
        'createdat': adoption.createdat,
        'updatedat': adoption.updatedat
    }
    return jsonify(adoption_data), 200

# Route to create a new adoption listing (POST)
@app.route('/adoption_listings', methods=['POST'])
def create_adoption_listing():
    data = request.get_json()
    if not data or not data.get('agentid') or not data.get('petid'):
        abort(400, description="Invalid adoption listing data. 'agentid', 'petid' are required.")

    pet_data= data.get('pet')
    if not pet_data or not pet_data.get('name') or not pet_data.get('species') or not pet_data.get('breed') or not pet_data.get('image_url'):
        abort(400, description="Invalid pet data. 'name', 'species', 'breed', 'image' are required.")
    
    #create a new pet
    new_pet= Pets(
        ownerid=data['agentid'],
        name=pet_data['name'],
        species=pet_data['species'],
        breed=pet_data['breed'],
        age=pet_data.get('age', 0),
        imageurl=pet_data['image_url']
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
@app.route('/adoption_listings/<string:adoption_id>', methods=['PUT'])
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
                imageurl=pet_data['image_url']
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
            pet.imageurl = pet_data.get('image_url', pet.imageurl)

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
@app.route('/adoption_listings/<string:adoption_id>', methods=['DELETE'])
def delete_adoption_listing(adoption_id):
    adoption = Adoption.query.get(adoption_id)
    if not adoption:
        abort(404, description="Adoption listing not found")

    db.session.delete(adoption)
    db.session.commit()
    return jsonify({'message': 'Adoption listing deleted successfully'}), 200

# Route to fetch all adoption interests (GET)
@app.route('/adoption_interests', methods=['GET'])
def get_adoption_interests():
    adoption_interests = AdoptionInterest.query.all()
    adoption_interest_list = [{
        'id': adoption_interest.id,
        'userid': adoption_interest.userid,
        'status': adoption_interest.status,
        'createdat': adoption_interest.createdat
    } for adoption_interest in adoption_interests]
    return jsonify(adoption_interest_list), 200

# Route to fetch a single adoption interest by ID (GET)
@app.route('/adoption_interests/<string:adoption_interest_id>', methods=['GET'])
def get_adoption_interest(adoption_interest_id):
    adoption_interest = AdoptionInterest.query.get(adoption_interest_id)
    if not adoption_interest:
        abort(404, description="Adoption interest not found")

    adoption_interest_data = {
        'id': adoption_interest.id,
        'userid': adoption_interest.userid,
        'status': adoption_interest.status,
        'createdat': adoption_interest.createdat
    }
    return jsonify(adoption_interest_data), 200

# Route to create a new adoption interest (POST)
@app.route('/adoption_interests', methods=['POST'])
def create_adoption_interest():
    data = request.get_json()
    if not data or not data.get('userid'):
        abort(400, description="Invalid adoption interest data. 'userid' is required.")

    new_adoption_interest = AdoptionInterest(
        userid=data['userid'],
        status=data.get('status', 'pending')
    )
    db.session.add(new_adoption_interest)
    db.session.commit()
    return jsonify({'message': 'Adoption interest created successfully', 'adoption_interest_id': new_adoption_interest.id}), 201

# Route to update an adoption interest (PUT)
@app.route('/adoption_interests/<string:adoption_interest_id>', methods=['PUT'])
def update_adoption_interest(adoption_interest_id):
    adoption_interest = AdoptionInterest.query.get(adoption_interest_id)
    if not adoption_interest:
        abort(404, description="Adoption interest not found")

    data = request.get_json()
    adoption_interest.userid = data.get('userid', adoption_interest.userid)
    adoption_interest.status = data.get('status', adoption_interest.status)

    db.session.commit()
    return jsonify({'message': 'Adoption interest updated successfully'}), 200

# Route to delete an adoption interest (DELETE)
@app.route('/adoption_interests/<string:adoption_interest_id>', methods=['DELETE'])
def delete_adoption_interest(adoption_interest_id):
    adoption_interest = AdoptionInterest.query.get(adoption_interest_id)
    if not adoption_interest:
        abort(404, description="Adoption interest not found")

    db.session.delete(adoption_interest)
    db.session.commit()
    return jsonify({'message': 'Adoption interest deleted successfully'}), 200

# Route to fetch all sitting requests (GET)
@app.route('/sitting_requests', methods=['GET'])
def get_sitting_requests():
    sitting_requests = SittingRequests.query.all()

    #keeping the pet details seperate from the all sitting request details, 
    #only specific sitting request details will be able to see pet list 
    sitting_request_list = [{
        'id': sitting_request.id,
        'userid': sitting_request.userid,
        'pay': sitting_request.pay,
        'startdate': sitting_request.startdate.strftime('%Y-%m-%d') if sitting_request.startdate else None,
        'enddate': sitting_request.enddate.strftime('%Y-%m-%d') if sitting_request.enddate else None,
        'description': sitting_request.description,
        'status': sitting_request.status,
        'createdat': sitting_request.createdat,
        'tasktype': sitting_request.tasktype
    } for sitting_request in sitting_requests]
    return jsonify(sitting_request_list), 200

# Route to fetch a single sitting request by ID (GET)
@app.route('/sitting_requests/<string:sitting_request_id>', methods=['GET'])
def get_sitting_request_with_pet(sitting_request_id):
    sitting_request = SittingRequests.query.get(sitting_request_id)
    if not sitting_request:
        abort(404, description="Sitting request not found")

    # Fetch all associated pets through the one-to-many relationship from pet_sitting_requests
    # Access pets directly because the relationship is defined in the PetSittingRequests model
    pet_info = [{
        'id': pet_sitting.pet.id,
        'name': pet_sitting.pet.name,
        'species': pet_sitting.pet.species,
        'breed': pet_sitting.pet.breed,
        'age': pet_sitting.pet.age,
        'image_url': pet_sitting.pet.image_url
    } for pet_sitting in sitting_request.pet_sitting_requests]


    sitting_request_data = {
        'id': sitting_request.id,
        'userid': sitting_request.userid,
        'pay': sitting_request.pay,
        'startdate': sitting_request.startdate.strftime('%Y-%m-%d') if sitting_request.startdate else None,
        'enddate': sitting_request.enddate.strftime('%Y-%m-%d') if sitting_request.enddate else None,
        'description': sitting_request.description,
        'status': sitting_request.status,
        'createdat': sitting_request.createdat,
        'tasktype': sitting_request.tasktype
    }
    return jsonify(
        {'sitting_request': sitting_request_data, 'pets': pet_info}
    ), 200

# Route to create a new sitting request (POST)
@app.route('/sitting_requests', methods=['POST'])
def create_sitting_request():

    data= request.get_json()
    if not data or not data.get('userid'):
        abort(400, description="Invalid sitting request data. 'userid' is required.")
    
    # Check if the list of pet data is present in the request
    pet_data = data.get('pets')
    if not pet_data or not isinstance(pet_data, list):
        abort(400, description="Invalid pet data. 'pets' (list) is required.")

    # Create a new sitting request
    new_sitting_request = SittingRequests(
        userid=data['userid'],
        pay=data['pay'],
        startdate=datetime.strptime(data['startdate'], '%Y-%m-%d').date(),
        enddate=datetime.strptime(data['enddate'], '%Y-%m-%d').date(),
        description=data['description'],
        status=data.get('status', 'pending'),
        tasktype=data.get('tasktype')
    )

    db.session.add(new_sitting_request)
    db.session.flush()  # Flush the session to get the sitting request ID

    # Create a new pet for each pet data in the list
    new_pet_sitting_request_ids=[]
    for pet in pet_data:
            if not pet.get('name') or not pet.get('species'):
                abort(400, description="Invalid pet data. 'name' and 'species' are required for each pet.")
    for pet in pet_data:
        new_pet = Pets(
            ownerid=data['userid'],
            name=pet['name'],
            species=pet['species'],
            breed=pet['breed'],
            age=pet.get('age', 0),
            imageurl=pet['image_url']
        )
        db.session.add(new_pet)
        db.session.flush()  # Flush the session to get the pet ID

        #also need to add the pet to the pet_sitting_requests table
        new_pet_sitting_request = PetSittingRequests(
            sittingrequestid=new_sitting_request.id,
            petid=new_pet.id
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

#TODO: update the create sitting request to update and handle the pet data as well
# Route to update a sitting request (PUT)
@app.route('/sitting_requests/<string:sitting_request_id>', methods=['PUT'])
def update_sitting_request(sitting_request_id):
    sitting_request = SittingRequests.query.get(sitting_request_id)
    if not sitting_request:
        abort(404, description="Sitting request not found")

    data = request.get_json()
    sitting_request.userid = data.get('userid', sitting_request.userid)
    sitting_request.pay = data.get('pay', sitting_request.pay)
    sitting_request.startdate = datetime.strptime(data['startdate'], '%Y-%m-%d').date()
    sitting_request.enddate = datetime.strptime(data['enddate'], '%Y-%m-%d').date()
    sitting_request.description = data.get('description', sitting_request.description)
    sitting_request.status = data.get('status', sitting_request.status)
    sitting_request.tasktype = data.get('tasktype', sitting_request.tasktype)

    db.session.commit()
    return jsonify({'message': 'Sitting request updated successfully'}), 200

# Route to delete a sitting request (DELETE)
#TODO: When deleting a sitting request, also delete the associated pet_sitting_requests
@app.route('/sitting_requests/<string:sitting_request_id>', methods=['DELETE'])
def delete_sitting_request(sitting_request_id):
    sitting_request = SittingRequests.query.get(sitting_request_id)
    if not sitting_request:
        abort(404, description="Sitting request not found")

    db.session.delete(sitting_request)
    db.session.commit()
    return jsonify({'message': 'Sitting request deleted successfully'}), 200

# Route to fetch all sitter interests (GET)
@app.route('/sitter_interests', methods=['GET'])
def get_sitter_interests():
    sitter_interests = SitterInterests.query.all()
    sitter_interest_list = [{
        'id': sitter_interest.id,
        'userid': sitter_interest.userid,
        'sittingrequestid': sitter_interest.sittingrequestid,
        'status': sitter_interest.status,
        'createdat': sitter_interest.createdat
    } for sitter_interest in sitter_interests]
    return jsonify(sitter_interest_list), 200

# Route to fetch a single sitter interest by ID (GET)
@app.route('/sitter_interests/<string:sitter_interest_id>', methods=['GET'])
def get_sitter_interest(sitter_interest_id):
    sitter_interest = SitterInterests.query.get(sitter_interest_id)
    if not sitter_interest:
        abort(404, description="Sitter interest not found")

    sitter_interest_data = {
        'id': sitter_interest.id,
        'userid': sitter_interest.userid,
        'sittingrequestid': sitter_interest.sittingrequestid,
        'status': sitter_interest.status,
        'createdat': sitter_interest.createdat
    }
    return jsonify(sitter_interest_data), 200

# Route to create a new sitter interest (POST)
@app.route('/sitter_interests', methods=['POST'])
def create_sitter_interest():
    data = request.get_json()
    if not data or not data.get('userid') or not data.get('sittingrequestid'):
        abort(400, description="Invalid sitter interest data. 'userid' and 'sittingrequestid' are required.")

    new_sitter_interest = SitterInterests(
        userid=data['userid'],
        sittingrequestid=data['sittingrequestid'],
        status=data.get('status', 'pending')
    )
    db.session.add(new_sitter_interest)
    db.session.commit()
    return jsonify({'message': 'Sitter interest created successfully', 'sitter_interest_id': new_sitter_interest.id}),

# Route to update a sitter interest (PUT)
@app.route('/sitter_interests/<string:sitter_interest_id>', methods=['PUT'])
def update_sitter_interest(sitter_interest_id):
    sitter_interest = SitterInterests.query.get(sitter_interest_id)
    if not sitter_interest:
        abort(404, description="Sitter interest not found")

    data = request.get_json()
    sitter_interest.userid = data.get('userid', sitter_interest.userid)
    sitter_interest.sittingrequestid = data.get('sittingrequestid', sitter_interest.sittingrequestid)
    sitter_interest.status = data.get('status', sitter_interest.status)

    db.session.commit()
    return jsonify({'message': 'Sitter interest updated successfully'}), 200

# Route to delete a sitter interest (DELETE)
@app.route('/sitter_interests/<string:sitter_interest_id>', methods=['DELETE'])
def delete_sitter_interest(sitter_interest_id):
    sitter_interest = SitterInterests.query.get(sitter_interest_id)
    if not sitter_interest:
        abort(404, description="Sitter interest not found")

    db.session.delete(sitter_interest)
    db.session.commit()
    return jsonify({'message': 'Sitter interest deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)