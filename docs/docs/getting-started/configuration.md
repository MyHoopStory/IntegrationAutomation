# Database Configuration

## Development Environment (SQLite)

### Environment Variables
```env
# .env.development
FLASK_APP=app
FLASK_ENV=development
DATABASE_URL=sqlite:///dev.db
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

### Database Configuration
```python
# config.py
class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY')

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'
    DEBUG = True

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    DEBUG = False
```

### SQLite Setup
```python
# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Load the appropriate configuration
if os.getenv('FLASK_ENV') == 'development':
    app.config.from_object('config.DevelopmentConfig')
else:
    app.config.from_object('config.ProductionConfig')

db = SQLAlchemy(app)
```

## Production Environment (PostgreSQL)

When deploying to production, update your environment variables:

```env
# .env.production
FLASK_APP=app
FLASK_ENV=production
DATABASE_URL=postgresql://user:password@db:5432/project_db
SECRET_KEY=your-production-secret-key
CORS_ORIGINS=https://your-domain.com
```

### Migration from SQLite to PostgreSQL

1. Create a database backup:
```bash
# Export SQLite data
python manage.py db-export data.json

# Import to PostgreSQL
python manage.py db-import data.json
```

2. Update docker-compose.yml for production:
```yaml
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: project_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

The models defined in `app/models.py` will work with both SQLite and PostgreSQL without modification, as SQLAlchemy handles the database abstraction.

## Database Migrations

Migrations work the same way for both databases:

```bash
# Initialize migrations
flask db init

# Create a migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade
``` 