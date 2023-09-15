require('dotenv').config();
const dbUser= process.env.DB_USER;
const dbHost= process.env.DB_HOST;
const dbPort= process.env.DB_PORT;
const dbPassword= process.env.DB_PASSWORD;
const dbDatabase=process.env.DB_NAME;


const express = require('express');
const bodyParser=require('body-parser');
const app = express();

const port = 3002;
const csvFilePath = process.env.CSV_FILE_PATH;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

const pgp = require('pg-promise')();
const db = pgp({
  user: dbUser,
  password: dbPassword,
  host: dbHost,
  port: dbPort,
  database: dbDatabase,
});

async function calculateAgeDistribution() {
    const query = `
    SELECT
    age_group,
    ROUND((COUNT(*) * 100.0 / total_age_groups.total_count),2) AS distribution_percent
  FROM
    (
      SELECT
        CASE
          WHEN age BETWEEN 0 AND 18 THEN '0-19'
          WHEN age BETWEEN 19 AND 30 THEN '20-40'
          WHEN age BETWEEN 31 AND 50 THEN '41-60'
          ELSE '60+'
        END AS age_group
      FROM
        public.users
    ) AS age_groups,
    (
      SELECT COUNT(*) AS total_count FROM public.users
    ) AS total_age_groups
  GROUP BY
    age_group, total_age_groups.total_count
  ORDER BY
    age_group;
`  
  
    const result = await db.any(query);
    return result;
  }
  
  // Define a route to upload and store CSV data
  app.get('/age-distribution', async (req, res) => {
    try {
      const ageDistribution = await calculateAgeDistribution();
      console.log('Age Distribution:', ageDistribution);
      res.json(ageDistribution);
    } catch (error) {
      console.error('Error calculating age distribution:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });