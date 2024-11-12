from flask_sqlalchemy import SQLAlchemy
from . import db  # Import the db instance from the main app setup
from datetime import datetime


class ShippingAddress(db.Model):
    __tablename__ = 'shipping_addresses'
    id = db.Column(db.Integer, primary_key=True)
    address_line1 = db.Column(db.String(200), nullable=False)
    address_line2 = db.Column(db.String(200))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    country = db.Column(db.String(100))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

class ShippingContact(db.Model):
    __tablename__ = 'shipping_contacts'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    phone1 = db.Column(db.String(20))
    phone2 = db.Column(db.String(20))
    email = db.Column(db.String(100))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
class Vlan(db.Model):
    __tablename__ = 'vlans'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    vlan_id = db.Column(db.String(50))
    network = db.Column(db.String(100))
    gateway_ip = db.Column(db.String(100))
    is_igt_switch_gateway = db.Column(db.Boolean, default=False)
    dhcp_scopes = db.Column(db.String(200))
    dhcp_ip_helper_ip = db.Column(db.String(100))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

class Vsan(db.Model):
    __tablename__ = 'vsans'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    vlan = db.Column(db.String(50))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

class Vm(db.Model):
    __tablename__ = 'vms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    vlan_id = db.Column(db.String(50))
    network = db.Column(db.String(100))
    default_gateway = db.Column(db.String(100))
    gateway_location = db.Column(db.String(100))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Relationship with Shipping Address and Contact
    shipping_addresses = db.relationship('ShippingAddress', backref='project', lazy=True)
    shipping_contacts = db.relationship('ShippingContact', backref='project', lazy=True)
    
    # Server Info
    backup_schedule = db.Column(db.String(100))
    maintenance_windows = db.Column(db.String(100))
    windows_2003_sql_2005_vm_needed = db.Column(db.Boolean)
    wsus_update_strategy = db.Column(db.String(100))

    # Network Info
    gateway_top_of_rack_switch = db.Column(db.String(100))
    top_of_rack_connectivity = db.Column(db.String(100))
    property_ntp_server_ip = db.Column(db.String(50))
    domain_controller_ip = db.Column(db.String(50))
    primary_dns_ip = db.Column(db.String(50))
    secondary_dns_ip = db.Column(db.String(50))
    vlan_to_network_mapping = db.Column(db.String(200))
    smtp_address = db.Column(db.String(100))
    smtp_from_address = db.Column(db.String(100))
    smtp_alert_address = db.Column(db.String(100))

    # DC-DNS-AD Information
    igt_building_domain_advantage = db.Column(db.Boolean)
    igt_building_domain_sbx = db.Column(db.Boolean)

    # Relationship with VLANs
    vlans = db.relationship('Vlan', backref='project', lazy=True)

    # Relationship with VSANs
    vsans = db.relationship('Vsan', backref='project', lazy=True)

    # Relationship with VMs
    vms = db.relationship('Vm', backref='project', lazy=True)

