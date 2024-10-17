from db import db
import uuid


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