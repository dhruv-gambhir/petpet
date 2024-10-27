from db import db
import uuid

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
    color= db.Column(db.String(50))  # Color of the pet
    weight= db.Column(db.Float)  # Weight of the pet
    createdat= db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    #add relationship to user table
    users = db.relationship('Users', backref='pets_owned')
    pet_sitting_requests= db.relationship('PetSittingRequests', backref='pets_info')