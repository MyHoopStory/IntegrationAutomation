# Installation Guide

## Prerequisites

Before installing the Integration Automation System, ensure you have:

- Node.js 18+
- Python 3.9+
- Docker and Docker Compose
- PostgreSQL

## Docker Setup

The system uses Docker Compose for easy deployment. The main services are:

- Frontend (Next.js) - Port 3000
- Backend (Flask) - Port 5001
- TFTP Server - Port 69
- DHCP Server - Port 67/68

### Starting the Services

1. Clone the repository
2. Navigate to the project root
3. Start all services:
   ```bash
   docker compose up
   ```

## Development Setup

For local development without Docker:

1. Frontend Setup:
   ```bash
   cd my-app
   npm install
   npm run dev
   ```

2. Backend Setup:
   ```bash
   cd app
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   flask run
   ``` 