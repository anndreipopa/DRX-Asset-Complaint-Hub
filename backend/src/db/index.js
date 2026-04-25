const { Pool } = require('pg');
require('dotenv').config();


//connection pool config

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

//test connection at startup

pool.connect((err, client, release) => {
    if(err){
        console.error('DB connection failed:'. err.message); //error if something went wrong
    } else {
        console.log('DB connection success');
        release(); //return connection back to the pool
    }
});

// export "query" function to be used everywhere

module.exports = {
    query: (text, params) => pool.query(text, params)
}