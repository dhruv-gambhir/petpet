from flask import Blueprint, jsonify, request, abort
from models.adoption_interest_model import AdoptionInterest
from models.users_model import Users
from datetime import datetime
from db import db

adoption_interest_bp = Blueprint('adoption_interest_bp', __name__)

# Route to fetch all adoption interests (GET)
@adoption_interest_bp.route('', methods=['GET'])
def get_adoption_interests():
    adoption_interests = AdoptionInterest.query.all()
    adoption_interest_list = [{
        'id': adoption_interest.id,
        'userid': adoption_interest.userid,
        'name': Users.query.get(adoption_interest.userid).name,
        'status': adoption_interest.status,
        'createdat': adoption_interest.createdat
    } for adoption_interest in adoption_interests]
    return jsonify(adoption_interest_list), 200

# Route to fetch a single adoption interest by ID (GET)
@adoption_interest_bp.route('/<string:adoption_interest_id>', methods=['GET'])
def get_adoption_interest(adoption_interest_id):
    adoption_interest = AdoptionInterest.query.get(adoption_interest_id)
    if not adoption_interest:
        abort(404, description="Adoption interest not found")

    adoption_interest_data = {
        'id': adoption_interest.id,
        'userid': adoption_interest.userid,
        'name': Users.query.get(adoption_interest.userid).name,
        'status': adoption_interest.status,
        'createdat': adoption_interest.createdat
    }
    return jsonify(adoption_interest_data), 200

# Route to create a new adoption interest (POST)
@adoption_interest_bp.route('', methods=['POST'])
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
@adoption_interest_bp.route('/<string:adoption_interest_id>', methods=['PUT'])
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
@adoption_interest_bp.route('/<string:adoption_interest_id>', methods=['DELETE'])
def delete_adoption_interest(adoption_interest_id):
    adoption_interest = AdoptionInterest.query.get(adoption_interest_id)
    if not adoption_interest:
        abort(404, description="Adoption interest not found")

    db.session.delete(adoption_interest)
    db.session.commit()
    return jsonify({'message': 'Adoption interest deleted successfully'}), 200