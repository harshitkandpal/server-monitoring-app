# backend/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost/server_monitoring')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    CORS(app)
    db.init_app(app)
    
    from app.routes import main_bp
    app.register_blueprint(main_bp)
    
    return app