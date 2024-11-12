from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize the db instance
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # App configuration settings
    app.config.from_mapping(
        SECRET_KEY='my_secret_key',
        SQLALCHEMY_DATABASE_URI='sqlite:////app/projects.db',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )
    
    # Initialize the db with the app
    db.init_app(app)
    
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Register the Blueprint for routes
    from . import routes
    app.register_blueprint(routes.bp)
    
    return app
