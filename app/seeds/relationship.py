from ..models import db, Relationship, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta
from ..models import User


def seed_relationships():
    demo_user = User.query.filter_by(username="Demo").first()
    if not demo_user:
        print("Demo user not found. Make sure users are seeded first.")
        return

    relationship1 = Relationship(
        user_id=demo_user.id,
        title="Primary Partner",
        description="My wonderful partner",
        relationship_type="Romantic",
        start_date=datetime.utcnow() - timedelta(days=365),
        status="Active"
    )

    db.session.add(relationship1)
    db.session.commit()
    print("Seeded demo relationship.")


def undo_relationships():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.relationships RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM relationships"))
    db.session.commit()
