# Database Schema

## Overview

The database uses PostgreSQL with SQLAlchemy as the ORM. The schema is designed to support project management with related network configurations.

## Tables

### Projects
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    backup_schedule VARCHAR(200),
    maintenance_windows VARCHAR(200),
    windows_2003_sql_2005_vm_needed BOOLEAN DEFAULT FALSE,
    wsus_update_strategy VARCHAR(200),
    gateway_top_of_rack_switch VARCHAR(200),
    top_of_rack_connectivity VARCHAR(200),
    property_ntp_server_ip VARCHAR(100),
    domain_controller_ip VARCHAR(100),
    primary_dns_ip VARCHAR(100),
    secondary_dns_ip VARCHAR(100),
    vlan_to_network_mapping TEXT,
    smtp_address VARCHAR(200),
    smtp_from_address VARCHAR(200),
    smtp_alert_address VARCHAR(200),
    igt_building_domain_advantage BOOLEAN DEFAULT FALSE,
    igt_building_domain_sbx BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### VLANs
```sql
CREATE TABLE vlans (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    name VARCHAR(100),
    vlan_id VARCHAR(50),
    network VARCHAR(100),
    gateway_ip VARCHAR(100),
    is_igt_switch_gateway BOOLEAN DEFAULT FALSE,
    dhcp_scopes VARCHAR(200),
    dhcp_ip_helper_ip VARCHAR(100)
);
```

### VSANs
```sql
CREATE TABLE vsans (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    name VARCHAR(100),
    vlan VARCHAR(50)
);
```

### VMs
```sql
CREATE TABLE vms (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    name VARCHAR(100),
    vlan_id VARCHAR(50),
    network VARCHAR(100),
    default_gateway VARCHAR(100),
    gateway_location VARCHAR(100)
);
```

### Shipping Address
```sql
CREATE TABLE shipping_addresses (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100)
);
```

### Shipping Contact
```sql
CREATE TABLE shipping_contacts (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone1 VARCHAR(50),
    phone2 VARCHAR(50),
    email VARCHAR(200)
);
```

## Relationships

### One-to-Many Relationships
- Project → VLANs
- Project → VSANs
- Project → VMs

### One-to-One Relationships
- Project → Shipping Address
- Project → Shipping Contact

## SQLAlchemy Models

The database schema is implemented using SQLAlchemy models. Here's an example of the Project model:

```python
class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # Relationships
    vlans = db.relationship('Vlan', backref='project', lazy=True)
    vsans = db.relationship('Vsan', backref='project', lazy=True)
    vms = db.relationship('Vm', backref='project', lazy=True)
    shipping_address = db.relationship('ShippingAddress', backref='project', uselist=False)
    shipping_contact = db.relationship('ShippingContact', backref='project', uselist=False)
```

## Database Migrations

Database migrations are handled using Alembic through Flask-Migrate:

```bash
# Create a new migration
flask db migrate -m "Description of changes"

# Apply migrations
flask db upgrade

# Rollback migrations
flask db downgrade
```

## Indexing Strategy

Key indexes are created for:
- Project name (for quick searches)
- Foreign keys (for relationship joins)
- VLAN IDs (for uniqueness validation) 