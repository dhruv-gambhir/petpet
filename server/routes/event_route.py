from flask import Blueprint, jsonify, request, abort
from models.event_model import Event
from models.event_interest_model import EventInterest
from models.users_model import Users
from datetime import datetime
from db import db

# Route to fetch all event listings (GET)
event_bp = Blueprint('event_bp', __name__)


@event_bp.route('', methods=['GET'])
def get_events():
    #for now without jwt auth just use user id in the url
    userid = request.args.get('userid')  # Fetch userid from query parameters
    
    events = Event.query.all()
    event_list = [{
        'id': event.id,
        'createdby': event.createdby,
        'name': Users.query.get(event.createdby).name,
        'event_name': event.event_name,
        'description': event.description,
        'location': event.location,
        'startdate': event.startdate.strftime('%Y-%m-%d %H:%M:%S') if event.startdate else None,
        'cost': event.cost,
        'status': event.status,
        'imageurl': event.imageurl,
        'createdat': event.createdat,
        'interested': userid is not None and bool(EventInterest.query.filter_by(userid=userid, eventid=event.id).first())
    } for event in events]
    return jsonify(event_list), 200

# Route to fetch a single event by ID (GET)
@event_bp.route('/<string:event_id>', methods=['GET'])
def get_event(event_id):

    #for now without jwt auth just use user id in the url
    userid = request.args.get('userid')  # Fetch userid from query parameters
    if not userid:
        abort(400, description="Invalid request. 'userid' is required.")
    
    event = Event.query.get(event_id)
    if not event:
        abort(404, description="Event not found")

    event_data = {
        'id': event.id,
        'createdby': event.createdby,
        'name': Users.query.get(event.createdby).name,
        'event_name': event.event_name,
        'description': event.description,
        'location': event.location,
        'startdate': event.startdate.strftime('%Y-%m-%d %H:%M:%S') if event.startdate else None,
        'cost': event.cost,
        'status': event.status,
        'imageurl': event.imageurl,
        'createdat': event.createdat,
        'interested': bool(EventInterest.query.filter_by(userid=userid, eventid=event.id).first())
    }
    return jsonify(event_data), 200

# Route to create a new event (POST)
@event_bp.route('', methods=['POST'])
def create_event():
    data = request.get_json()
    if not data or not data.get('event_name') or not data.get('createdby'):
        abort(400, description="Invalid event data. 'event_name' and 'createdby' are required.")
    
    # Use datetime.datetime to parse both date and time
    try:
        startdate = datetime.strptime(data.get('startdate'), '%Y-%m-%dT%H:%M') if data.get('startdate') else None
    except ValueError:
        abort(400, description="Invalid date format for 'startdate'. Expected format: YYYY-MM-DD HH:MM:SS")

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
@event_bp.route('/<string:event_id>', methods=['PUT'])
def update_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        abort(404, description="Event not found")

    data = request.get_json()

    try:
        if 'startdate' in data:
            startdate = datetime.strptime(data.get('startdate'), '%Y-%m-%d %H:%M:%S') if data.get('startdate') else None
            event.startdate = startdate
    except ValueError:
        abort(400, description="Invalid date format for 'startdate'. Expected format: YYYY-MM-DD HH:MM:SS")

    event.event_name = data.get('event_name', event.event_name)
    event.description = data.get('description', event.description)
    event.location = data.get('location', event.location)
    event.cost = data.get('cost', event.cost)
    event.imageurl = data.get('imageurl', event.imageurl)
    event.status = data.get('status', event.status)

    db.session.commit()
    return jsonify({'message': 'Event updated successfully'}), 200

# Route to delete an event (DELETE)
@event_bp.route('/<string:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        abort(404, description="Event not found")

    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'}), 200



#Route to get all events based on user id
@event_bp.route('/user/<string:user_id>', methods=['GET'])
def get_events_by_user(user_id):
    event_list = [{
        'id': event.id,
        'createdby': event.createdby,
        'name': Users.query.get(event.createdby).name,
        'event_name': event.event_name,
        'description': event.description,
        'location': event.location,
        'startdate': event.startdate.strftime('%Y-%m-%d %H:%M:%S') if event.startdate else None,
        'cost': event.cost,
        'status': event.status,
        'imageurl': event.imageurl,
        'createdat': event.createdat,
        'interested': bool(EventInterest.query.filter_by(userid=user_id, eventid=event.id).first())
    } for event in Event.query.filter_by(createdby=user_id)]
    return jsonify(event_list), 200

#Route to get all events based on user id
@event_bp.route('/user_interest/<string:user_id>', methods=['GET'])
def get_events_by_user_interest(user_id):
    interests = EventInterest.query.filter_by(userid=user_id)
    events = [Event.query.get(interest.eventid) for interest in interests]
    event_list = [{
        'id': event.id,
        'createdby': event.createdby,
        'name': Users.query.get(event.createdby).name,
        'event_name': event.event_name,
        'description': event.description,
        'location': event.location,
        'startdate': event.startdate.strftime('%Y-%m-%d %H:%M:%S') if event.startdate else None,
        'cost': event.cost,
        'status': event.status,
        'imageurl': event.imageurl,
        'createdat': event.createdat,
        'interested': True
    } for event in events]
    return jsonify(event_list), 200