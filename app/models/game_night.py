from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .attendee import Attendee

class GameNight(db.Model):
    __tablename__ = 'game_nights'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    game_id = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    location_name = db.Column(db.String(255), nullable=True)
    location_details = db.Column(db.Text, nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    max_players = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    host = db.relationship('User', backref='game_nights_hosted')
    attendances = db.relationship('Attendee', back_populates='game_night')

    
    def to_dict(self):
        return {
            'id': self.id,
            'host_id': self.host_id,
            'title': self.title,
            'game_id': self.game_id,
            'description': self.description,
            'location_name': self.location_name,
            'location_details': self.location_details,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'max_players': self.max_players,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
