#!/bin/bash
set -e

# Load secrets
if [ -f "ansible/secrets.env" ]; then
    source ansible/secrets.env
else
    echo "Error: secrets.env file not found"
    exit 1
fi

# Environment setup
export KUBECONFIG="$PWD/kubeconfig"
export K3S_TOKEN=$(openssl rand -hex 32)
export ANSIBLE_USER="serveradmin"
export APISERVER_ENDPOINT="10.77.250.220"
export METALLB_IP_RANGE="10.77.250.221-10.77.250.230"

# PostgreSQL configuration
export POSTGRES_USER="k3s"
export POSTGRES_PASSWORD=$(openssl rand -hex 16)  # Generate random password
export POSTGRES_DB="k3s"

# Flux configuration
export GITHUB_TOKEN="your-token"
export FLUX_GITHUB_OWNER="your-username"
export FLUX_REPO_NAME="your-repo"

# Generate inventory from Terraform
echo "Generating Ansible inventory..."
terraform -chdir=terraform/terraform-vm-provisioning output -raw ansible_inventory > inventory/vcenter/hosts.ini

# Deploy K3s cluster
echo "Deploying k3s cluster..."
ansible-playbook site.yml -i inventory/vcenter/hosts.ini

echo "K3s cluster deployment complete!" 