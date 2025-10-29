from sqlalchemy.sql import text
from app.models.attendee import Attendee
from app.models import db, User, Relationship, environment, SCHEMA

def seed_attendees():
    # Grab users and relationships from the database
    demo_user = User.query.filter_by(username="Demo").first()
    marnie = User.query.filter_by(username="marnie").first()
    bobbie = User.query.filter_by(username="bobbie").first()

    relationship = Relationship.query.first()
    if relationship:
        # Optionally add host/user as an attendee if such semantics apply
        # Add additional attendees if they aren't already attending
        for user in [marnie, bobbie]:
            if user and not any(a.user_id == user.id for a in relationship.attendances):
                relationship.attendances.append(Attendee(user_id=user.id, relationship_id=relationship.id, status="Accepted"))

        db.session.commit()
        print(f"Seeded attendees for relationship '{relationship.title}'")
    else:
        print("No relationships found. Make sure you seed relationships first.")

def undo_attendees():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.attendees RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM attendees"))

    db.session.commit()
    print("Cleared attendees table")
