from flask import Blueprint, request, jsonify
from . import mongo
import logging

logging.basicConfig(level=logging.DEBUG)

# Create a Blueprint for routes
bp = Blueprint('routes', __name__)

@bp.route('/projects', methods=['GET'])
def get_projects():
    try:
        projects = list(mongo.db.projects.find({}, {'_id': 0}))
        return jsonify(projects), 200
    except Exception as e:
        logging.error(f"Error fetching projects: {str(e)}")
        return jsonify({"error": "Failed to fetch projects"}), 500

@bp.route('/projects', methods=['POST'])
def create_project():
    try:
        project_data = request.json
        result = mongo.db.projects.insert_one(project_data)
        return jsonify({"message": "Project created", "id": str(result.inserted_id)}), 201
    except Exception as e:
        logging.error(f"Error creating project: {str(e)}")
        return jsonify({"error": "Failed to create project"}), 500

@bp.route('/projects/<project_id>', methods=['PUT'])
def update_project(project_id):
    try:
        project_data = request.json
        result = mongo.db.projects.update_one(
            {"project_id": project_id},
            {"$set": project_data}
        )
        if result.modified_count:
            return jsonify({"message": "Project updated"}), 200
        return jsonify({"message": "No project found"}), 404
    except Exception as e:
        logging.error(f"Error updating project: {str(e)}")
        return jsonify({"error": "Failed to update project"}), 500

@bp.route('/health', methods=['GET'])
def health_check():
    try:
        # Verify MongoDB connection
        mongo.db.command('ping')
        return jsonify({"status": "healthy", "database": "connected"}), 200
    except Exception as e:
        logging.error(f"Health check failed: {str(e)}")
        return jsonify({"status": "unhealthy", "database": "disconnected"}), 500