from ..models import db, GameNight
from datetime import datetime, timedelta

def seed_game_nights():
    from ..models import User  

    demo_user = User.query.filter_by(username="demo").first()
    if not demo_user:
        print("Demo user not found. Make sure users are seeded first.")
        return

    game_night = GameNight(
        host_id=demo_user.id,
        title="Demo Game Night",
        game_id=1,  
        description="A fun demo game night for testing purposes!",
        location_name="Demo Hall",
        location_details="Room 101",
        start_time=datetime.now() + timedelta(days=1),
        end_time=datetime.now() + timedelta(days=1, hours=3),
        max_players=8,
        attendees=[demo_user.id],  
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    db.session.add(game_night)
    db.session.commit()
    print("Seeded demo game night.")
