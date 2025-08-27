from app.models import db, Message, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds demo messages, you can add other messages here if you want
def seed_messages():
    # Get some users to create messages between
    users = User.query.all()
    
    if len(users) >= 2:
        # Create some sample messages between the first two users
        message1 = Message(
            sender_id=users[0].id,
            recipient_id=users[1].id,
            content="Hey! Are you joining the game night this weekend?"
        )
        
        message2 = Message(
            sender_id=users[1].id,
            recipient_id=users[0].id,
            content="Absolutely! What games are we playing?"
        )
        
        message3 = Message(
            sender_id=users[0].id,
            recipient_id=users[1].id,
            content="I was thinking Settlers of Catan and maybe some Codenames. What do you think?"
        )
        
        message4 = Message(
            sender_id=users[1].id,
            recipient_id=users[0].id,
            content="Sounds perfect! I'll bring some snacks too."
        )
        
        db.session.add(message1)
        db.session.add(message2)
        db.session.add(message3)
        db.session.add(message4)
        
        # If there are more users, create some additional messages
        if len(users) >= 3:
            message5 = Message(
                sender_id=users[2].id,
                recipient_id=users[0].id,
                content="Thanks for organizing the game night! Looking forward to it."
            )
            
            message6 = Message(
                sender_id=users[0].id,
                recipient_id=users[2].id,
                content="No problem! It's going to be a lot of fun."
            )
            
            db.session.add(message5)
            db.session.add(message6)
        
        db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the messages table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))

    db.session.commit()
