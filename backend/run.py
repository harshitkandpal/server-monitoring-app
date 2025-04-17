# backend/run.py
from app import create_app, db
from app.models import Server, ServerMetric, Alert
from app.utils import generate_mock_data
import os

app = create_app()

@app.cli.command('create-tables')
def create_tables():
    db.create_all()
    print('Database tables created successfully!')

@app.cli.command('generate-mock-data')
def mock_data():
    with app.app_context():
        generate_mock_data()

if __name__ == '__main__':
    app.run(debug=True)