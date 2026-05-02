# Trade Reporter - Deployment Guide

This guide covers deploying Trade Reporter to various platforms and environments.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Platforms](#cloud-platforms)
4. [Production Configuration](#production-configuration)
5. [Monitoring & Maintenance](#monitoring--maintenance)

## Local Development

### Quick Start

```bash
# Backend
cd trade-transaction-reporter
mvn clean install
mvn spring-boot:run

# Frontend (in another terminal)
cd trade-reporter-frontend
pnpm install
echo "VITE_API_URL=http://localhost:8080/api" > .env.local
pnpm dev
```

Access the application at `http://localhost:3000`

## Docker Deployment

### Backend Docker Setup

Create `trade-transaction-reporter/Dockerfile`:

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/trade-transaction-reporter-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:

```bash
cd trade-transaction-reporter
mvn clean package
docker build -t trade-reporter-backend:latest .
docker run -p 8080:8080 trade-reporter-backend:latest
```

### Frontend Docker Setup

Create `trade-reporter-frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `trade-reporter-frontend/nginx.conf`:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:8080/api;
    }
}
```

Build and run:

```bash
cd trade-reporter-frontend
docker build -t trade-reporter-frontend:latest .
docker run -p 3000:80 trade-reporter-frontend:latest
```

### Docker Compose

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./trade-transaction-reporter
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    networks:
      - trade-network

  frontend:
    build:
      context: ./trade-reporter-frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - trade-network

networks:
  trade-network:
    driver: bridge
```

Run with Docker Compose:

```bash
docker-compose up -d
```

## Cloud Platforms

### AWS Elastic Beanstalk

**Backend Deployment:**

```bash
cd trade-transaction-reporter
mvn clean package

# Install EB CLI
pip install awsebcli

# Initialize and deploy
eb init -p java-17 trade-reporter
eb create trade-reporter-env
eb deploy
```

**Frontend Deployment (S3 + CloudFront):**

```bash
cd trade-reporter-frontend
pnpm build

# Create S3 bucket
aws s3 mb s3://trade-reporter-frontend

# Upload files
aws s3 sync dist s3://trade-reporter-frontend --delete

# Create CloudFront distribution (via AWS Console)
```

### Heroku

**Backend Deployment:**

```bash
cd trade-transaction-reporter

# Create Procfile
echo "web: java -Dserver.port=\$PORT \$JAVA_OPTS -jar target/*.jar" > Procfile

# Deploy
heroku create trade-reporter-api
git push heroku main
```

**Frontend Deployment:**

```bash
cd trade-reporter-frontend

# Create Procfile
echo "web: npm install -g serve && serve -s dist -l \$PORT" > Procfile

# Deploy
heroku create trade-reporter-frontend
git push heroku main
```

### Vercel

**Frontend Deployment:**

```bash
cd trade-reporter-frontend
npm install -g vercel
vercel --prod
```

Configure environment variables in Vercel dashboard:
- `VITE_API_URL`: Your production backend URL

### Netlify

**Frontend Deployment:**

```bash
cd trade-reporter-frontend
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Production Configuration

### Backend Production Setup

Create `trade-transaction-reporter/src/main/resources/application-prod.properties`:

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database (replace with your database)
spring.datasource.url=jdbc:mysql://db-host:3306/trade_reporter
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Logging
logging.level.root=INFO
logging.level.com.example.tradereporter=INFO
logging.file.name=logs/application.log

# CORS
cors.allowed-origins=https://yourdomain.com
```

Run with production profile:

```bash
java -Dspring.profiles.active=prod -jar trade-transaction-reporter-0.0.1-SNAPSHOT.jar
```

### Frontend Production Setup

Create `.env.production`:

```
VITE_API_URL=https://api.yourdomain.com/api
```

Build for production:

```bash
pnpm build
```

### SSL/TLS Configuration

**For Nginx reverse proxy:**

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

## Monitoring & Maintenance

### Backend Monitoring

**Health Check Endpoint:**

```bash
curl http://localhost:8080/actuator/health
```

**Logs:**

```bash
# Docker
docker logs -f <container-id>

# Traditional
tail -f logs/application.log
```

### Frontend Monitoring

**Performance Monitoring:**

```javascript
// Add to client/src/main.tsx
if (import.meta.env.PROD) {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}
```

### Database Backups

**MySQL Backup:**

```bash
mysqldump -u user -p database_name > backup.sql
```

**Restore:**

```bash
mysql -u user -p database_name < backup.sql
```

### Security Updates

**Update Dependencies:**

```bash
# Backend
cd trade-transaction-reporter
mvn versions:display-dependency-updates

# Frontend
cd trade-reporter-frontend
pnpm outdated
```

## Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Find process
lsof -i :8080
# Kill process
kill -9 <PID>
```

**CORS Errors:**
- Verify backend CORS configuration
- Check frontend API URL configuration
- Ensure both services are accessible

**Database Connection Issues:**
- Verify database credentials
- Check network connectivity
- Ensure database service is running

**Build Failures:**
```bash
# Backend
mvn clean install -U

# Frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

For more information, see README.md and SETUP_GUIDE.md
