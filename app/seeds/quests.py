from app.models import db, Quest, UserQuest, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds tutorial quests for new users
def seed_quests():
    # Create tutorial quests
    quest1 = Quest(
        title="🏰 Welcome to the Tavern!",
        description="Send your first message to a fellow adventurer and begin your journey of fellowship.",
        quest_type="message",
        target_count=1,
        reward_points=25,
        is_tutorial=True,
        order_index=1
    )
    
    quest2 = Quest(
        title="📜 Spread the Word",
        description="Send messages to 3 different adventurers to expand your network of allies.",
        quest_type="message_multiple",
        target_count=3,
        reward_points=50,
        is_tutorial=True,
        order_index=2
    )
    
    quest3 = Quest(
        title="🎲 Join the Gathering",
        description="Attend your first game night and experience the magic of tabletop adventures.",
        quest_type="attend",
        target_count=1,
        reward_points=75,
        is_tutorial=True,
        order_index=3
    )
    
    quest4 = Quest(
        title="🗣️ Share Your Thoughts",
        description="Leave comments or feedback to help build our adventuring community.",
        quest_type="comment",
        target_count=2,
        reward_points=35,
        is_tutorial=True,
        order_index=4
    )
    
    quest5 = Quest(
        title="⚔️ Seasoned Adventurer",
        description="Attend 3 different game nights to prove your dedication to the fellowship.",
        quest_type="attend_multiple",
        target_count=3,
        reward_points=100,
        is_tutorial=True,
        order_index=5
    )

    db.session.add(quest1)
    db.session.add(quest2)
    db.session.add(quest3)
    db.session.add(quest4)
    db.session.add(quest5)
    
    db.session.commit()
    
    # Assign tutorial quests to existing users
    users = User.query.all()
    quests = Quest.query.filter_by(is_tutorial=True).all()
    
    for user in users:
        for quest in quests:
            # Check if user already has this quest
            existing_user_quest = UserQuest.query.filter_by(
                user_id=user.id, 
                quest_id=quest.id
            ).first()
            
            if not existing_user_quest:
                user_quest = UserQuest(
                    user_id=user.id,
                    quest_id=quest.id,
                    current_progress=0,
                    completed=False
                )
                db.session.add(user_quest)
    
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the quest tables
def undo_quests():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_quests RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.quests RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_quests"))
        db.session.execute(text("DELETE FROM quests"))

    db.session.commit()
