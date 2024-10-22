from flask import Blueprint, jsonify, request, abort
from models.users_model import Users
from models.event_model import Event
from datetime import datetime
from db import db


users_bp = Blueprint('users_bp', __name__)

# Route to list all users
@users_bp.route('/all', methods=['GET'])
def list_all_users():
    users = Users.query.all()
    if not users:
        return jsonify({'message': 'No users found'}), 404

    users_data = [
        {
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
        for user in users
    ]

    return jsonify(users_data), 200

# Route to get user ID by email
@users_bp.route('/id/email/<string:email>', methods=['GET'])
def get_user_id_by_email(email):
    user = Users.query.filter_by(email=email).first()
    if not user:
        abort(404, description="User not found")
    
    return jsonify({'user_id': user.userid}), 200


#Route to get user info
@users_bp.route('/<string:user_id>', methods=['GET'])
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
@users_bp.route('/email/<string:email>', methods=['GET'])
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
@users_bp.route('', methods=['POST'])
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
@users_bp.route('/<string:user_id>', methods=['PUT'])
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
@users_bp.route('/email/<string:email>', methods=['PUT'])
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
