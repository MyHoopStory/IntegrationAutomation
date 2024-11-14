# Applications Overview

## System Architecture

Our system consists of several interconnected applications:

### Core Services

1. Frontend Application (Next.js)

   - User interface for project management
   - Network configuration forms
   - Status monitoring dashboards
2. Backend Service (Flask)

   - REST API endpoints
   - Business logic processing
   - Automation orchestration
3. Database (PostgreSQL)
   (referencing docs/docs/developer-guide/database.md, startLine: 5, endLine: 6)

### Supporting Services

1. Network Services

   - DHCP Server
   - TFTP Server
   - DNS Management
2. Automation Services

   - Ansible Controller
   - Kubernetes Cluster
   - Flux CD

## Deployment Architecture

- Containerized applications
- Kubernetes orchestration
- Load balanced services
- High availability configuration

## Integration Points

- API Gateway
- Message Queue
- Shared Storage
- Monitoring Stack
