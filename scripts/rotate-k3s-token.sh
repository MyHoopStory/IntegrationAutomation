#!/bin/bash
set -e

# Generate new token
NEW_TOKEN=$(openssl rand -hex 32)

# Update the token on master node
ansible-playbook rotate-token.yml \
  -i inventory/vcenter/hosts.ini \
  --extra-vars "new_k3s_token=${NEW_TOKEN}"

# Backup the new token
./scripts/backup-k3s-token.sh 