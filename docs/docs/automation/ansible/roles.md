# Ansible Roles

## Core Roles

### K3s Server Role

Manages the installation and configuration of K3s master nodes:

- Base system configuration
- K3s binary installation
- Control plane setup
- Post-installation validation

### K3s Agent Role

Handles K3s worker node setup:

- Node preparation
- K3s agent installation
- Node joining
- Health verification

### Network Configuration Role

Manages network device configuration:

- VLAN setup
- Interface configuration
- Routing protocols
- Access control lists

## Role Structure

Each role follows the standard Ansible structure:

```plaintext
roles/

├── k3s_server/

│ ├── tasks/

│ ├── handlers/

│ ├── templates/

│ ├── files/

│ ├── vars/

│ ├── defaults/

│ └── meta/

└── k3s_agent/

└── ...
```

Role Dependencies

- K3s server role requires base system configuration
- Network roles depend on ZTP completion
- Application roles depend on K3s cluster availability

## Role Variables

Variables are managed through:

- group_vars for environment-specific settings
- host_vars for node-specific configuration
- defaults for standard configurations
- vars for role-specific overrides

## Role Tags

Common tags used across roles:

- `setup`: Initial configuration tasks
- `configure`: Main configuration tasks
- `validate`: Verification tasks
- `cleanup`: Cleanup operations

## Usage Examples

### Including Roles in Playbooks

```yaml
name: Deploy K3s Cluster

hosts: k3s_nodes

roles:

* role: k3s_server

when: inventory_hostname in groups['master']

* role: k3s_agent

when: inventory_hostname in groups['worker']
```
