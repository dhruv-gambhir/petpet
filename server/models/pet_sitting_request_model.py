from db import db
import uuid

class PetSittingRequests(db.Model):
    __tablename__ = 'pet_sitting_requests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    sittingrequestid= db.Column(db.String(36), db.ForeignKey('sitting_requests.id'), nullable=False)  # Foreign Key of the sitting request table (UUID as string)
    petid= db.Column(db.String(36), db.ForeignKey('pets.id'), nullable=False)  # Foreign Key of the pet table (UUID as string)

    #add relationship to sitting request table and pet table
    sitting_requests= db.relationship('SittingRequests', backref='petlist')
    pets= db.relationship('Pets', backref='pet_sitting_requests_made')