# backend/app/models.py
from app import db
from datetime import datetime

class Server(db.Model):
    __tablename__ = 'servers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='online')  # online, offline, maintenance
    server_type = db.Column(db.String(50))  # web, database, application, etc.
    location = db.Column(db.String(100))
    operating_system = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    metrics = db.relationship('ServerMetric', backref='server', lazy=True)
    alerts = db.relationship('Alert', backref='server', lazy=True)
    
    def __repr__(self):
        return f'<Server {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'ip_address': self.ip_address,
            'status': self.status,
            'server_type': self.server_type,
            'location': self.location,
            'operating_system': self.operating_system,
            'created_at': self.created_at.isoformat()
        }

class ServerMetric(db.Model):
    __tablename__ = 'server_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    cpu_usage = db.Column(db.Float, nullable=False)  # Percentage
    ram_usage = db.Column(db.Float, nullable=False)  # Percentage
    disk_usage = db.Column(db.Float, nullable=False)  # Percentage
    network_in = db.Column(db.Float, nullable=False)  # MB/s
    network_out = db.Column(db.Float, nullable=False)  # MB/s
    application_performance = db.Column(db.Float)  # Application-specific metric
    
    def __repr__(self):
        return f'<ServerMetric {self.server_id} at {self.timestamp}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'server_id': self.server_id,
            'timestamp': self.timestamp.isoformat(),
            'cpu_usage': self.cpu_usage,
            'ram_usage': self.ram_usage,
            'disk_usage': self.disk_usage,
            'network_in': self.network_in,
            'network_out': self.network_out,
            'application_performance': self.application_performance
        }

class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    severity = db.Column(db.String(20), nullable=False)  # critical, medium, low
    message = db.Column(db.Text, nullable=False)
    resolved = db.Column(db.Boolean, default=False)
    resolved_at = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<Alert {self.id}: {self.severity}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'server_id': self.server_id,
            'timestamp': self.timestamp.isoformat(),
            'severity': self.severity,
            'message': self.message,
            'resolved': self.resolved,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None
        }