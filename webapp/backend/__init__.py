from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from os import environ

# Initialize mongo
mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # MongoDB configuration
    app.config["MONGO_URI"] = environ.get('MONGODB_URI', 
        f"mongodb://{environ.get('MONGODB_USERNAME')}:{environ.get('MONGODB_PASSWORD')}@mongodb.mongodb.svc.cluster.local:27017/{environ.get('MONGODB_DATABASE')}?authSource=admin"
    )
    
    # Initialize MongoDB with the app
    mongo.init_app(app)
    
    # Register blueprints
    from . import routes
    app.register_blueprint(routes.bp)
    
    return app
