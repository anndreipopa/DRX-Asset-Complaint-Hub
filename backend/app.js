require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./src/db/index');

//global error handler import
const errorHandler = require('./src/middleware/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/api/auth', require('./src/modules/auth/auth.routes'));
app.use('/api/employees', require('./src/modules/employee/employee.routes'));
//app.use('/api/departments', require('./src/modules/department/department.routes'));


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

app.use(errorHandler);

//server start

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
})