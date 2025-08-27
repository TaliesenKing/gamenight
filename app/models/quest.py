from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Quest(db.Model):
    __tablename__ = 'quests'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    quest_type = db.Column(db.String(50), nullable=False)  # 'comment', 'message', 'attend', etc.
    target_count = db.Column(db.Integer, nullable=False, default=1)
    reward_points = db.Column(db.Integer, nullable=False, default=10)
    is_tutorial = db.Column(db.Boolean, nullable=False, default=True)
    order_index = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user_quests = db.relationship('UserQuest', back_populates='quest', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'quest_type': self.quest_type,
            'target_count': self.target_count,
            'reward_points': self.reward_points,
            'is_tutorial': self.is_tutorial,
            'order_index': self.order_index,
            'created_at': self.created_at.isoformat()
        }


class UserQuest(db.Model):
    __tablename__ = 'user_quests'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    quest_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('quests.id')), nullable=False)
    current_progress = db.Column(db.Integer, nullable=False, default=0)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    started_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='user_quests')
    quest = db.relationship('Quest', back_populates='user_quests')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quest_id': self.quest_id,
            'current_progress': self.current_progress,
            'completed': self.completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'started_at': self.started_at.isoformat(),
            'quest': self.quest.to_dict()
        }

    @property
    def progress_percentage(self):
        return min(100, (self.current_progress / self.quest.target_count) * 100)
