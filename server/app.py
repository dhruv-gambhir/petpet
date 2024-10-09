from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
import uuid
from datetime import datetime
from flask_swagger_ui import get_swaggerui_blueprint

app = Flask(__name__)

# PostgreSQL database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost/mydb'
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
    imageurl = db.Column(db.Text)  
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
    location = db.Column(db.String(255))
    tasktype= db.Column(db.Enum('day_boarding', 'doggy_day_care', 'dog_walking', 'home_visits', 'house_sitting', name='task_enum'))  # Type of the task

    #add relationship to user table and sitter interest table and pet sitting request table
    sitter_interest= db.relationship('SitterInterests', backref='sitting_requests_made')
    pet_sitting_requests = db.relationship('PetSittingRequests', backref='sitting_requests_of_pets', cascade="all, delete", lazy=True)

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
        'imageurl': event.imageurl,
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
        'imageurl': event.imageurl,
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
        imageurl=data.get('imageurl'),
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
    event.imageurl = data.get('imageurl', event.imageurl)
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
        'location': sitting_request.location,
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
        'location': sitting_request.location,
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
        location=data.get('location'),
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

# Route to update a sitting request (PUT)
@app.route('/sitting_requests/<string:sitting_request_id>', methods=['PUT'])
def update_sitting_request(sitting_request_id):
    sitting_request = SittingRequests.query.get(sitting_request_id)
    if not sitting_request:
        abort(404, description="Sitting request not found")

    data = request.get_json()

    # Update sitting request fields
    sitting_request.userid = data.get('userid', sitting_request.userid)
    sitting_request.pay = data.get('pay', sitting_request.pay)
    sitting_request.startdate = datetime.strptime(data['startdate'], '%Y-%m-%d').date()
    sitting_request.enddate = datetime.strptime(data['enddate'], '%Y-%m-%d').date()
    sitting_request.description = data.get('description', sitting_request.description)
    sitting_request.status = data.get('status', sitting_request.status)
    sitting_request.tasktype = data.get('tasktype', sitting_request.tasktype)
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
                    existing_pet.imageurl = pet.get('image_url', existing_pet.imageurl)
            else:
                # If pet data is new, create a new pet and add to the sitting request
                new_pet = Pets(
                    ownerid=sitting_request.userid,
                    name=pet['name'],
                    species=pet['species'],
                    breed=pet.get('breed'),
                    age=pet.get('age', 0),
                    imageurl=pet.get('image_url')
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

#Route to get all events based on user id
@app.route('/events/user/<string:user_id>', methods=['GET'])
def get_events_by_user(user_id):
    events = Event.query.filter_by(createdby=user_id).all()
    if not events:
        abort(404, description="No events found for this user")
    event_list = [{
        'id': event.id,
        'createdby': event.createdby,
        'event_name': event.event_name,
        'description': event.description,
        'location': event.location,
        'startdate': event.startdate.strftime('%Y-%m-%d') if event.startdate else None,
        'cost': event.cost,
        'status': event.status,
        'imageurl': event.imageurl,
        'createdat': event.createdat
    } for event in events]
    return jsonify(event_list), 200

#Route to get user info
@app.route('/users/<string:user_id>', methods=['GET'])
def get_user(user_id):
    user = Users.query.get(user_id)
    if not user:
        abort(404, description="User not found")

    user_data = {
        'userid': user.userid,
        'name': user.name,
        'email': user.email,
        'phonenumber': user.phonenumber,
        'createdat': user.createdat,
        'updatedat': user.updatedat,
        'bio': user.bio,
        'imageurl': user.imageurl,
        'isagency': user.isagency,
        'address': user.address,
        'licensenumber': user.licensenumber
    }
    return jsonify(user_data), 200

#Route to get user info from email
@app.route('/users/email/<string:email>', methods=['GET'])
def get_user_by_email(email):
    user = Users.query.filter_by(email=email).first()
    if not user:
        abort(404, description="User not found")

    user_data = {
        'userid': user.userid,
        'name': user.name,
        'email': user.email,
        'phonenumber': user.phonenumber,
        'createdat': user.createdat,
        'updatedat': user.updatedat,
        'bio': user.bio,
        'imageurl': user.imageurl,
        'isagency': user.isagency,
        'address': user.address,
        'licensenumber': user.licensenumber
    }
    return jsonify(user_data), 200

#Route to post new user 
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email'):
        abort(400, description="Invalid user data. 'name' and 'email' are required.")
    
    if Users.query.filter_by(email=data['email']).first():
        abort(400, description="User with this email already exists.")
    
    new_user = Users(
        name=data['name'],
        email=data['email'],
        phonenumber=data.get('phonenumber'),
        bio=data.get('bio'),
        imageurl=data.get('imageurl'),
        isagency=data.get('isagency', False),
        address=data.get('address'),
        licensenumber=data.get('licensenumber')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully', 'user_id': new_user.userid}), 201

#Route to update user info
@app.route('/users/<string:user_id>', methods=['PUT'])
def update_user(user_id):
    user = Users.query.get(user_id)
    if not user:
        abort(404, description="User not found")

    data = request.get_json()
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.phonenumber = data.get('phonenumber', user.phonenumber)
    user.bio = data.get('bio', user.bio)
    user.imageurl = data.get('imageurl', user.imageurl)
    user.isagency = data.get('isagency', user.isagency)
    user.address = data.get('address', user.address)
    user.licensenumber = data.get('licensenumber', user.licensenumber)

    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

#Route to update a user by email
@app.route('/users/email/<string:email>', methods=['PUT'])
def update_user_by_email(email):
    user = Users.query.filter_by(email=email).first()
    if not user:
        abort(404, description="User not found")

    data = request.get_json()
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.phonenumber = data.get('phonenumber', user.phonenumber)
    user.bio = data.get('bio', user.bio)
    user.imageurl = data.get('imageurl', user.imageurl)
    user.isagency = data.get('isagency', user.isagency)
    user.address = data.get('address', user.address)
    user.licensenumber = data.get('licensenumber', user.licensenumber)

    db.session.commit()
    return jsonify({'message': 'User updated successfully by email'}), 200

#can obtain the docs by going to {local_host_ip}/docs
@app.route("/swagger.json")
def swagger_json():
    swagger_spec = {
        "swagger": "2.0",
        "info": {
            "title": "Pet Sitting & Adoption API",
            "description": "API for managing pet adoption, sitting requests, and events.",
            "version": "1.0.0"
        },
        "host": "127.0.0.1:5001",
        "basePath": "/",
        "schemes": ["http"],
        "paths": {
            # Users
            "/users": {
                "post": {
                    "summary": "Create a new user",
                    "description": "Create a new user in the database.",
                    "parameters": [
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "email": {"type": "string"},
                                    "phonenumber": {"type": "string"},
                                    "bio": {"type": "string"},
                                    "imageurl": {"type": "string"},
                                    "isagency": {"type": "boolean"},
                                    "address": {"type": "string"},
                                    "licensenumber": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "User created successfully"
                        },
                        "400": {
                            "description": "Invalid user data"
                        }
                    }
                }
            },
            "/users/{user_id}": {
                "get": {
                    "summary": "Fetch a specific user",
                    "description": "Retrieve a user by ID.",
                    "parameters": [
                        {
                            "name": "user_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "User ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "User details",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {"type": "string"},
                                    "name": {"type": "string"},
                                    "email": {"type": "string"},
                                    "phonenumber": {"type": "string"},
                                    "createdat": {"type": "string"},
                                    "updatedat": {"type": "string"},
                                    "bio": {"type": "string"},
                                    "imageurl": {"type": "string"},
                                    "isagency": {"type": "boolean"},
                                    "address": {"type": "string"},
                                    "licensenumber": {"type": "string"}
                                }
                            }
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                },
                "put": {
                    "summary": "Update a specific user",
                    "description": "Update a user by ID.",
                    "parameters": [
                        {
                            "name": "user_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "User ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "email": {"type": "string"},
                                    "phonenumber": {"type": "string"},
                                    "bio": {"type": "string"},
                                    "imageurl": {"type": "string"},
                                    "isagency": {"type": "boolean"},
                                    "address": {"type": "string"},
                                    "licensenumber": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "User updated successfully"
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                }
            },
            # Users by Email
            "/users/email/{email}": {
                "get": {
                    "summary": "Fetch a specific user by email",
                    "description": "Retrieve a user by email.",
                    "parameters": [
                        {
                            "name": "email",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "User Email"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "User details",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {"type": "string"},
                                    "name": {"type": "string"},
                                    "email": {"type": "string"},
                                    "phonenumber": {"type": "string"},
                                    "createdat": {"type": "string"},
                                    "updatedat": {"type": "string"},
                                    "bio": {"type": "string"},
                                    "imageurl": {"type": "string"},
                                    "isagency": {"type": "boolean"},
                                    "address": {"type": "string"},
                                    "licensenumber": {"type": "string"}
                                }
                            }
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                },
                "put": {
                    "summary": "Update a specific user by email",
                    "description": "Update a user by email.",
                    "parameters": [
                        {
                            "name": "email",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "User Email"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "email": {"type": "string"},
                                    "phonenumber": {"type": "string"},
                                    "bio": {"type": "string"},
                                    "imageurl": {"type": "string"},
                                    "isagency": {"type": "boolean"},
                                    "address": {"type": "string"},
                                    "licensenumber": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "User updated successfully"
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                }
            },
            # Events
            "/events": {
                "get": {
                    "summary": "Fetch all events",
                    "description": "Retrieve all events from the database.",
                    "produces": ["application/json"],
                    "responses": {
                        "200": {
                            "description": "A list of events",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "createdby": {"type": "string"},
                                        "event_name": {"type": "string"},
                                        "description": {"type": "string"},
                                        "location": {"type": "string"},
                                        "startdate": {"type": "string"},
                                        "cost": {"type": "integer"},
                                        "status": {"type": "string"},
                                        "imageurl": {"type": "string"},
                                        "createdat": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/events/{event_id}": {
                "get": {
                    "summary": "Fetch a specific event",
                    "description": "Retrieve an event by ID.",
                    "parameters": [
                        {
                            "name": "event_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Event ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Event details",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "string"},
                                    "createdby": {"type": "string"},
                                    "event_name": {"type": "string"},
                                    "description": {"type": "string"},
                                    "location": {"type": "string"},
                                    "startdate": {"type": "string"},
                                    "cost": {"type": "integer"},
                                    "status": {"type": "string"},
                                    "imageurl": {"type": "string"},
                                    "createdat": {"type": "string"}
                                }
                            }
                        },
                        "404": {
                            "description": "Event not found"
                        }
                    }
                },
                "post": {
                    "summary": "Create a new event under a specific ID",
                    "description": "Create a new event in the database.",
                    "parameters": [
                        {
                            "name": "event_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Event ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "createdby": {"type": "string"},
                                    "event_name": {"type": "string"},
                                    "description": {"type": "string"},
                                    "location": {"type": "string"},
                                    "startdate": {"type": "string"},
                                    "cost": {"type": "integer"},
                                    "status": {"type": "string"},
                                    "imageurl": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "Event created successfully"
                        },
                        "400": {
                            "description": "Invalid event data"
                        }
                    }
                },
                "put": {
                    "summary": "Update a specific event",
                    "description": "Update an event by ID.",
                    "parameters": [
                        {
                            "name": "event_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Event ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "event_name": {"type": "string"},
                                    "description": {"type": "string"},
                                    "location": {"type": "string"},
                                    "startdate": {"type": "string"},
                                    "cost": {"type": "integer"},
                                    "status": {"type": "string"},
                                    "imageurl": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Event updated successfully"
                        },
                        "404": {
                            "description": "Event not found"
                        }
                    }
                },
                "delete": {
                    "summary": "Delete a specific event",
                    "description": "Delete an event by ID.",
                    "parameters": [
                        {
                            "name": "event_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Event ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Event deleted successfully"
                        },
                        "404": {
                            "description": "Event not found"
                        }
                    }
                }
            },
            # Events by User
            "/events/user/{user_id}": {
                "get": {
                    "summary": "Fetch all events by a specific user",
                    "description": "Retrieve all events from the database by the user_id.",
                    "parameters": [
                        {
                            "name": "user_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "User ID"
                        }
                    ],
                    "produces": ["application/json"],
                    "responses": {
                        "200": {
                            "description": "A list of events by the user",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "createdby": {"type": "string"},
                                        "event_name": {"type": "string"},
                                        "description": {"type": "string"},
                                        "location": {"type": "string"},
                                        "startdate": {"type": "string"},
                                        "cost": {"type": "integer"},
                                        "status": {"type": "string"},
                                        "imageurl": {"type": "string"},
                                        "createdat": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            },

            # Event Interests
            "/event_interests": {
                "get": {
                    "summary": "Fetch all event interests",
                    "description": "Retrieve all event interests from the database.",
                    "produces": ["application/json"],
                    "responses": {
                        "200": {
                            "description": "A list of event interests",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "eventid": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/event_interests/{event_interest_id}": {
                "get": {
                    "summary": "Fetch a specific event interest",
                    "description": "Retrieve an event interest by ID.",
                    "parameters": [
                        {
                            "name": "event_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Event interest ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Event interest details",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "string"},
                                    "eventid": {"type": "string"},
                                    "userid": {"type": "string"},
                                    "status": {"type": "string"},
                                    "createdat": {"type": "string"}
                                }
                            }
                        },
                        "404": {
                            "description": "Event interest not found"
                        }
                    }
                },
                "post": {
                    "summary": "Create a new event interest under a specific ID",
                    "description": "Create a new event interest in the database.",
                    "parameters": [
                        {
                            "name": "event_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Event interest ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "eventid": {"type": "string"},
                                    "userid": {"type": "string"},
                                    "status": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "Event interest created successfully"
                        },
                        "400": {
                            "description": "Invalid event interest data"
                        }
                    }
                },
                "put": {
                    "summary": "Update a specific event interest",
                    "description": "Update an event interest by ID.",
                    "parameters": [
                        {
                            "name": "event_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Event interest ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "eventid": {"type": "string"},
                                    "userid": {"type": "string"},
                                    "status": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Event interest updated successfully"
                        },
                        "404": {
                            "description": "Event interest not found"
                        }
                    }
                },
                "delete": {
                    "summary": "Delete a specific event interest",
                    "description": "Delete an event interest by ID.",
                    "parameters": [
                        {
                            "name": "event_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Event interest ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Event interest deleted successfully"
                        },
                        "404": {
                            "description": "Event interest not found"
                        }
                    }
                }
            },
            # Adoption Listings
            "/adoption_listings": {
                "get": {
                    "summary": "Fetch all adoption listings",
                    "description": "Retrieve all adoption listings from the database.",
                    "produces": ["application/json"],
                    "responses": {
                        "200": {
                            "description": "A list of adoption listings",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "agentid": {"type": "string"},
                                        "petid": {"type": "string"},
                                        "description": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"},
                                        "updatedat": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            },
            # Adoption Listings
            "/adoption_listings/{adoption_id}": {
                "get": {
                    "summary": "Fetch a specific adoption listing",
                    "description": "Retrieve an adoption listing by ID.",
                    "parameters": [
                        {
                            "name": "adoption_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Adoption listing ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Adoption listing details",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "string"},
                                    "agentid": {"type": "string"},
                                    "petid": {"type": "string"},
                                    "description": {"type": "string"},
                                    "status": {"type": "string"},
                                    "createdat": {"type": "string"},
                                    "updatedat": {"type": "string"}
                                }
                            }
                        },
                        "404": {
                            "description": "Adoption listing not found"
                        }
                    }
                },
                "post": {
                    "summary": "Create a new adoption listing under a specific ID",
                    "description": "Create a new adoption listing in the database.",
                    "parameters": [
                        {
                            "name": "adoption_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Adoption listing ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "agentid": {"type": "string"},
                                    "petid": {"type": "string"},
                                    "description": {"type": "string"},
                                    "status": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "Adoption listing created successfully"
                        },
                        "400": {
                            "description": "Invalid adoption listing data"
                        }
                    }
                },
                "put": {
                    "summary": "Update a specific adoption listing",
                    "description": "Update an adoption listing by ID.",
                    "parameters": [
                        {
                            "name": "adoption_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Adoption listing ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "agentid": {"type": "string"},
                                    "petid": {"type": "string"},
                                    "description": {"type": "string"},
                                    "status": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Adoption listing updated successfully"
                        },
                        "404": {
                            "description": "Adoption listing not found"
                        }
                    }
                },
                "delete": {
                    "summary": "Delete a specific adoption listing",
                    "description": "Delete an adoption listing by ID.",
                    "parameters": [
                        {
                            "name": "adoption_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Adoption listing ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Adoption listing deleted successfully"
                        },
                        "404": {
                            "description": "Adoption listing not found"
                        }
                    }
                }
            },
            # Sitting Requests and Interests are similarly structured, adjust accordingly for specific IDs
            "/adoption_interests": {
                "get": {
                    "summary": "Fetch all adoption interests",
                    "description": "Retrieve all adoption interests from the database.",
                    "produces": ["application/json"],
                    "responses": {
                        "200": {
                            "description": "A list of adoption interests",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/adoption_interests/{adoption_interest_id}": {
                "get": {
                    "summary": "Fetch a specific adoption interest",
                    "description": "Retrieve an adoption interest by ID.",
                    "parameters": [
                        {
                            "name": "adoption_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Adoption interest ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Adoption interest details",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "string"},
                                    "userid": {"type": "string"},
                                    "status": {"type": "string"},
                                    "createdat": {"type": "string"}
                                }
                            }
                        },
                        "404": {
                            "description": "Adoption interest not found"
                        }
                    }
                },
                "post": {
                    "summary": "Create a new adoption interest under a specific ID",
                    "description": "Create a new adoption interest in the database.",
                    "parameters": [
                        {
                            "name": "adoption_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Adoption interest ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {"type": "string"},
                                    "status": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "Adoption interest created successfully"
                        },
                        "400": {
                            "description": "Invalid adoption interest data"
                        }
                    }
                },
                "put": {
                    "summary": "Update a specific adoption interest",
                    "description": "Update an adoption interest by ID.",
                    "parameters": [
                        {
                            "name": "adoption_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Adoption interest ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {"type": "string"},
                                    "status": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Adoption interest updated successfully"
                        },
                        "404": {
                            "description": "Adoption interest not found"
                        }
                    }
                },
                "delete": {
                    "summary": "Delete a specific adoption interest",
                    "description": "Delete an adoption interest by ID.",
                    "parameters": [
                        {
                            "name": "adoption_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Adoption interest ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Adoption interest deleted successfully"
                        },
                        "404": {
                            "description": "Adoption interest not found"
                        }
                    }
                }
            },
            # Sitting Requests
            "/sitting_requests": {
                "get": {
                    "summary": "Fetch all sitting requests",
                    "description": "Retrieve all sitting requests from the database.",
                    "produces": ["application/json"],
                    "responses": {
                        "200": {
                            "description": "A list of sitting requests",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "pay": {"type": "integer"},
                                        "startdate": {"type": "string"},
                                        "enddate": {"type": "string"},
                                        "description": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"},
                                        "location": {"type": "string"},
                                        "tasktype": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/sitting_requests/{sitting_request_id}": {
                "get": {
                    "summary": "Fetch a specific sitting request",
                    "description": "Retrieve a sitting request by ID.",
                    "parameters": [
                        {
                            "name": "sitting_request_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Sitting request ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Sitting request details",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "string"},
                                    "userid": {"type": "string"},
                                    "pay": {"type": "integer"},
                                    "startdate": {"type": "string"},
                                    "enddate": {"type": "string"},
                                    "description": {"type": "string"},
                                    "status": {"type": "string"},
                                    "createdat": {"type": "string"},
                                    "location": {"type": "string"},
                                    "tasktype": {"type": "string"}
                                }
                            }
                        },
                        "404": {
                            "description": "Sitting request not found"
                        }
                    }
                },
                "post": {
                    "summary": "Create a new sitting request under a specific ID",
                    "description": "Create a new sitting request in the database.",
                    "parameters": [
                        {
                            "name": "sitting_request_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Sitting request ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {"type": "string"},
                                    "pay": {"type": "integer"},
                                    "startdate": {"type": "string"},
                                    "enddate": {"type": "string"},
                                    "description": {"type": "string"},
                                    "status": {"type": "string"},
                                    "location": {"type": "string"},
                                    "tasktype": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "Sitting request created successfully"
                        },
                        "400": {
                            "description": "Invalid sitting request data"
                        }
                    }
                },
                "put": {
                    "summary": "Update a specific sitting request",
                    "description": "Update a sitting request by ID.",
                    "parameters": [
                        {
                            "name": "sitting_request_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Sitting request ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {"type": "string"},
                                    "pay": {"type": "integer"},
                                    "startdate": {"type": "string"},
                                    "enddate": {"type": "string"},
                                    "description": {"type": "string"},
                                    "status": {"type": "string"},
                                    "location": {"type": "string"},
                                    "tasktype": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Sitting request updated successfully"
                        },
                        "404": {
                            "description": "Sitting request not found"
                        }
                    }
                },
                "delete": {
                    "summary": "Delete a specific sitting request",
                    "description": "Delete a sitting request by ID.",
                    "parameters": [
                        {
                            "name": "sitting_request_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Sitting request ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Sitting request deleted successfully"
                        },
                        "404": {
                            "description": "Sitting request not found"
                        }
                    }
                }
            },
            # Sitting Interests
            "/sitter_interests": {
                "get": {
                    "summary": "Fetch all sitter interests",
                    "description": "Retrieve all sitter interests from the database.",
                    "produces": ["application/json"],
                    "responses": {
                        "200": {
                            "description": "A list of sitter interests",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "sittingrequestid": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/sitter_interests/{sitter_interest_id}": {
                "get": {
                    "summary": "Fetch a specific sitter interest",
                    "description": "Retrieve a sitter interest by ID.",
                    "parameters": [
                        {
                            "name": "sitter_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Sitter interest ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Sitter interest details",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "string"},
                                    "userid": {"type": "string"},
                                    "sittingrequestid": {"type": "string"},
                                    "status": {"type": "string"},
                                    "createdat": {"type": "string"}
                                }
                            }
                        },
                        "404": {
                            "description": "Sitter interest not found"
                        }
                    }
                },
                "post": {
                    "summary": "Create a new sitter interest under a specific ID",
                    "description": "Create a new sitter interest in the database.",
                    "parameters": [
                        {
                            "name": "sitter_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Sitter interest ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {"type": "string"},
                                    "sittingrequestid": {"type": "string"},
                                    "status": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "Sitter interest created successfully"
                        },
                        "400": {
                            "description": "Invalid sitter interest data"
                        }
                    }
                },
                "put": {
                    "summary": "Update a specific sitter interest",
                    "description": "Update a sitter interest by ID.",
                    "parameters": [
                        {
                            "name": "sitter_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Sitter interest ID"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "required": True,
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {"type": "string"},
                                    "sittingrequestid": {"type": "string"},
                                    "status": {"type": "string"}
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Sitter interest updated successfully"
                        },
                        "404": {
                            "description": "Sitter interest not found"
                        }
                    }
                },
                "delete": {
                    "summary": "Delete a specific sitter interest",
                    "description": "Delete a sitter interest by ID.",
                    "parameters": [
                        {
                            "name": "sitter_interest_id",
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": "Sitter interest ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Sitter interest deleted successfully"
                        },
                        "404": {
                            "description": "Sitter interest not found"
                        }
                    }
                }
            }
        }
    }
    return jsonify(swagger_spec)



# Swagger UI setup
SWAGGER_URL = '/docs'  # URL for exposing Swagger UI
API_URL = '/swagger.json'  # URL for Swagger JSON specification
swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={'app_name': "Pet Sitting & Adoption API"})
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)


if __name__ == '__main__':
    app.run(debug=True)
