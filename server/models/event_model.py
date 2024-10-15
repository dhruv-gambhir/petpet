from db import db
import uuid

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    createdby = db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # UUID as string
    event_name = db.Column(db.String(255))
    description = db.Column(db.Text)
    location = db.Column(db.String(255))
    startdate = db.Column(db.Date)
    cost = db.Column(db.Integer)
    status = db.Column(db.Enum('pending', 'decided', 'accepted', 'rejected', name='status_enum'), default='pending')
    imageurl = db.Column(db.Text)  
    createdat = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    #add relationship to user table
    user = db.relationship('Users', backref='events_created')