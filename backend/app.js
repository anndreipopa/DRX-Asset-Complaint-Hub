require('dotenv').config();

//import express
const express = require('express');
//import cors
const cors = require('cors');
//import db connection from db/index.js
const db = require('./src/db/index')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//health check

app.get('/health', async(req, res) =>{
    try {
        const result = await db.query('SELECT COUNT(*) FROM employee');
        res.json({
            status: 'OK',
            employees_in_database: result.rows[0].count
        });
    } catch(err){
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
});

//server start

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
})