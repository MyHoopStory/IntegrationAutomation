# Ansible Playbooks

## Core Playbooks

### deploy-all.yml

The main deployment playbook that orchestrates the entire infrastructure setup:

- Installs required collections
- Builds and pushes container images
- Deploys infrastructure through Terraform
- Configures networking and services

### Network Configuration

(referencing ansible/ansible.md, startLine: 63, endLine: 85)

### VM Deployment

(referencing ansible/ansible.md, startLine: 89, endLine: 112)

## Validation Playbooks

### verify.yml

Performs comprehensive validation of the deployment:

- Container image verification
- Terraform state validation
- K3s cluster health checks
- Flux installation verification

## Error Handling

All playbooks implement robust error handling:
(referencing ansible/ansible.md, startLine: 156, endLine: 173)

## Running Playbooks

### Basic Execution

```bash
ansible-playbook deploy-all.yml
```

With Extra Variables

```bash
ansible-playbook deploy-all.yml -e "environment=production"
```

Check Mode

```bash
ansible-playbook deploy-all.yml --check
```
