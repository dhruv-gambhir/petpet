from db import db
import uuid


class Users(db.Model):
    __tablename__ = 'users'
    userid = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID as string
    name= db.Column(db.String(255))  # Name of the user
    email= db.Column(db.String(255), unique=True, nullable=False)  # Email of the user
    phonenumber= db.Column(db.String(20))  # Phone number of the user
    createdat = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    updatedat = db.Column(db.TIMESTAMP, onupdate=db.func.current_timestamp())
    bio = db.Column(db.Text)  # Bio of the user
    imageurl = db.Column(db.Text)  # Image URL of the user
    isagency= db.Column(db.Boolean, default=False)  # Boolean to check if the user is an agency
    address= db.Column(db.String(255))  # Address of the user
    licensenumber= db.Column(db.String(200))  # License number of the user