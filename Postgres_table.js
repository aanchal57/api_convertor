require('dotenv').config();



const port = 3001;
const csvFilePath = process.env.CSV_FILE_PATH;

// PostgreSQL configuration
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// Define a function to create the table with a specific structure
pool.connect();
async function createTable() {
    try {
      await pool.query(`        
            CREATE TABLE IF NOT EXISTS public.users (
            "name" varchar NOT NULL, 
            age int4 NOT NULL,
            address jsonb NULL,
            additional_info jsonb NULL,
            id serial4 NOT NULL
          -- Add more columns as needed
        );
      `);
      console.log(`Table created successfully.`);
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

createTable();