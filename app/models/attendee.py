from app.models.db import db, environment, SCHEMA, add_prefix_for_prod

class Attendee(db.Model):
    __tablename__ = 'attendees'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
    game_night_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('game_nights.id')), primary_key=True)
    
    
    user = db.relationship('User', back_populates='attendances')
    game_night = db.relationship('GameNight', back_populates='attendances')