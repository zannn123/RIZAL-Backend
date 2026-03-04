# app/seeder.py
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.base import Base
from app.models.role import Role
from app.models.user import User, UserRole
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_tables():
    """Create all tables"""
    # Import all models so they register with Base.metadata
    from app.models import Base, Role, User, UserRole, StudentProfile, SSGProfile, Attendance
    from app.models.department import Department
    from app.models.program import Program
    from app.models.event import Event
    from app.models.associations import (
        event_department_association,
        event_program_association,
        program_department_association,
        event_ssg_association
    )
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")

def seed_roles(db: Session):
    """Seed roles table with required roles"""
    roles_data = [
        {"name": "student"},
        {"name": "ssg"},
        {"name": "event-organizer"},
        {"name": "admin"}
    ]
    
    existing_roles = db.query(Role).all()
    existing_role_names = {role.name for role in existing_roles}
    
    for role_data in roles_data:
        if role_data["name"] not in existing_role_names:
            role = Role(**role_data)
            db.add(role)
    
    db.commit()
    print("✅ Roles seeded")

def seed_admin_user(db: Session):
    """Create initial admin user"""
    # Check if admin user already exists
    admin_email = os.getenv("ADMIN_EMAIL", "admin@university.edu")
    admin_password = os.getenv("ADMIN_PASSWORD", "AdminPass123!")
    
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    
    if not existing_admin:
        # Create admin user
        admin_user = User(
            email=admin_email,
            first_name="System",
            middle_name=None,
            last_name="Administrator",
            is_active=True
        )
        admin_user.set_password(admin_password)
        db.add(admin_user)
        db.flush()  # Get the user ID
        
        # Get admin role
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if admin_role:
            user_role = UserRole(user_id=admin_user.id, role_id=admin_role.id)
            db.add(user_role)
        
        db.commit()
        print(f"✅ Admin user created: {admin_email}")
        print(f"🔑 Admin password: {admin_password}")
        
    else:
        print("ℹ️  Admin user already exists")

def run_seeder():
    """Main seeder function"""
    print("🌱 Starting database seeding...")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Create tables first
        create_tables()
        
        # Seed roles
        seed_roles(db)
        
        # Seed admin user
        seed_admin_user(db)
        
        print("🎉 Database seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    run_seeder()