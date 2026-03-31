# Building and Running the 3-Tier Application

This guide provides the simple Docker commands required to build and run the backend and frontend containers for this application.

## 1. Backend

The backend container connects to an AWS Secrets Manager to retrieve your database credentials. 
*Note: Ensure your database is already populated using the `backend/db.sql` script.*

### Build the Backend Image
```bash
cd backend
docker build -t app-backend .
```

### Run the Backend Container
```bash
# Maps port 3200 from the container to port 3200 on the host machine
docker run -d --name my-backend -p 3200:3200 app-backend
```

## 2. Frontend

The frontend container builds a React application and serves it via Nginx. It is configured to securely act as a reverse proxy for your API traffic.

### Build the Frontend Image
```bash
cd frontend
docker build -t app-frontend .
```

### Run the Frontend Container
When running the frontend container, you **must** replace `<BACKEND_IP>` with the actual private IP address or Docker internal hostname of your running backend container (e.g., `172.16.11.250`).

```bash
# Maps port 80 from the container to port 80 on the host machine
# Injects the proxy routing variables at runtime
docker run -d --name my-frontend -p 80:80 \
  -e VITE_API_URL="/api" \
  -e BACKEND_URL="http://<BACKEND_IP>:3200/api/" \
  app-frontend
```

## 3. Database Initialization Check

If you receive a `500 Server Error` indicating that a table is missing (like `react_node_app.book`), you must initialize your AWS RDS instance schema using the provided SQL file:

```bash
mysql -h <YOUR_RDS_ENDPOINT> -u dbadmin -p < backend/db.sql
```
