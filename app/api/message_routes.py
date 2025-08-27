from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Message, User
from sqlalchemy import or_, and_

message_routes = Blueprint('messages', __name__)


@message_routes.route('/')
@login_required
def get_messages():
    """
    Get all messages for the current user (sent and received)
    """
    messages = Message.query.filter(
        or_(
            Message.sender_id == current_user.id,
            Message.recipient_id == current_user.id
        )
    ).order_by(Message.created_at.desc()).all()
    
    return {'messages': [message.to_dict() for message in messages]}


@message_routes.route('/conversations')
@login_required
def get_conversations():
    """
    Get all unique conversations for the current user
    """
    # Get all users that the current user has messaged or received messages from
    conversations = db.session.query(User).filter(
        or_(
            User.id.in_(
                db.session.query(Message.sender_id).filter(Message.recipient_id == current_user.id)
            ),
            User.id.in_(
                db.session.query(Message.recipient_id).filter(Message.sender_id == current_user.id)
            )
        )
    ).all()
    
    conversation_data = []
    for user in conversations:
        # Get the latest message in this conversation
        latest_message = Message.query.filter(
            or_(
                and_(Message.sender_id == current_user.id, Message.recipient_id == user.id),
                and_(Message.sender_id == user.id, Message.recipient_id == current_user.id)
            )
        ).order_by(Message.created_at.desc()).first()
        
        # Count unread messages from this user
        unread_count = Message.query.filter(
            and_(
                Message.sender_id == user.id,
                Message.recipient_id == current_user.id,
                Message.read == False
            )
        ).count()
        
        conversation_data.append({
            'user': user.to_dict(),
            'latest_message': latest_message.to_dict_minimal() if latest_message else None,
            'unread_count': unread_count
        })
    
    # Sort by latest message time
    conversation_data.sort(key=lambda x: x['latest_message']['created_at'] if x['latest_message'] else '', reverse=True)
    
    return {'conversations': conversation_data}


@message_routes.route('/conversation/<int:user_id>')
@login_required
def get_conversation(user_id):
    """
    Get all messages in a conversation with a specific user
    """
    messages = Message.query.filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.recipient_id == user_id),
            and_(Message.sender_id == user_id, Message.recipient_id == current_user.id)
        )
    ).order_by(Message.created_at.asc()).all()
    
    # Mark messages from the other user as read
    unread_messages = Message.query.filter(
        and_(
            Message.sender_id == user_id,
            Message.recipient_id == current_user.id,
            Message.read == False
        )
    ).all()
    
    for message in unread_messages:
        message.read = True
    
    db.session.commit()
    
    return {'messages': [message.to_dict() for message in messages]}


@message_routes.route('/', methods=['POST'])
@login_required
def send_message():
    """
    Send a new message
    """
    data = request.get_json()
    
    # Validate required fields
    if not data or 'recipient_id' not in data or 'content' not in data:
        return {'error': 'recipient_id and content are required'}, 400
    
    # Check if recipient exists
    recipient = User.query.get(data['recipient_id'])
    if not recipient:
        return {'error': 'Recipient not found'}, 404
    
    # Don't allow sending messages to yourself
    if recipient.id == current_user.id:
        return {'error': 'Cannot send message to yourself'}, 400
    
    # Create new message
    message = Message(
        sender_id=current_user.id,
        recipient_id=data['recipient_id'],
        content=data['content'].strip()
    )
    
    # Validate content is not empty
    if not message.content:
        return {'error': 'Message content cannot be empty'}, 400
    
    db.session.add(message)
    db.session.commit()
    
    return message.to_dict(), 201


@message_routes.route('/<int:message_id>/read', methods=['PUT'])
@login_required
def mark_message_read(message_id):
    """
    Mark a message as read
    """
    message = Message.query.get(message_id)
    
    if not message:
        return {'error': 'Message not found'}, 404
    
    # Only the recipient can mark a message as read
    if message.recipient_id != current_user.id:
        return {'error': 'Unauthorized'}, 403
    
    message.read = True
    db.session.commit()
    
    return message.to_dict()


@message_routes.route('/<int:message_id>', methods=['DELETE'])
@login_required
def delete_message(message_id):
    """
    Delete a message (only sender can delete)
    """
    message = Message.query.get(message_id)
    
    if not message:
        return {'error': 'Message not found'}, 404
    
    # Only the sender can delete a message
    if message.sender_id != current_user.id:
        return {'error': 'Unauthorized'}, 403
    
    db.session.delete(message)
    db.session.commit()
    
    return {'message': 'Message deleted successfully'}


@message_routes.route('/unread-count')
@login_required
def get_unread_count():
    """
    Get the count of unread messages for the current user
    """
    unread_count = Message.query.filter(
        and_(
            Message.recipient_id == current_user.id,
            Message.read == False
        )
    ).count()
    
    return {'unread_count': unread_count}
