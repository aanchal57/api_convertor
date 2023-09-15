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

// CSV parser
const csv = require('csv-parser');
const fs = require('fs');
const { parse } = require("csv-parse");

    
    // Read and process the CSV file
fs.readFile(csvFilePath, 'utf8', async (err, data) => {
      if (err) {
        console.error('Error reading CSV file:', err);
        return;
      }
    
      const lines = data.trim().split('\n');
      const jsonDataArray = [];
      const userhead=lines[0].split(',');
      //console.log(userhead)
      lines.shift()
      for (const line of lines) {
        const myobj= line.split(',');
        var user_name=myobj[0]+myobj[1]
        var user_age=myobj[2]
        const user_address={
          "line1":myobj[3],
          "line2":myobj[4],
          "city":myobj[5],
          "state":myobj[6]
        }
        const add_info={}
        for(let i=7;i<myobj.length;i++){
            
            add_info[userhead[i].replace(/(\r)/gm,"")]=myobj[i].replace(/(\r)/gm,"");
            
        }
        jsonDataArray.push({
          users_name:user_name,
          age:user_age,
          address:user_address,
          additional_info:add_info
        });
      }
      const client = await pool.connect();
      try {
        
        await client.query('BEGIN');
    
        // Insert data into the PostgreSQL table
        for (const jsonData of jsonDataArray) {
          const query =`INSERT INTO public.users (name, age, address,additional_info)
              VALUES ($1, $2, $3, $4)`;

            const values = [jsonData.users_name, jsonData.age,jsonData.address,jsonData.additional_info]

            await client.query(query, values);
        }
        await client.query('COMMIT');
        console.log('Data inserted successfully.');
        } catch (error) {
          console.error('Error inserting data:', error);
          await client.query('ROLLBACK');
        } finally {
          client.release();
        }     
});
    

