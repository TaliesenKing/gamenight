from app.models.attendee import Attendee
from app.models import db, User, GameNight, environment, SCHEMA

def seed_attendees():
    # Grab users and game nights from the database
    demo_user = User.query.filter_by(username="Demo").first()
    marnie = User.query.filter_by(username="marnie").first()
    bobbie = User.query.filter_by(username="bobbie").first()

    game1 = GameNight.query.first()
    if game1:
        # Host automatically attends
        if not any(a.user_id == game1.host.id for a in game1.attendances):
            game1.attendances.append(Attendee(user_id=game1.host.id, game_night_id=game1.id))

        # Add additional attendees if they aren't already attending
        for user in [marnie, bobbie]:
            if not any(a.user_id == user.id for a in game1.attendances):
                game1.attendances.append(Attendee(user_id=user.id, game_night_id=game1.id))

        db.session.commit()
        print(f"Seeded attendees for game night '{game1.title}'")
    else:
        print("No game nights found. Make sure you seed game nights first.")

def undo_attendees():

    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.attendees RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM attendees")

    db.session.commit()
    print("Cleared attendees table")
