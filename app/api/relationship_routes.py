from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Relationship

relationship_routes = Blueprint('relationships', __name__)

@relationship_routes.route('/')
@login_required
def relationships():
    """
    Query for all relationships and returns them in a list of dictionaries
    """
    relationships = Relationship.query.all()
    return jsonify([relationship.to_dict() for relationship in relationships])

@relationship_routes.route('/<int:id>')
@login_required
def relationship(id):
    """
    Query for a relationship by id and returns that relationship in a dictionary
    """
    relationship = Relationship.query.get(id)
    return jsonify(relationship.to_dict())

@relationship_routes.route('/', methods=['POST'])
@login_required
def create_relationship():
    """
    Creates a new relationship
    """
    data = request.json
    new_relationship = Relationship(
        user_id=current_user.id,
        **data
    )
    db.session.add(new_relationship)
    db.session.commit()
    return jsonify(new_relationship.to_dict())

@relationship_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_relationship(id):
    """
    Updates an existing relationship
    """
    relationship = Relationship.query.get(id)
    if relationship.user_id != current_user.id:
        return {"errors": ["Unauthorized"]}, 401
    
    data = request.json
    for key, value in data.items():
        setattr(relationship, key, value)
    
    db.session.commit()
    return jsonify(relationship.to_dict())

@relationship_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_relationship(id):
    """
    Deletes an existing relationship
    """
    relationship = Relationship.query.get(id)
    if relationship.user_id != current_user.id:
        return {"errors": ["Unauthorized"]}, 401
    
    db.session.delete(relationship)
    db.session.commit()
    return {"message": "Successfully deleted"}