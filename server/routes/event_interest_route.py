from flask import Blueprint, jsonify, request, abort
from models.event_model import Event
from models.event_interest_model import EventInterest
from datetime import datetime
from db import db

event_interest_bp = Blueprint('event_interest_bp', __name__)

# Route to fetch all event interests (GET)
@event_interest_bp.route('/', methods=['GET'])
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
@event_interest_bp.route('/<string:event_interest_id>', methods=['GET'])
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
@event_interest_bp.route('/', methods=['POST'])
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
@event_interest_bp.route('/<string:event_interest_id>', methods=['PUT'])
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
@event_interest_bp.route('/<string:event_interest_id>', methods=['DELETE'])
def delete_event_interest(event_interest_id):
    event_interest = EventInterest.query.get(event_interest_id)
    if not event_interest:
        abort(404, description="Event interest not found")

    db.session.delete(event_interest)
    db.session.commit()
    return jsonify({'message': 'Event interest deleted successfully'}), 200
