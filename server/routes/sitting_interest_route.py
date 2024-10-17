from flask import Blueprint, jsonify, request, abort
from models.sitting_request_model import SittingRequests
from models.sitter_interest_model import SitterInterests
from models.pets_model import Pets
from datetime import datetime
from db import db

sitting_interest_bp = Blueprint('sitting_interest_bp', __name__)

# Route to fetch all sitter interests (GET)
@sitting_interest_bp.route('', methods=['GET'])
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
@sitting_interest_bp.route('/<string:sitter_interest_id>', methods=['GET'])
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
@sitting_interest_bp.route('', methods=['POST'])
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
@sitting_interest_bp.route('/<string:sitter_interest_id>', methods=['PUT'])
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
@sitting_interest_bp.route('/<string:sitter_interest_id>', methods=['DELETE'])
def delete_sitter_interest(sitter_interest_id):
    sitter_interest = SitterInterests.query.get(sitter_interest_id)
    if not sitter_interest:
        abort(404, description="Sitter interest not found")

    db.session.delete(sitter_interest)
    db.session.commit()
    return jsonify({'message': 'Sitter interest deleted successfully'}), 200