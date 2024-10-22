from db import db
import uuid

class SittingRequests(db.Model):
    __tablename__ = 'sitting_requests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    userid= db.Column(db.String(36), db.ForeignKey('users.userid'), nullable=False)  # Foreign Key of the user table (UUID as string)
    pay= db.Column(db.Integer)  # Pay for the sitting request
    startdate= db.Column(db.Date)  # Start date of the sitting request
    enddate= db.Column(db.Date)  # End date of the sitting request
    description= db.Column(db.Text)  # Description of the sitting request
    status= db.Column(db.Enum('pending', 'decided', name='status_enum'), default='pending')  # Status of the sitting request
    createdat= db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    location = db.Column(db.String(255))
    #tasktype= db.Column(db.Enum('day_boarding', 'doggy_day_care', 'dog_walking', 'home_visits', 'house_sitting', name='task_enum'))  # Type of the task

    #add relationship to user table and sitter interest table and pet sitting request table
    sitter_interest= db.relationship('SitterInterests', backref='sitting_requests_made')
    pet_sitting_requests = db.relationship('PetSittingRequests', backref='sitting_requests_of_pets', cascade="all, delete", lazy=True)
