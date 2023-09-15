# 1. create a CSV to JSON Converter API AND STORE IN POSTGRESQL
# 2. Calculate Age distribution from table

Steps to run the projects: 
1. Run `npm init` command in the project directory 

2. Install all the required packages -- express,pg,fs,csv-pars,dotenv,csv-parser,pg-promise
using command `npm install package-name`

3. Creating a .env file for accessing csv file and database from the local. Please specify each variable

4. Run the following commands in order in the directory:
            1. node Postgres_table.js
            2. node csv_postgres.js
            3. node age_distribution.js

Note: Only after you run the application on `localhost:3002/age-distribution`, you will be able to see the age distribution table on console and the website too.

