# app.py (in the /app directory)
from flask import Flask
from flask_cors import CORS
from . import create_app

app = create_app()
CORS(app)

@app.route('/')
def home():
    return "Flask Backend is Running!"

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)
