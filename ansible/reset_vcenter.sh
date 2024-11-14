#!/bin/bash
set -e

# Load the same environment variables
export ANSIBLE_USER="ansible"
export APISERVER_ENDPOINT="10.77.250.220"
export K3S_TOKEN="your-k3s-token"
export METALLB_IP_RANGE="10.77.250.220-10.77.250.230"

echo "Resetting k3s cluster..."
ansible-playbook reset.yml -i inventory/hosts.ini

echo "Removing local kubeconfig..."
rm -f kubeconfig

echo "K3s cluster reset complete!"