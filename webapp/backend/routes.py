from flask import Blueprint, request, jsonify, current_app
from . import db
from .models import Project, ShippingAddress, ShippingContact, Vlan, Vsan, Vm
import logging
from sqlalchemy.exc import SQLAlchemyError

logging.basicConfig(level=logging.DEBUG)

# Create a Blueprint for routes
bp = Blueprint('routes', __name__)

@bp.route('/project', methods=['POST'])
def create_project():
    data = request.get_json()

    # Create the new Project object
    new_project = Project(
        name=data['name'],
        backup_schedule=data.get('backup_schedule', ''),
        maintenance_windows=data.get('maintenance_windows', ''),
        windows_2003_sql_2005_vm_needed=data.get('windows_2003_sql_2005_vm_needed', False),
        wsus_update_strategy=data.get('wsus_update_strategy', ''),
        gateway_top_of_rack_switch=data.get('gateway_top_of_rack_switch', ''),
        top_of_rack_connectivity=data.get('top_of_rack_connectivity', ''),
        property_ntp_server_ip=data.get('property_ntp_server_ip', ''),
        domain_controller_ip=data.get('domain_controller_ip', ''),
        primary_dns_ip=data.get('primary_dns_ip', ''),
        secondary_dns_ip=data.get('secondary_dns_ip', ''),
        vlan_to_network_mapping=data.get('vlan_to_network_mapping', ''),
        smtp_address=data.get('smtp_address', ''),
        smtp_from_address=data.get('smtp_from_address', ''),
        smtp_alert_address=data.get('smtp_alert_address', ''),
        igt_building_domain_advantage=data.get('igt_building_domain_advantage', False),
        igt_building_domain_sbx=data.get('igt_building_domain_sbx', False),
    )

    try:
        db.session.add(new_project)
        db.session.commit()

        # Process Shipping Addresses
        shipping_address_data = data.get('shipping_address', [])
        if isinstance(shipping_address_data, dict):  
            shipping_address_data = [shipping_address_data]  
        for address_data in shipping_address_data:
            new_address = ShippingAddress(**address_data, project_id=new_project.id)
            db.session.add(new_address)

        # Process Shipping Contacts
        shipping_contact_data = data.get('shipping_contact', [])
        if isinstance(shipping_contact_data, dict):  
            shipping_contact_data = [shipping_contact_data]
        for contact_data in shipping_contact_data:
            new_contact = ShippingContact(**contact_data, project_id=new_project.id)
            db.session.add(new_contact)

        # Process VLANs
        vlan_data = data.get('vlans', [])
        if isinstance(vlan_data, list):  
            for vlan_item in vlan_data:
                new_vlan = Vlan(**vlan_item, project_id=new_project.id)
                db.session.add(new_vlan)

        # Process VSANs
        vsan_data = data.get('vsans', [])
        if isinstance(vsan_data, list):  
            for vsan_item in vsan_data:
                new_vsan = Vsan(**vsan_item, project_id=new_project.id)
                db.session.add(new_vsan)

        # Process VM data
        vm_data = data.get('vms', [])
        for vm_item in vm_data:
            new_vm = Vm(
                name=vm_item['name'],
                vlan_id=vm_item['vlan_id'],
                network=vm_item['network'],
                default_gateway=vm_item['default_gateway'],
                gateway_location=vm_item['gateway_location'],
                project_id=new_project.id
            )
            db.session.add(new_vm)

        db.session.commit()
        return jsonify({"message": "Project created successfully", "project_id": new_project.id})

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating project", "error": str(e)}), 400

@bp.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    result = []
    for project in projects:
        project_data = {
            'name': project.name,
            'backup_schedule': project.backup_schedule,
            'maintenance_windows': project.maintenance_windows,
            'windows_2003_sql_2005_vm_needed': project.windows_2003_sql_2005_vm_needed,
            'wsus_update_strategy': project.wsus_update_strategy,
            'gateway_top_of_rack_switch': project.gateway_top_of_rack_switch,
            'top_of_rack_connectivity': project.top_of_rack_connectivity,
            'property_ntp_server_ip': project.property_ntp_server_ip,
            'domain_controller_ip': project.domain_controller_ip,
            'primary_dns_ip': project.primary_dns_ip,
            'secondary_dns_ip': project.secondary_dns_ip,
            'vlan_to_network_mapping': project.vlan_to_network_mapping,
            'smtp_address': project.smtp_address,
            'smtp_from_address': project.smtp_from_address,
            'smtp_alert_address': project.smtp_alert_address,
            'igt_building_domain_advantage': project.igt_building_domain_advantage,
            'igt_building_domain_sbx': project.igt_building_domain_sbx,
            'shipping_address': [
                {
                    'address_line1': address.address_line1,
                    'address_line2': address.address_line2,
                    'city': address.city,
                    'state': address.state,
                    'postal_code': address.postal_code,
                    'country': address.country
                } for address in project.shipping_addresses
            ],
            'shipping_contact': [
                {
                    'first_name': contact.first_name,
                    'last_name': contact.last_name,
                    'phone1': contact.phone1,
                    'phone2': contact.phone2,
                    'email': contact.email
                } for contact in project.shipping_contacts
            ],
            'vlans': [
                {
                    'name': vlan.name,
                    'vlan_id': vlan.vlan_id,
                    'network': vlan.network,
                    'gateway_ip': vlan.gateway_ip,
                    'is_igt_switch_gateway': vlan.is_igt_switch_gateway,
                    'dhcp_scopes': vlan.dhcp_scopes,
                    'dhcp_ip_helper_ip': vlan.dhcp_ip_helper_ip
                } for vlan in project.vlans
            ],
            'vsans': [
                {
                    'name': vsan.name,
                    'vlan': vsan.vlan
                } for vsan in project.vsans
            ],
            'vms': [
                {
                    'name': vm.name,
                    'vlan_id': vm.vlan_id,
                    'network': vm.network,
                    'default_gateway': vm.default_gateway,
                    'gateway_location': vm.gateway_location
                } for vm in project.vms
            ]
        }
        result.append(project_data)

    logging.debug(f"Returning Projects Data: {result}")  # Log the response before returning

    return jsonify(result)

@bp.route('/projects/<string:name>', methods=['GET'])
def get_project(name):
    try:
        project = Project.query.filter_by(name=name).first()
        
        if project is None:
            return jsonify({'error': 'Project not found'}), 404
            
        project_data = {
            'name': project.name,
            'backup_schedule': project.backup_schedule,
            'maintenance_windows': project.maintenance_windows,
            'windows_2003_sql_2005_vm_needed': project.windows_2003_sql_2005_vm_needed,
            'wsus_update_strategy': project.wsus_update_strategy,
            'gateway_top_of_rack_switch': project.gateway_top_of_rack_switch,
            'top_of_rack_connectivity': project.top_of_rack_connectivity,
            'property_ntp_server_ip': project.property_ntp_server_ip,
            'domain_controller_ip': project.domain_controller_ip,
            'primary_dns_ip': project.primary_dns_ip,
            'secondary_dns_ip': project.secondary_dns_ip,
            'vlan_to_network_mapping': project.vlan_to_network_mapping,
            'smtp_address': project.smtp_address,
            'smtp_from_address': project.smtp_from_address,
            'smtp_alert_address': project.smtp_alert_address,
            'igt_building_domain_advantage': project.igt_building_domain_advantage,
            'igt_building_domain_sbx': project.igt_building_domain_sbx,
            'shipping_address': [
                {
                    'address_line1': address.address_line1,
                    'address_line2': address.address_line2,
                    'city': address.city,
                    'state': address.state,
                    'postal_code': address.postal_code,
                    'country': address.country
                } for address in project.shipping_addresses
            ],
            'shipping_contact': [
                {
                    'first_name': contact.first_name,
                    'last_name': contact.last_name,
                    'phone1': contact.phone1,
                    'phone2': contact.phone2,
                    'email': contact.email
                } for contact in project.shipping_contacts
            ],
            'vlans': [
                {
                    'name': vlan.name,
                    'vlan_id': vlan.vlan_id,
                    'network': vlan.network,
                    'gateway_ip': vlan.gateway_ip,
                    'is_igt_switch_gateway': vlan.is_igt_switch_gateway,
                    'dhcp_scopes': vlan.dhcp_scopes,
                    'dhcp_ip_helper_ip': vlan.dhcp_ip_helper_ip
                } for vlan in project.vlans
            ],
            'vsans': [
                {
                    'name': vsan.name,
                    'vlan': vsan.vlan
                } for vsan in project.vsans
            ],
            'vms': [
                {
                    'name': vm.name,
                    'vlan_id': vm.vlan_id,
                    'network': vm.network,
                    'default_gateway': vm.default_gateway,
                    'gateway_location': vm.gateway_location
                } for vm in project.vms
            ]
        }
        
        return jsonify(project_data)
        
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error: {str(e)}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500