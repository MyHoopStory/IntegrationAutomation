#!/bin/bash
set -e

echo "WARNING: This will completely remove:"
echo "- K3s cluster and all applications"
echo "- All VMs created by Terraform"
echo "- Local credentials and configuration files"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# Load secrets
if [ -f "ansible/secrets.env" ]; then
    source ansible/secrets.env
else
    echo "Error: secrets.env file not found"
    exit 1
fi

# Environment setup
export KUBECONFIG="$PWD/kubeconfig"
export ANSIBLE_USER="serveradmin"

echo "1. Running Ansible reset playbook..."
ansible-playbook reset-vcenter.yml -i inventory/vcenter/hosts.ini

echo "2. Cleaning up local files..."
rm -f kubeconfig
rm -f ansible/cluster-credentials.txt
rm -f inventory/vcenter/hosts.ini
rm -rf terraform/terraform-vm-provisioning/.terraform
rm -f terraform/terraform-vm-provisioning/.terraform.lock.hcl
rm -f terraform/terraform-vm-provisioning/terraform.tfstate*

echo "Reset complete! All resources have been cleaned up."