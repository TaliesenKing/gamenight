from app.models import db, Message, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds demo direct messages between users
def seed_messages():
    users = User.query.all()

    if len(users) >= 2:
        message1 = Message(
            sender_id=users[0].id,
            recipient_id=users[1].id,
            content="Hey! Are you free this weekend?"
        )

        message2 = Message(
            sender_id=users[1].id,
            recipient_id=users[0].id,
            content="Yep — let's meet up and play some games."
        )

        db.session.add(message1)
        db.session.add(message2)
        db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the messages table.
def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))

    db.session.commit()
