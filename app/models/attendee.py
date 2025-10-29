from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Attendee(db.Model):
    __tablename__ = 'attendees'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    relationship_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('relationships.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='attendances')
    relationship = db.relationship('Relationship', back_populates='attendances')

    def to_dict(self):
        return {
            'id': self.id,
            'relationship_id': self.relationship_id,
            'user_id': self.user_id,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }