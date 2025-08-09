# Deployment Guide

This guide covers deploying the School Management API to various hosting platforms.

## Prerequisites

- Node.js application ready for deployment
- MySQL database (local or cloud)
- Git repository with your code

## 1. Heroku Deployment

### Setup
1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-school-api
   ```

4. **Add MySQL Addon**
   ```bash
   # Add ClearDB MySQL addon
   heroku addons:create cleardb:ignite
   
   # Or add JawsDB MySQL addon
   heroku addons:create jawsdb:kitefin
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=3000
   ```

6. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Environment Variables
```bash
# Get database URL
heroku config:get CLEARDB_DATABASE_URL
# or
heroku config:get JAWSDB_URL

# Set custom config
heroku config:set DB_HOST=your-host
heroku config:set DB_USER=your-user
heroku config:set DB_PASSWORD=your-password
heroku config:set DB_NAME=your-database
```

## 2. AWS EC2 Deployment

### Setup EC2 Instance
1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - t2.micro (free tier) or larger
   - Configure security groups (open ports 22, 80, 443, 3000)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MySQL
   sudo apt install mysql-server -y
   sudo mysql_secure_installation
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

4. **Setup MySQL**
   ```bash
   sudo mysql
   CREATE DATABASE school_management;
   CREATE USER 'school_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON school_management.* TO 'school_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd school-management-api
   
   # Install dependencies
   npm install
   
   # Create environment file
   cp env.example .env
   # Edit .env with your database credentials
   
   # Run database setup
   mysql -u school_user -p school_management < database_setup.sql
   
   # Start with PM2
   pm2 start server.js --name "school-api"
   pm2 startup
   pm2 save
   ```

6. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/school-api
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/school-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 3. DigitalOcean App Platform

### Setup
1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Choose Node.js environment

2. **Configure Environment**
   ```yaml
   # .do/app.yaml
   name: school-management-api
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/your-repo
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: DB_HOST
       value: your-db-host
     - key: DB_USER
       value: your-db-user
     - key: DB_PASSWORD
       value: your-db-password
     - key: DB_NAME
       value: your-db-name
   ```

3. **Add Database**
   - Create Managed MySQL Database
   - Connect to your app
   - Update environment variables

## 4. Railway Deployment

### Setup
1. **Connect Repository**
   - Go to Railway.app
   - Connect your GitHub repository

2. **Add Database**
   - Add MySQL plugin
   - Railway will automatically set environment variables

3. **Configure Environment**
   ```bash
   # Railway automatically detects Node.js
   # Add custom environment variables if needed
   ```

## 5. Docker Deployment

### Create Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=school_management
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=school_management
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database_setup.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

volumes:
  mysql_data:
```

### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 6. Environment Variables for Production

### Required Variables
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
```

### Optional Variables
```env
# CORS origins (comma-separated)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Logging level
LOG_LEVEL=info

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 7. SSL/HTTPS Setup

### Let's Encrypt (Nginx)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Heroku (Automatic)
- SSL is automatically enabled on custom domains
- No additional setup required

## 8. Monitoring and Logs

### PM2 Monitoring
```bash
# View processes
pm2 list

# Monitor resources
pm2 monit

# View logs
pm2 logs school-api

# Restart application
pm2 restart school-api
```

### Health Checks
```bash
# Test health endpoint
curl https://your-domain.com/health

# Test API endpoints
curl https://your-domain.com/
```

## 9. Backup Strategy

### Database Backup
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u your_user -p your_database > backup_$DATE.sql

# Add to crontab for daily backups
0 2 * * * /path/to/backup-script.sh
```

### Application Backup
- Use Git for version control
- Store environment variables securely
- Backup configuration files

## 10. Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Check environment variables
   - Verify database credentials
   - Ensure database is running

2. **Port Already in Use**
   - Check if another process is using port 3000
   - Change PORT environment variable

3. **Permission Denied**
   - Check file permissions
   - Ensure proper user access

4. **Memory Issues**
   - Monitor memory usage
   - Consider upgrading instance size
   - Optimize database queries

### Debug Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check running processes
ps aux | grep node

# Check port usage
netstat -tulpn | grep :3000

# Check logs
tail -f /var/log/nginx/error.log
``` 