from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Quest, UserQuest, User, db
from datetime import datetime

quest_routes = Blueprint('quests', __name__)

@quest_routes.route('/')
@login_required
def get_user_quests():
    """Get all quests for the current user"""
    user_quests = db.session.query(UserQuest, Quest).join(
        Quest, UserQuest.quest_id == Quest.id
    ).filter(
        UserQuest.user_id == current_user.id
    ).order_by(Quest.order_index).all()
    
    quest_data = []
    for user_quest, quest in user_quests:
        quest_dict = quest.to_dict()
        quest_dict['user_quest'] = user_quest.to_dict()
        quest_data.append(quest_dict)
    
    return jsonify(quest_data)

@quest_routes.route('/tutorial')
@login_required
def get_tutorial_quests():
    """Get tutorial quests for the current user"""
    user_quests = db.session.query(UserQuest, Quest).join(
        Quest, UserQuest.quest_id == Quest.id
    ).filter(
        UserQuest.user_id == current_user.id,
        Quest.is_tutorial == True
    ).order_by(Quest.order_index).all()
    
    quest_data = []
    for user_quest, quest in user_quests:
        quest_dict = quest.to_dict()
        quest_dict['user_quest'] = user_quest.to_dict()
        quest_data.append(quest_dict)
    
    return jsonify(quest_data)

@quest_routes.route('/<int:quest_id>/progress', methods=['POST'])
@login_required
def update_quest_progress(quest_id):
    """Update progress for a specific quest"""
    user_quest = UserQuest.query.filter_by(
        user_id=current_user.id,
        quest_id=quest_id
    ).first()
    
    if not user_quest:
        return jsonify({'error': 'Quest not found'}), 404
    
    if user_quest.completed:
        return jsonify({'error': 'Quest already completed'}), 400
    
    quest = Quest.query.get(quest_id)
    if not quest:
        return jsonify({'error': 'Quest not found'}), 404
    
    # Increment progress
    user_quest.current_progress += 1
    
    # Check if quest is completed
    if user_quest.current_progress >= quest.target_count:
        user_quest.completed = True
        user_quest.completed_at = datetime.utcnow()
        
        # Award points to user (you can expand this later)
        # current_user.points += quest.reward_points
    
    db.session.commit()
    
    return jsonify({
        'user_quest': user_quest.to_dict(),
        'quest': quest.to_dict(),
        'completed': user_quest.completed
    })

@quest_routes.route('/<int:quest_id>/complete', methods=['POST'])
@login_required
def complete_quest(quest_id):
    """Mark a quest as completed"""
    user_quest = UserQuest.query.filter_by(
        user_id=current_user.id,
        quest_id=quest_id
    ).first()
    
    if not user_quest:
        return jsonify({'error': 'Quest not found'}), 404
    
    if user_quest.completed:
        return jsonify({'error': 'Quest already completed'}), 400
    
    quest = Quest.query.get(quest_id)
    if not quest:
        return jsonify({'error': 'Quest not found'}), 404
    
    # Mark as completed
    user_quest.completed = True
    user_quest.completed_at = datetime.utcnow()
    user_quest.current_progress = quest.target_count
    
    # Award points to user (you can expand this later)
    # current_user.points += quest.reward_points
    
    db.session.commit()
    
    return jsonify({
        'user_quest': user_quest.to_dict(),
        'quest': quest.to_dict(),
        'completed': True
    })

@quest_routes.route('/stats')
@login_required
def get_quest_stats():
    """Get quest completion statistics for the current user"""
    total_quests = UserQuest.query.filter_by(user_id=current_user.id).count()
    completed_quests = UserQuest.query.filter_by(
        user_id=current_user.id, 
        completed=True
    ).count()
    
    tutorial_quests = db.session.query(UserQuest).join(
        Quest, UserQuest.quest_id == Quest.id
    ).filter(
        UserQuest.user_id == current_user.id,
        Quest.is_tutorial == True
    ).count()
    
    completed_tutorial_quests = db.session.query(UserQuest).join(
        Quest, UserQuest.quest_id == Quest.id
    ).filter(
        UserQuest.user_id == current_user.id,
        Quest.is_tutorial == True,
        UserQuest.completed == True
    ).count()
    
    # Calculate total reward points earned
    earned_points = db.session.query(db.func.sum(Quest.reward_points)).join(
        UserQuest, Quest.id == UserQuest.quest_id
    ).filter(
        UserQuest.user_id == current_user.id,
        UserQuest.completed == True
    ).scalar() or 0
    
    return jsonify({
        'total_quests': total_quests,
        'completed_quests': completed_quests,
        'tutorial_quests': tutorial_quests,
        'completed_tutorial_quests': completed_tutorial_quests,
        'completion_percentage': round((completed_quests / total_quests * 100) if total_quests > 0 else 0, 1),
        'tutorial_completion_percentage': round((completed_tutorial_quests / tutorial_quests * 100) if tutorial_quests > 0 else 0, 1),
        'earned_points': earned_points
    })

@quest_routes.route('/leaderboard')
def get_quest_leaderboard():
    """Get quest completion leaderboard"""
    # Get top users by quest completion and points
    leaderboard = db.session.query(
        User.username,
        db.func.count(UserQuest.id).label('completed_quests'),
        db.func.sum(Quest.reward_points).label('total_points')
    ).join(
        UserQuest, User.id == UserQuest.user_id
    ).join(
        Quest, UserQuest.quest_id == Quest.id
    ).filter(
        UserQuest.completed == True
    ).group_by(
        User.id, User.username
    ).order_by(
        db.desc('total_points'),
        db.desc('completed_quests')
    ).limit(10).all()
    
    leaderboard_data = []
    for rank, (username, completed_quests, total_points) in enumerate(leaderboard, 1):
        leaderboard_data.append({
            'rank': rank,
            'username': username,
            'completed_quests': completed_quests,
            'total_points': total_points or 0
        })
    
    return jsonify(leaderboard_data)
