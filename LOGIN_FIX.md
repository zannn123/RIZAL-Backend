# Login Fix Documentation

## Issues Fixed

1. **Database Not Initialized**: The database tables and admin user were not being created automatically on startup.
   - Created `init_db.py` script to initialize the database
   - Added `entrypoint.sh` to run database initialization before starting the application
   - Updated `Dockerfile` to use the entrypoint script

2. **Missing Environment Variables**: Admin credentials and SECRET_KEY were not configured.
   - Created `.env` file in Backend folder with default credentials
   - Updated `security.py` to load SECRET_KEY from environment variables
   - Updated `docker-compose.yml` to pass ADMIN_EMAIL and ADMIN_PASSWORD to the backend container

3. **Database Connection Issues**: The backend container was not waiting for the database to be ready.
   - Added health checks to `docker-compose.yml`
   - Updated backend service to depend on database health check
   - Added wait_for_db logic in `init_db.py` to retry database connection

## Default Login Credentials

Once the system starts, you can log in with:

- **Email**: `admin@university.edu`
- **Password**: `AdminPass123!`

## How to Start the System

### Using Docker Compose

```bash
cd /path/to/VALID8_DOCKER_FINAL
docker-compose up --build
```

This will:
1. Start PostgreSQL database
2. Create all database tables
3. Seed default roles (student, ssg, event-organizer, admin)
4. Create the default admin user
5. Start the FastAPI backend on http://localhost:8000
6. Start the React frontend on http://localhost:5173

### Verify Everything is Working

1. **Check Backend Health**: Open http://localhost:8000/health
   - Should show: `{"status": "healthy", "face_recognition_available": ...}`

2. **Check API Docs**: Open http://localhost:8000/docs
   - Should show Swagger UI with all available endpoints

3. **Try Login**: Open http://localhost:5173 (frontend)
   - Use the default admin credentials above
   - Should be redirected to admin dashboard

## Login Endpoints

### 1. Email/Password Login
- **Endpoint**: `POST /login`
- **Body**: 
  ```json
  {
    "email": "admin@university.edu",
    "password": "AdminPass123!"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "email": "admin@university.edu",
    "roles": ["admin"],
    "user_id": 1,
    "first_name": "System",
    "last_name": "Administrator"
  }
  ```

### 2. Face Recognition + Password Login
- **Endpoint**: `POST /login/face`
- **Body**:
  ```json
  {
    "image_data": "base64_encoded_image",
    "password": "AdminPass123!",
    "source": "base64",
    "threshold": 0.6
  }
  ```

### 3. OAuth2 Token Endpoint
- **Endpoint**: `POST /token`
- **Body**: (Form data)
  - `username`: admin@university.edu
  - `password`: AdminPass123!

## Troubleshooting

### Issue: "Cannot connect to container"
- Make sure Docker Desktop is running
- Check if ports 5432, 8000, and 5173 are not blocked
- Try: `docker-compose logs` to see error messages

### Issue: "Database connection refused"
- Wait 30-60 seconds for the database to initialize
- Check database health: `docker exec postgres-db pg_isready -U postgres`

### Issue: "Login fails with 'Incorrect email or password'"
- Verify the admin user was created: Check docker logs `docker-compose logs backend`
- Look for "✅ Admin user created successfully" message
- Make sure you're using the exact credentials: `admin@university.edu` / `AdminPass123!`

### Issue: "CORS error when trying to login from frontend"
- CORS is enabled for all origins (`"*"`) in the backend
- Check that the frontend is using the correct API URL: `http://localhost:8000`

## Environment Variables

You can customize the following in `Backend/.env`:

- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_EMAIL`: Email for the default admin user
- `ADMIN_PASSWORD`: Password for the default admin user
- `SECRET_KEY`: JWT signing key (important for production)

## API Testing

You can test the login endpoint using curl:

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "AdminPass123!"
  }'
```

Or use the Swagger UI at http://localhost:8000/docs

## Next Steps

1. Log in with the default credentials
2. Create additional users and assign roles
3. Configure the system for your use case
4. Update the SECRET_KEY in production

---

For more information, see the other documentation files in the project root.
