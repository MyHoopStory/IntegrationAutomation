# Frontend Architecture

## Component Structure

The frontend is built using Next.js with a modular component structure:

### Core Pages

1. Home Page (`page.js`)

   - Simple navigation interface
   - Links to main functions
2. Project Creation (`create-project/page.js`)

   - Complex form handling
   - Dynamic component tables
   - State management for multiple data types
3. Project List (`projects/page.js`)

   - Project data display
   - Data sanitization
   - List management

## State Management

The project creation form uses React's useState for managing:

- Form data
- Dynamic tables (VLANs, VSANs, VMs)
- Temporary entry states

### Data Structure

```javascript
const formData = {

// Basic Info

name: string,

shipping_address: object,

shipping_contact: object,

// Network Components

vlans: array,

vsans: array,

vms: array

}
```

## API Integration

The frontend communicates with the Flask backend through axios:

- POST requests for project creation
- GET requests for project listing
- Data sanitization before display

## Styling

Styles are managed through CSS modules (`shared.module.css`):

- Consistent styling across components
- Responsive design
- Table layouts for data display
