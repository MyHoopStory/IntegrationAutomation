# Creating a Project

The project creation interface allows you to define all aspects of a new network integration project.

## Project Information

The form is divided into several sections:

1. Basic Project Information
   - Project Name
   - Shipping Information
   - Contact Details

2. Server Configuration
   - Backup Schedule
   - Maintenance Windows
   - Update Strategy

3. Network Configuration
   - Gateway Settings
   - DNS Configuration
   - SMTP Settings

## Managing Network Components

### VLANs
Each VLAN entry requires:
- Name
- VLAN ID
- Network
- Gateway IP
- DHCP Configuration

### VSANs
VSAN entries need:
- Name
- VLAN Assignment

### Virtual Machines
VM configuration includes:
- VM Name
- VLAN ID
- Network Details
- Gateway Configuration

## Form Validation

The system validates entries before submission:
- Required fields must be completed
- Network addresses must be valid
- VLAN IDs must be unique 