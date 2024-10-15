from db import db
import uuid

class SitterInterests(db.Model):
    __tablename__ = 'sitter_interests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    userid= db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # Foreign Key of the user table (UUID as string)
    sittingrequestid= db.Column(db.String(36), db.ForeignKey('sitting_requests.id'), nullable=False)  # Foreign Key of the sitting request table (UUID as string)
    status= db.Column(db.Enum('pending', 'decided', name='status_enum'), default='pending')  # Status of the sitting interest
    createdat= db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    #add relationship to user table and sitting request table
    user =  db.relationship('Users', backref='sitter_interests_made')
    sitting_request= db.relationship('SittingRequests', backref='sitter_interests_of_request')
