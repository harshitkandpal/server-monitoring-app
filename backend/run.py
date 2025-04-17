from flask import send_from_directory
from flask_cors import CORS
from app import create_app, db
from app.models import Server, ServerMetric, Alert
from app.utils import generate_mock_data
import os

app = create_app()
CORS(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    static_folder = os.path.join(os.getcwd(), 'static')
    file_path = os.path.join(static_folder, path)

    if path != "" and os.path.exists(file_path):
        return send_from_directory(static_folder, path)
    else:
        return send_from_directory(static_folder, 'index.html')

@app.cli.command('create-tables')
def create_tables():
    db.create_all()
    print('Database tables created successfully!')

@app.cli.command('generate-mock-data')
def mock_data():
    with app.app_context():
        generate_mock_data()

if __name__ == '__main__':
    app.run(debug=True, port=5000)