const app = require('./app');
const { initDB } = require('./configs/db');
const port = process.env.PORT || 3200;

async function startServer() {
  try {
    // Initialize database pool from AWS Secrets Manager before starting the app
    await initDB();

    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database initialization error.");
    process.exit(1);
  }
}

startServer();