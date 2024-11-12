# Zero Touch Provisioning (ZTP)

## Overview

The Zero Touch Provisioning system automates the initial configuration of network switches using DHCP and TFTP services.

## Components

### DHCP Server
```yaml
# Docker service configuration
isc-dhcp-server:
    image: networkboot/dhcpd
    ports:
      - "68:67/udp"
    networks:
      - app-network
    volumes:
      - ./ztp/dhcpd.conf:/etc/dhcp/dhcpd.conf
      - ./ztp/data:/data
```

### TFTP Server
```yaml
tftp:
    image: pghalliday/tftp
    ports:
      - "69:69/udp"
    networks:
      - app-network
    volumes:
      - ./ztp/tftp:/var/tftpboot
```

## Configuration Files

### DHCP Configuration
```conf
# dhcpd.conf
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    option tftp-server-name "192.168.1.2";
    option bootfile-name "network-config.conf";
}
```

### Switch Templates

#### Cisco Switch Template
```text
hostname {{ hostname }}
!
interface Vlan1
 ip address {{ management_ip }} {{ subnet_mask }}
!
{% for vlan in vlans %}
vlan {{ vlan.id }}
 name {{ vlan.name }}
!
{% endfor %}
```

#### Dell Switch Template
```text
hostname {{ hostname }}
!
interface vlan 1
 ip address {{ management_ip }} {{ subnet_mask }}
!
{% for vlan in vlans %}
interface vlan {{ vlan.id }}
 description {{ vlan.name }}
!
{% endfor %}
```

## Process Flow

1. **Switch Boot**
   - New switch powers on
   - Requests IP via DHCP
   - Receives TFTP server information

2. **Configuration Download**
   - Switch contacts TFTP server
   - Downloads appropriate configuration
   - Applies base configuration

3. **Post-Configuration**
   - Ansible takes over for detailed setup
   - Validates configuration
   - Reports status back to main application

## Implementation

### Python Script for Template Generation
```python
from jinja2 import Template

def generate_switch_config(switch_data, template_type):
    template_file = f"templates/{template_type}_switch.j2"
    with open(template_file) as f:
        template = Template(f.read())
    
    return template.render(**switch_data)
```

### Configuration Validation
```python
def validate_switch_config(switch_ip, credentials):
    # Connect to switch
    # Verify configuration
    # Return status
    pass
```

## Monitoring

The ZTP process is monitored through:
- DHCP server logs
- TFTP server logs
- Switch connection status
- Configuration validation results

## Troubleshooting

Common issues and solutions:
1. DHCP not responding
   - Check network connectivity
   - Verify DHCP server configuration
   - Check Docker container status

2. TFTP failures
   - Verify file permissions
   - Check network connectivity
   - Validate configuration templates

3. Switch not accepting configuration
   - Check switch model compatibility
   - Verify template syntax
   - Check switch access credentials 