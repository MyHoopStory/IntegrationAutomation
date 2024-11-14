#!/bin/bash
set -e

# Get the node token from the master node
MASTER_IP="10.77.250.220"
BACKUP_DIR="./backups/k3s"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup the token with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ssh serveradmin@${MASTER_IP} "sudo cat /var/lib/rancher/k3s/server/node-token" > "${BACKUP_DIR}/node-token_${TIMESTAMP}"

# Encrypt the backup
gpg --encrypt --recipient your@email.com "${BACKUP_DIR}/node-token_${TIMESTAMP}"
rm "${BACKUP_DIR}/node-token_${TIMESTAMP}"

echo "K3s token backed up and encrypted to: ${BACKUP_DIR}/node-token_${TIMESTAMP}.gpg" 