# Quick Setup Guide

Get your School Management API running in 5 minutes!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
# Copy environment file
cp env.example .env

# Edit .env with your database credentials
# Example:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

### 3. Set Up MySQL Database
```bash
# Option A: Use the provided SQL script
mysql -u root -p < database_setup.sql

# Option B: Manual setup
mysql -u root -p
CREATE DATABASE school_management;
USE school_management;
# Run the CREATE TABLE statement from database_setup.sql
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Test the API
```bash
# Install axios for testing
npm install axios

# Run the test script
node test_api.js
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API documentation |
| POST | `/addSchool` | Add a new school |
| GET | `/listSchools` | List schools by proximity |
| GET | `/school/:id` | Get school by ID |

## 🧪 Test with cURL

### Health Check
```bash
curl http://localhost:3000/health
```

### Add School
```bash
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MIT",
    "address": "Cambridge, MA 02139, USA",
    "latitude": 42.3601,
    "longitude": -71.0589
  }'
```

### List Schools
```bash
curl "http://localhost:3000/listSchools?latitude=42.3601&longitude=-71.0589"
```

## 📱 Postman Collection

Import the `School_Management_API.postman_collection.json` file into Postman for easy testing.

## 🔧 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 3000

### Validation Errors
- Check request format
- Ensure all required fields are provided
- Verify coordinate ranges (lat: -90 to 90, lon: -180 to 180)

## 📚 Next Steps

1. **Deploy to Production**: See `DEPLOYMENT.md`
2. **Add Authentication**: Implement JWT tokens
3. **Add Rate Limiting**: Implement request throttling
4. **Add Caching**: Implement Redis for performance
5. **Add Tests**: Write unit and integration tests

## 🆘 Need Help?

- Check the full `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for hosting options
- Open an issue on GitHub for bugs or questions 