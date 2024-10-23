from db import db
import uuid

class AdoptionInterest(db.Model):
    __tablename__ = 'adoption_interests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    userid= db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # Foreign Key of the user table (UUID as string)
    adoptionlistingid = db.Column(db.String(36), db.ForeignKey('adoption_listings.id'), nullable=False) # Foreign Key of the adoption listing table (UUID as string)
    status = db.Column(db.Enum('pending', 'decided', name='status_enum'), default='pending') # Status of the adoption listing
    createdat = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    #add relationship to user table
    users = db.relationship('Users', backref='adoption_interests_created')