# Environment Configuration Guide

## Frontend Environment Variables

### Development (.env.local)
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (.env.production)
Create a `.env.production` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Backend Environment Variables

### Development (application.properties)
Located at `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:h2:file:./data/blog
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update

# H2 Console (Development only)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JWT Configuration
jwt.secret=your-secret-key-must-be-at-least-256-bits-long-for-security
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000

# Server
server.port=8080
```

### Production (application-prod.properties)
Create `backend/src/main/resources/application-prod.properties`:

```properties
# Production Database (PostgreSQL/MySQL)
spring.datasource.url=jdbc:postgresql://your-db-host:5432/blog_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# CORS
cors.allowed-origins=https://your-production-domain.com

# Server
server.port=8080

# Disable H2 Console in production
spring.h2.console.enabled=false
```

## Usage

### Frontend
The API client automatically uses `NEXT_PUBLIC_API_URL`:

```javascript
import { apiClient } from '@/lib/api-client';

// GET request
const posts = await apiClient.get('/api/posts');

// POST request
const newPost = await apiClient.post('/api/posts', { title: 'New Post' });
```

### Backend
Run with production profile:

```bash
java -jar backend.jar --spring.profiles.active=prod
```

## Security Notes

1. **Never commit** `.env.local` or `.env.production` to version control
2. Use strong JWT secrets (256+ bits)
3. Change default database passwords
4. Enable HTTPS in production
5. Set appropriate CORS origins
