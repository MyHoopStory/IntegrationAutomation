# API Reference

## Project Endpoints

### Get All Projects
```http
GET /projects
```

Returns a list of all projects with their associated data.

#### Response
```json
[
  {
    "name": "string",
    "backup_schedule": "string",
    "maintenance_windows": "string",
    "windows_2003_sql_2005_vm_needed": boolean,
    "wsus_update_strategy": "string",
    "vlans": [
      {
        "name": "string",
        "vlan_id": "string",
        "network": "string",
        "gateway_ip": "string",
        "is_igt_switch_gateway": boolean,
        "dhcp_scopes": "string",
        "dhcp_ip_helper_ip": "string"
      }
    ],
    "vsans": [
      {
        "name": "string",
        "vlan": "string"
      }
    ],
    "vms": [
      {
        "name": "string",
        "vlan_id": "string",
        "network": "string",
        "default_gateway": "string",
        "gateway_location": "string"
      }
    ]
  }
]
```

### Create Project
```http
POST /projects
```

Creates a new project with the provided data.

#### Request Body
```json
{
  "name": "string",
  "backup_schedule": "string",
  "maintenance_windows": "string",
  "windows_2003_sql_2005_vm_needed": boolean,
  "wsus_update_strategy": "string",
  "vlans": [...],
  "vsans": [...],
  "vms": [...]
}
```

#### Response
```json
{
  "id": "integer",
  "message": "Project created successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Description of the error"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error",
  "details": "Description of the error"
}
```

## Data Validation

The API performs the following validations:
- Required fields must be present
- Data types must match the schema
- Network addresses must be valid
- VLAN IDs must be unique within a project

## Authentication

Currently, the API endpoints are not authenticated. Future implementations will include:
- JWT authentication
- Role-based access control
- API key management 