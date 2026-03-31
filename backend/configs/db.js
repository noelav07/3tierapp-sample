const mysql = require('mysql2');
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const secret_name = "library/prod/dbcreds";
const region = "ap-south-1";

const client = new SecretsManagerClient({ region });

let pool;

/**
 * Initializes the database connection pool by fetching credentials from AWS Secrets Manager.
 */
async function initDB() {
    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT",
            })
        );

        const credentials = JSON.parse(response.SecretString);

        pool = mysql.createPool({
            host: credentials.host,
            user: credentials.username || credentials.user || 'dbadmin',
            password: credentials.password,
            database: credentials.dbname || credentials.database || 'react_node_app',
            port: credentials.port || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("Database connection pool initialized with credentials from AWS Secrets Manager.");
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
}

/**
 * Executes a SQL query using the connection pool.
 */
function query(sql, params, callback) {
    if (!pool) {
        const err = new Error("Database pool not initialized. Call initDB() first.");
        if (callback) return callback(err);
        throw err;
    }
    return pool.query(sql, params, callback);
}

module.exports = {
    initDB,
    query
};