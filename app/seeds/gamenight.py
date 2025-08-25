from ..models import db, GameNight, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta
from ..models import User


def seed_game_nights():
    demo_user = User.query.filter_by(username="Demo").first()
    if not demo_user:
        print("Demo user not found. Make sure users are seeded first.")
        return

    game1 = GameNight(
        host_id=demo_user.id,
        title="Friday Night RPG",
        game_id=1,
        description="A fun RPG night!",
        location_name="TJ's House",
        location_details="Bring your own snacks.",
        start_time=datetime.utcnow() + timedelta(days=1),
        end_time=datetime.utcnow() + timedelta(days=1, hours=4),
        max_players=6
    )

    db.session.add(game1)
    db.session.commit()
    print("Seeded demo game night.")


def undo_game_nights():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.game_nights RESTART IDENTITY CASCADE;")
        # db.session.execute(f"TRUNCATE table {SCHEMA}.attendees RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM game_nights"))
        # db.session.execute(text("DELETE FROM attendees"))
    db.session.commit()
