#!/bin/bash

# Set vCenter credentials
VCENTER_SERVER="https://10.77.248.50"
VCENTER_USER="ansible@vsphere.local"
VCENTER_PASSWORD="Password@123"

# Obtain session token
SESSION_TOKEN=$(curl -s -k -u "$VCENTER_USER:$VCENTER_PASSWORD" -X POST "$VCENTER_SERVER/rest/com/vmware/cis/session" | jq -r '.value')

# Export the token to the environment variable
export VMWARE_SESSION_TOKEN="$SESSION_TOKEN"

# Output the token to confirm it was obtained
echo "Token obtained: $VMWARE_SESSION_TOKEN"
