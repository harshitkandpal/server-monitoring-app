# backend/app/utils.py
import random
from datetime import datetime, timedelta
from app.models import Server, ServerMetric, Alert
from app import db

def generate_mock_data():
    """Generate mock data for the server monitoring application"""
    # Clear existing data
    db.session.query(Alert).delete()
    db.session.query(ServerMetric).delete()
    db.session.query(Server).delete()
    db.session.commit()
    
    # Create server entries
    servers = [
        Server(
            name='Web Server 1',
            ip_address='192.168.1.101',
            status='online',
            server_type='web',
            location='US East',
            operating_system='Ubuntu 22.04 LTS'
        ),
        Server(
            name='Web Server 2',
            ip_address='192.168.1.102',
            status='online',
            server_type='web',
            location='US West',
            operating_system='Ubuntu 22.04 LTS'
        ),
        Server(
            name='Database Server',
            ip_address='192.168.1.103',
            status='online',
            server_type='database',
            location='US East',
            operating_system='CentOS 8'
        ),
        Server(
            name='Application Server 1',
            ip_address='192.168.1.104',
            status='maintenance',
            server_type='application',
            location='Europe',
            operating_system='Windows Server 2019'
        ),
        Server(
            name='Application Server 2',
            ip_address='192.168.1.105',
            status='online',
            server_type='application',
            location='Asia',
            operating_system='Windows Server 2019'
        ),
        Server(
            name='Cache Server',
            ip_address='192.168.1.106',
            status='online',
            server_type='cache',
            location='US East',
            operating_system='Ubuntu 20.04 LTS'
        ),
        Server(
            name='Backup Server',
            ip_address='192.168.1.107',
            status='offline',
            server_type='backup',
            location='US West',
            operating_system='CentOS 7'
        )
    ]
    
    db.session.add_all(servers)
    db.session.commit()
    
    # Generate server metrics
    now = datetime.utcnow()
    for server in servers:
        # Generate data for the past 24 hours
        for hour in range(24, 0, -1):
            # Generate 12 data points per hour (every 5 minutes)
            for minute in range(0, 60, 5):
                timestamp = now - timedelta(hours=hour, minutes=minute)
                
                # Generate realistic server metrics
                base_cpu = random.uniform(10, 40)
                if server.server_type == 'database':
                    base_cpu += 15  # Databases tend to use more CPU
                
                # Create some patterns for CPU usage
                time_of_day = timestamp.hour
                if 9 <= time_of_day <= 17:  # Business hours
                    cpu_factor = 1.5
                else:
                    cpu_factor = 1.0
                
                cpu_usage = min(base_cpu * cpu_factor + random.uniform(-5, 15), 100)
                ram_usage = random.uniform(30, 70)
                disk_usage = random.uniform(40, 85)
                
                # Network traffic - higher during business hours
                if 9 <= time_of_day <= 17:
                    network_base = random.uniform(5, 12)
                else:
                    network_base = random.uniform(1, 5)
                
                network_in = network_base + random.uniform(0, 3)
                network_out = network_base * 0.7 + random.uniform(0, 2)
                
                # App performance metric (lower is better)
                app_perf = random.uniform(50, 300)
                
                metric = ServerMetric(
                    server_id=server.id,
                    timestamp=timestamp,
                    cpu_usage=cpu_usage,
                    ram_usage=ram_usage,
                    disk_usage=disk_usage,
                    network_in=network_in,
                    network_out=network_out,
                    application_performance=app_perf
                )
                db.session.add(metric)
        
        # Generate some alerts
        alert_types = [
            {
                'severity': 'critical',
                'message_templates': [
                    'CPU usage exceeding 90% for more than 5 minutes',
                    'Server unresponsive for more than 2 minutes',
                    'Database connection pool exhausted',
                    'Out of memory error detected',
                    'Disk space critical - less than 5% available'
                ]
            },
            {
                'severity': 'medium',
                'message_templates': [
                    'High CPU usage detected (>75%)',
                    'Memory usage above 80%',
                    'Disk usage above 85%',
                    'Elevated error rate in application logs',
                    'Degraded network performance detected'
                ]
            },
            {
                'severity': 'low',
                'message_templates': [
                    'CPU usage above normal (>60%)',
                    'Memory usage above normal (>70%)',
                    'HTTP 404 errors increased',
                    'Backup task delayed',
                    'Scheduled maintenance reminder'
                ]
            }
        ]
        
        # Create random alerts
        if server.status == 'online':
            # Critical alerts - fewer of these
            for _ in range(random.randint(0, 2)):
                alert_data = alert_types[0]  # critical
                timestamp = now - timedelta(hours=random.randint(1, 48))
                resolved = random.random() > 0.7  # 30% chance of being resolved
                
                alert = Alert(
                    server_id=server.id,
                    timestamp=timestamp,
                    severity=alert_data['severity'],
                    message=random.choice(alert_data['message_templates']),
                    resolved=resolved,
                    resolved_at=timestamp + timedelta(minutes=random.randint(10, 120)) if resolved else None
                )
                db.session.add(alert)
            
            # Medium alerts
            for _ in range(random.randint(1, 4)):
                alert_data = alert_types[1]  # medium
                timestamp = now - timedelta(hours=random.randint(1, 72))
                resolved = random.random() > 0.5  # 50% chance of being resolved
                
                alert = Alert(
                    server_id=server.id,
                    timestamp=timestamp,
                    severity=alert_data['severity'],
                    message=random.choice(alert_data['message_templates']),
                    resolved=resolved,
                    resolved_at=timestamp + timedelta(minutes=random.randint(20, 240)) if resolved else None
                )
                db.session.add(alert)
            
            # Low alerts
            for _ in range(random.randint(2, 6)):
                alert_data = alert_types[2]  # low
                timestamp = now - timedelta(hours=random.randint(1, 96))
                resolved = random.random() > 0.2  # 80% chance of being resolved
                
                alert = Alert(
                    server_id=server.id,
                    timestamp=timestamp,
                    severity=alert_data['severity'],
                    message=random.choice(alert_data['message_templates']),
                    resolved=resolved,
                    resolved_at=timestamp + timedelta(minutes=random.randint(30, 360)) if resolved else None
                )
                db.session.add(alert)
        
        elif server.status == 'maintenance':
            # Add a maintenance alert
            alert = Alert(
                server_id=server.id,
                timestamp=now - timedelta(hours=random.randint(4, 12)),
                severity='medium',
                message='Server in scheduled maintenance',
                resolved=False
            )
            db.session.add(alert)
            
        elif server.status == 'offline':
            # Add an offline alert
            alert = Alert(
                server_id=server.id,
                timestamp=now - timedelta(hours=random.randint(1, 8)),
                severity='critical',
                message='Server offline - connection lost',
                resolved=False
            )
            db.session.add(alert)
    
    db.session.commit()
    print("Mock data has been generated successfully!")