from app.models.db import db

class Attendee(db.Model):
    __tablename__ = 'attendees'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    game_night_id = db.Column(db.Integer, db.ForeignKey('game_nights.id'), primary_key=True)
    
    
    user = db.relationship('User', back_populates='attendances')
    game_night = db.relationship('GameNight', back_populates='attendances')