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
export GITHUB_TOKEN="${GH_TOKEN}"
export FLUX_GITHUB_OWNER="MyHoopStory"
export FLUX_REPO_NAME="IntegrationAutomation"

# MongoDB configuration
export MONGODB_ROOT_PASSWORD=$(openssl rand -hex 16)
export MONGODB_USERNAME="lvicapp"
export MONGODB_PASSWORD=$(openssl rand -hex 16)
export MONGODB_DATABASE="lvic"

# Base64 encode MongoDB credentials for K8s secrets
export MONGODB_ROOT_PASSWORD_BASE64=$(echo -n "$MONGODB_ROOT_PASSWORD" | base64)
export MONGODB_USERNAME_BASE64=$(echo -n "$MONGODB_USERNAME" | base64)
export MONGODB_PASSWORD_BASE64=$(echo -n "$MONGODB_PASSWORD" | base64)
export MONGODB_DATABASE_BASE64=$(echo -n "$MONGODB_DATABASE" | base64)

# AWX configuration
export AWX_ADMIN_PASSWORD=$(openssl rand -hex 16)
export AWX_ADMIN_PASSWORD_BASE64=$(echo -n "$AWX_ADMIN_PASSWORD" | base64)

# Validate MongoDB credentials
if [[ -z "$MONGODB_ROOT_PASSWORD" || -z "$MONGODB_USERNAME" || -z "$MONGODB_PASSWORD" ]]; then
    echo "Error: MongoDB credentials not properly set"
    exit 1
fi

# Generate inventory from Terraform
echo "Generating Ansible inventory..."
terraform -chdir=terraform/terraform-vm-provisioning output -raw ansible_inventory > inventory/vcenter/hosts.ini

# Save credentials and configuration to a secure file
CREDS_FILE="ansible/cluster-credentials.txt"
echo "# Cluster Credentials and Configuration - Generated on $(date)" > $CREDS_FILE
echo "" >> $CREDS_FILE

echo "## API Server" >> $CREDS_FILE
echo "Endpoint: $APISERVER_ENDPOINT" >> $CREDS_FILE
echo "K3s Token: $K3S_TOKEN" >> $CREDS_FILE
echo "" >> $CREDS_FILE

echo "## Network Configuration" >> $CREDS_FILE
echo "MetalLB IP Range: $METALLB_IP_RANGE" >> $CREDS_FILE
echo "" >> $CREDS_FILE

echo "## PostgreSQL" >> $CREDS_FILE
echo "Host: $postgresql_host" >> $CREDS_FILE
echo "Port: 5432" >> $CREDS_FILE
echo "User: $POSTGRES_USER" >> $CREDS_FILE
echo "Password: $POSTGRES_PASSWORD" >> $CREDS_FILE
echo "Database: $POSTGRES_DB" >> $CREDS_FILE
echo "" >> $CREDS_FILE

echo "## MongoDB" >> $CREDS_FILE
echo "Root Password: $MONGODB_ROOT_PASSWORD" >> $CREDS_FILE
echo "Application Username: $MONGODB_USERNAME" >> $CREDS_FILE
echo "Application Password: $MONGODB_PASSWORD" >> $CREDS_FILE
echo "Database: $MONGODB_DATABASE" >> $CREDS_FILE
echo "" >> $CREDS_FILE

echo "## Domains" >> $CREDS_FILE
echo "Innovation App: innovation.lvic-techlab.com" >> $CREDS_FILE
echo "Traefik Dashboard: traefik.lvic-techlab.com" >> $CREDS_FILE
echo "Documentation: docs.lvic-techlab.com" >> $CREDS_FILE
echo "AWX: awx.lvic-techlab.com" >> $CREDS_FILE
echo "" >> $CREDS_FILE

echo "## GitHub Configuration" >> $CREDS_FILE
echo "Owner: $FLUX_GITHUB_OWNER" >> $CREDS_FILE
echo "Repository: $FLUX_REPO_NAME" >> $CREDS_FILE
echo "" >> $CREDS_FILE

## Add AWX credentials to the credentials file
echo "## AWX" >> $CREDS_FILE
echo "Admin Username: admin" >> $CREDS_FILE
echo "Admin Password: $AWX_ADMIN_PASSWORD" >> $CREDS_FILE
echo "" >> $CREDS_FILE

# Set restrictive permissions on credentials file
chmod 600 $CREDS_FILE

# Deploy K3s cluster
echo "Deploying k3s cluster..."
ansible-playbook site.yml -i inventory/vcenter/hosts.ini

echo "K3s cluster deployment complete!" 