# backend/app/routes.py
from flask import Blueprint, jsonify, request
from sqlalchemy import func
from app.models import Server, ServerMetric, Alert
from app import db
from datetime import datetime, timedelta, timezone
 

main_bp = Blueprint('main', __name__)

@main_bp.route('/api/servers', methods=['GET'])
def get_servers():
    servers = Server.query.all()
    return jsonify({
        'success': True,
        'data': [server.to_dict() for server in servers]
    })

@main_bp.route('/api/servers/<int:server_id>', methods=['GET'])
def get_server(server_id):
    server = Server.query.get_or_404(server_id)
    return jsonify({
        'success': True,
        'data': server.to_dict()
    })

@main_bp.route('/api/alerts/summary', methods=['GET'])
def get_alert_summary():
    critical_count = Alert.query.filter_by(severity='critical', resolved=False).count()
    medium_count = Alert.query.filter_by(severity='medium', resolved=False).count()
    low_count = Alert.query.filter_by(severity='low', resolved=False).count()
    
    return jsonify({
        'success': True,
        'data': {
            'critical': critical_count,
            'medium': medium_count,
            'low': low_count,
            'total': critical_count + medium_count + low_count
        }
    })

@main_bp.route('/api/alerts', methods=['GET'])
def get_alerts():
    alerts = Alert.query.order_by(Alert.timestamp.desc()).limit(50).all()
    return jsonify({
        'success': True,
        'data': [alert.to_dict() for alert in alerts]
    })

@main_bp.route('/api/metrics/<int:server_id>', methods=['GET'])
def get_server_metrics(server_id):
    # Get time range from query parameters (default to last 24 hours)
    hours = request.args.get('hours', 24, type=int)
    
    # If hours is 0, fetch all data without a time range limit
    if hours == 0:
        metrics = ServerMetric.query.filter(
            ServerMetric.server_id == server_id
        ).order_by(ServerMetric.timestamp.asc()).all()
    else:
        start_time = datetime.now(timezone.utc) - timedelta(hours=hours)
        metrics = ServerMetric.query.filter(
            ServerMetric.server_id == server_id,
            ServerMetric.timestamp >= start_time
        ).order_by(ServerMetric.timestamp.asc()).all()
    
    return jsonify({
        'success': True,
        'data': [metric.to_dict() for metric in metrics]
    })


@main_bp.route('/api/metrics/summary', methods=['GET'])
def get_metrics_summary():
    # Get 'hours' parameter if provided
    hours = request.args.get('hours', type=int)

    # Base query
    query = db.session.query(
        func.avg(ServerMetric.cpu_usage).label('avg_cpu'),
        func.avg(ServerMetric.ram_usage).label('avg_ram'),
        func.avg(ServerMetric.disk_usage).label('avg_disk'),
        func.avg(ServerMetric.network_in).label('avg_network_in'),
        func.avg(ServerMetric.network_out).label('avg_network_out'),
        func.avg(ServerMetric.application_performance).label('avg_app_perf')
    )

    # Apply time filter if 'hours' is provided
    if hours is not None:
        start_time = datetime.now(timezone.utc) - timedelta(hours=hours)
        query = query.filter(ServerMetric.timestamp >= start_time)

    # Now execute query
    result = query.first()

    return jsonify({
        'success': True,
        'data': {
            'cpu_usage': result.avg_cpu or 0,
            'ram_usage': result.avg_ram or 0,
            'disk_usage': result.avg_disk or 0,
            'network_in': result.avg_network_in or 0,
            'network_out': result.avg_network_out or 0,
            'application_performance': result.avg_app_perf or 0
        }
    })


@main_bp.route('/api/network/traffic', methods=['GET'])
def get_network_traffic():
    # Try to get 'hours' from request args
    hours = request.args.get('hours', type=int)

    # Base query
    query = db.session.query(
        func.date_trunc('hour', ServerMetric.timestamp).label('hour'),
        func.sum(ServerMetric.network_in).label('total_in'),
        func.sum(ServerMetric.network_out).label('total_out')
    )

    # Apply time filter if 'hours' is provided
    if hours is not None:
        start_time = datetime.now(timezone.utc) - timedelta(hours=hours)
        query = query.filter(ServerMetric.timestamp >= start_time)

    # Continue with grouping and ordering
    query = query.group_by(
        func.date_trunc('hour', ServerMetric.timestamp)
    ).order_by(
        func.date_trunc('hour', ServerMetric.timestamp).asc()
    )

    metrics = query.all()

    # Format result
    result = [
        {
            'timestamp': record.hour.isoformat(),
            'network_in': float(record.total_in),
            'network_out': float(record.total_out)
        }
        for record in metrics
    ]

    return jsonify({
        'success': True,
        'data': result
    })

@main_bp.route('/api/alerts/server/<int:server_id>', methods=['GET'])
def get_alerts_by_server(server_id):
    alerts = Alert.query.filter_by(server_id=server_id).order_by(Alert.timestamp.desc()).all()
    return jsonify({
        'success': True,
        'data': [alert.to_dict() for alert in alerts]
    })
