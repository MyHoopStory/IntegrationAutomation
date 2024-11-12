# Ansible Automation

## Overview

Ansible is used for automated configuration of network devices and virtual infrastructure after the initial ZTP process.

## Directory Structure

```plaintext
ansible/
├── inventory/
│   ├── hosts.yml
│   └── group_vars/
│       ├── switches.yml
│       └── vsphere.yml
├── playbooks/
│   ├── configure_switches.yml
│   ├── deploy_vms.yml
│   └── configure_vsans.yml
├── roles/
│   ├── network/
│   ├── vsphere/
│   └── validation/
└── templates/
    ├── switch_config.j2
    └── vm_config.j2
```

## Inventory Configuration

### Host Configuration
```yaml
# inventory/hosts.yml
all:
  children:
    switches:
      hosts:
        switch1:
          ansible_host: 192.168.1.10
          switch_type: cisco
        switch2:
          ansible_host: 192.168.1.11
          switch_type: dell
    vsphere:
      hosts:
        vcenter:
          ansible_host: 192.168.1.20
```

### Group Variables
```yaml
# inventory/group_vars/switches.yml
ansible_network_os: ios
ansible_connection: network_cli
ansible_user: "{{ vault_ansible_user }}"
ansible_password: "{{ vault_ansible_password }}"
```

## Playbooks

### Network Configuration
```yaml
# playbooks/configure_switches.yml
---
- name: Configure Network Switches
  hosts: switches
  gather_facts: no
  
  tasks:
    - name: Configure VLANs
      ios_vlans:
        config:
          - name: "{{ item.name }}"
            vlan_id: "{{ item.vlan_id }}"
        state: merged
      loop: "{{ vlans }}"
      when: switch_type == "cisco"

    - name: Configure IP Helpers
      ios_config:
        lines:
          - ip helper-address {{ item.helper_ip }}
        parents: interface Vlan{{ item.vlan_id }}
      loop: "{{ dhcp_helpers }}"
```

### VM Deployment
```yaml
# playbooks/deploy_vms.yml
---
- name: Deploy Virtual Machines
  hosts: vsphere
  gather_facts: no

  tasks:
    - name: Create VM from template
      vmware_guest:
        hostname: "{{ vcenter_hostname }}"
        username: "{{ vcenter_username }}"
        password: "{{ vcenter_password }}"
        validate_certs: no
        name: "{{ item.name }}"
        template: "{{ item.template }}"
        datacenter: "{{ datacenter_name }}"
        folder: "{{ folder_name }}"
        networks:
          - name: "{{ item.network }}"
            ip: "{{ item.ip }}"
            netmask: "{{ item.netmask }}"
            gateway: "{{ item.gateway }}"
      loop: "{{ vms }}"
```

## Roles

### Network Role Tasks
```yaml
# roles/network/tasks/main.yml
---
- name: Validate Network Configuration
  include_tasks: validate.yml

- name: Configure VLANs
  include_tasks: vlans.yml

- name: Configure Routing
  include_tasks: routing.yml

- name: Configure DHCP Helpers
  include_tasks: dhcp.yml
```

## Templates

### Switch Configuration Template
```jinja
{# templates/switch_config.j2 #}
{% for vlan in vlans %}
vlan {{ vlan.id }}
 name {{ vlan.name }}
!
interface Vlan{{ vlan.id }}
 description {{ vlan.description }}
 ip address {{ vlan.gateway }} {{ vlan.netmask }}
{% if vlan.helper_ip is defined %}
 ip helper-address {{ vlan.helper_ip }}
{% endif %}
!
{% endfor %}
```

## Error Handling

```yaml
# Example error handling in playbooks
tasks:
  - name: Configure Switch
    block:
      - name: Apply Configuration
        ios_config:
          src: "switch_config.j2"
    rescue:
      - name: Log Failure
        debug:
          msg: "Configuration failed, rolling back..."
      - name: Revert Configuration
        ios_config:
          lines: "reload in 1"
    always:
      - name: Save Configuration
        ios_command:
          commands: "write memory"
```

## Validation

```yaml
# roles/validation/tasks/main.yml
---
- name: Validate VLAN Configuration
  assert:
    that:
      - item.vlan_id is defined
      - item.name is defined
      - item.vlan_id | int > 0
      - item.vlan_id | int < 4095
    fail_msg: "Invalid VLAN configuration"
  loop: "{{ vlans }}"
```

## Running Playbooks

```bash
# Run with inventory
ansible-playbook -i inventory/hosts.yml playbooks/configure_switches.yml

# Run with extra vars
ansible-playbook playbooks/deploy_vms.yml -e "@vars/project_vars.yml"

# Run with vault
ansible-playbook --ask-vault-pass playbooks/configure_switches.yml
``` 