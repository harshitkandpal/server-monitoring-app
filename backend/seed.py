from app import create_app, db
from app.models import Server, ServerMetric, Alert
from datetime import datetime, timedelta
import random

app = create_app()

def seed_database():
    """Seed the database with mock data"""
    with app.app_context():
        # First, delete existing data
        Alert.query.delete()
        ServerMetric.query.delete()
        Server.query.delete()
        
        # Commit the deletions
        db.session.commit()
        
        # Create servers
        servers = [
            Server(
                name="Web Server 01",
                ip_address="192.168.1.101",
                status="online",
                server_type="web",
                location="US East",
                operating_system="Ubuntu 22.04"
            ),
            Server(
                name="Database Server 01",
                ip_address="192.168.1.102",
                status="online",
                server_type="database",
                location="US East",
                operating_system="CentOS 8"
            ),
            Server(
                name="Application Server 01",
                ip_address="192.168.1.103",
                status="maintenance",
                server_type="application",
                location="US West",
                operating_system="Red Hat 9"
            ),
            Server(
                name="Load Balancer 01",
                ip_address="192.168.1.104",
                status="online",
                server_type="load balancer",
                location="US East",
                operating_system="Ubuntu 20.04"
            ),
            Server(
                name="Storage Server 01",
                ip_address="192.168.1.105",
                status="offline",
                server_type="storage",
                location="EU West",
                operating_system="Debian 11"
            )
        ]
        
        db.session.add_all(servers)
        db.session.commit()
        
        # Generate metrics for the last 24 hours
        now = datetime.utcnow()
        for server in servers:
            # Generate hourly metrics for the last 24 hours
            for hour in range(24, -1, -1):
                timestamp = now - timedelta(hours=hour)
                
                # Create some patterns in the data
                hour_of_day = timestamp.hour
                # Servers are busier during business hours
                time_factor = 0.5 + 0.5 * (0.5 if hour_of_day >= 9 and hour_of_day <= 17 else 0.2)
                
                # Each server has different characteristics
                if server.server_type == "web":
                    cpu_base = 40
                    ram_base = 60
                    disk_base = 45
                    net_base = 5
                    app_perf = random.uniform(80, 150)
                elif server.server_type == "database":
                    cpu_base = 50
                    ram_base = 70
                    disk_base = 65
                    net_base = 3
                    app_perf = random.uniform(100, 200)
                elif server.server_type == "application":
                    cpu_base = 60
                    ram_base = 55
                    disk_base = 40
                    net_base = 2
                    app_perf = random.uniform(90, 180)
                elif server.server_type == "load balancer":
                    cpu_base = 30
                    ram_base = 40
                    disk_base = 25
                    net_base = 8
                    app_perf = random.uniform(50, 100)
                else:  # storage
                    cpu_base = 20
                    ram_base = 30
                    disk_base = 80
                    net_base = 6
                    app_perf = random.uniform(70, 130)
                
                # Add randomness and time factors
                cpu_usage = min(100, max(0, cpu_base * time_factor + random.uniform(-10, 10)))
                ram_usage = min(100, max(0, ram_base * time_factor + random.uniform(-10, 10)))
                disk_usage = min(100, max(0, disk_base + random.uniform(-5, 5)))  # Disk usage doesn't fluctuate as much
                network_in = max(0, net_base * time_factor + random.uniform(-1, 1))
                network_out = max(0, (net_base * 0.7) * time_factor + random.uniform(-1, 1))
                
                # Higher traffic on some hours for specific patterns
                if hour_of_day in [10, 14, 16]:
                    network_in *= 1.5
                    network_out *= 1.5
                
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
        alerts = [
            Alert(
                server_id=1,
                timestamp=now - timedelta(hours=2),
                severity="low",
                message="CPU usage above 80% for 5 minutes"
            ),
            Alert(
                server_id=2,
                timestamp=now - timedelta(hours=5),
                severity="medium",
                message="Database connection pool near capacity"
            ),
            Alert(
                server_id=3,
                timestamp=now - timedelta(hours=1),
                severity="critical",
                message="Application not responding to health checks"
            ),
            Alert(
                server_id=4,
                timestamp=now - timedelta(hours=3),
                severity="low",
                message="SSL certificate expires in 10 days"
            ),
            Alert(
                server_id=5,
                timestamp=now - timedelta(hours=8),
                severity="critical",
                message="Storage server offline - disk failure detected"
            ),
            Alert(
                server_id=1,
                timestamp=now - timedelta(days=1),
                severity="medium",
                message="High memory usage detected",
                resolved=True,
                resolved_at=now - timedelta(hours=22)
            )
        ]
        
        db.session.add_all(alerts)
        db.session.commit()
        
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()