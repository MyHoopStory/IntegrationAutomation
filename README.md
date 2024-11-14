# Integration Automation System

A comprehensive automation system for network integration projects, combining React frontend with Python/Flask backend, featuring AI-powered document processing and automated network provisioning.

## Summary

**Project Title:** Integration Automation System

**Technologies Involved:**

- **Front-End:** React/Next.js for building a modern web application with dynamic form handling and real-time validation
- **Back-End:** Python with Flask framework for RESTful API endpoints and business logic
- **Database:** SQLite for development, PostgreSQL for production
- **Automation:** Ansible for network configuration and VM provisioning
- **AI:** Ollama for document parsing and form field automation
- **Documentation:** MkDocs for automated documentation generation

**Process Overview:**

1.**User Portal Access:** Users access the web portal to create and manage network integration projects

2.**Document Processing:** Document parsing and form field automation (AI-powered features coming soon)

3.**Project Configuration:** Users input or validate project details including:

- Network configurations (VLANs, VSANs)
- Server requirements and maintenance windows
- Infrastructure specifications
- Backup schedules and update strategies

4.**Automation Pipeline:**

- Zero-Touch Provisioning (ZTP) for network devices
- Automated network configuration via Ansible
- Virtual infrastructure deployment through vCenter
- Network services configuration (DHCP, TFTP, DNS)

5.**Documentation Generation:** Automated creation of project documentation and network diagrams

**Outcome:**

The Integration Automation System reduces manual configuration tasks, minimizes human error, and standardizes network integration processes across projects.

## User Workflow

1. **Initial Project Setup**

   - Log into the web portal
   - Create a new integration project
   - Upload customer network documentation (if available)
2. **Document Processing & Configuration**

   - System automatically extracts network configurations from uploaded documents *
   - Review and validate extracted information
   - Manually input or adjust configuration details:
     * Network settings (VLANs, IP ranges)
     * Server configurations
3. **Infrastructure Configuration**

   - Configure network devices
   - Set up virtual machines
4. **Automation & Deployment**

   - System generates Ansible playbooks
   - Initiates Zero-Touch Provisioning (ZTP)
   - Deploys virtual infrastructure
   - Configures network devices
5. **Validation & Documentation**

   - System performs automated testing
   - Validates network connectivity
   - Verifies server configurations
   - Generates as-built documentation
   - Creates network diagrams
6. **Ongoing Management**

   - Monitor deployment status
   - View system health metrics
   - Access generated documentation
   - Track configuration changes

*Automatic document parsing and form completion via A.I. coming soon

## Core Features

- Project management portal
- Document parsing (AI features coming soon)
- Network configuration automation
- Zero-Touch Provisioning (ZTP)
- Automated documentation generation

## Tech Stack

- **Frontend**: Next.js/React
- **Backend**: Python/Flask
- **Database**: PostgreSQL
- **Automation**: Ansible, Python scripts, Terraform, AWX
- ****AI**: **Ollama **(coming soon)**
- **Documentation**: MkDocs

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker and Docker Compose
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone [your-repo-url]
```

2. Start the development environment:

```bash
docker compose up
```

3. Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Documentation: http://localhost:8000

## Development Guidelines

### Setting Up Development Environment

1. Follow the installation steps above
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Testing

- Run existing tests before submitting changes
- Add tests for new features
- Test in development environment before deploying

### Deployment

- Merge changes to main branch only after review
- Follow company deployment procedures
- Update documentation if needed

For questions about development, contact the project maintainers.

## Documentation

Full documentation is available in the `/docs` directory and can be accessed through MkDocs at http://localhost:8000 or docs.lvic-techlab.com when running locally.
