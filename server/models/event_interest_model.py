from db import db
import uuid

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