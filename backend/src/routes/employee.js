const router = require('express').Router();
const db = require('../db/index');
const { verifyToken, requireRole } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Route to get all employess, admin only, requires valid JWT roken and checks if role = ADMIN
router.get('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    try{
        const result = await db.query('SELECT employee.empl_id, employee.name, employee.email, employee.role, employee.dept_id, employee.is_active, department.name AS department_name FROM employee JOIN department ON employee.dept_id = department.dept_id');
        res.json(result.rows);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
})
// Route to get employee by ID, requires valid JWT token
router.get('/:id', verifyToken, async (req, res) => {
    const employeeId = req.params.id;
    try{
        const result = await db.query('SELECT employee.empl_id, employee.name, employee.email, employee.role, employee.dept_id, employee.is_active, department.name AS department_name FROM employee JOIN department ON employee.dept_id = department.dept_id WHERE employee.empl_id = $1', [employeeId]);
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Employee not found'});
        }
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});
// Route to update employee details, admin only, requires valid JWT token and checks if role = ADMIN
router.patch('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const employeeId = req.params.id;
    const { name, email, role, dept_id, is_active } = req.body;
    try{
        const result = await db.query('UPDATE employee SET name = $1, email = $2, role = $3, dept_id = $4, is_active = $5 WHERE empl_id = $6 RETURNING empl_id, name, email, role, dept_id, is_active', [name, email, role, dept_id, is_active, employeeId]);
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }   
});
// Route to create new employee, admin only, requires valid JWT token and checks if role = ADMIN
router.post('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const {name, email, role, dept_id, is_active, password} = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    try{
        const result = await db.query('INSERT INTO employee (name, email, role, dept_id, is_active, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING empl_id, name, email, role, dept_id, is_active', [name, email, role, dept_id, is_active, password_hash]);
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

module.exports = router;