#!/bin/bash
set -e

# Environment setup
export KUBECONFIG="$PWD/kubeconfig"
export K3S_TOKEN=$(openssl rand -hex 32)
export ANSIBLE_USER="serveradmin"
export APISERVER_ENDPOINT="10.77.250.220"
export METALLB_IP_RANGE="10.77.250.221-10.77.250.230"

# Deploy infrastructure with Terraform
echo "Deploying VMs with Terraform..."
cd terraform/terraform-vm-provisioning
terraform init
terraform apply -auto-approve
cd ../..

# Wait for VMs to be ready
echo "Waiting for VMs to be ready..."
sleep 30

# Install required Ansible collections
echo "Installing Ansible collections..."
ansible-galaxy collection install -r collections/requirements.yml

# Deploy K3s cluster
echo "Deploying k3s cluster..."
ansible-playbook site.yml -i inventory/vcenter/hosts.ini

echo "K3s cluster deployment complete!" 