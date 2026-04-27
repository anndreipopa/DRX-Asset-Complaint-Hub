const router = require('express').Router();
const db = require('../db/index');
const { verifyToken, requireRole } = require('../middleware/authMidleware');
const bcrypt = require('bcrypt');

// Route to get all employess, admin only, requires valid JWT roken and checks if role = ADMIN
router.get('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const result = await db.query('SELECT employee.empl_id, employee.name, employee.email, employee.role, employee.dept_id, employee.is_active, department.name AS department_name FROM employee JOIN department ON employee.dept_id = department.dept_id');
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Route to get employee by ID, requires valid JWT token
router.get('/:id', verifyToken, async (req, res) => {
    const employeeId = req.params.id;
    try {
        const result = await db.query('SELECT employee.empl_id, employee.name, employee.email, employee.role, employee.dept_id, employee.is_active, department.name AS department_name FROM employee JOIN department ON employee.dept_id = department.dept_id WHERE employee.empl_id = $1', [employeeId]);
        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Employee not found'});
        }
        res.json(result.rows[0]);
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Route to update employee details, admin only, requires valid JWT token and checks if role = ADMIN
router.patch('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const employeeId = req.params.id;
    const { name, email, role, dept_id, is_active } = req.body;
    try {
        // COALESCE keeps old value if new value is null or undefined
        const result = await db.query(
            'UPDATE employee SET name = COALESCE($1, name), email = COALESCE($2, email), role = COALESCE($3, role), dept_id = COALESCE($4, dept_id), is_active = COALESCE($5, is_active) WHERE empl_id = $6 RETURNING empl_id, name, email, role, dept_id, is_active', 
            [name, email, role, dept_id, is_active, employeeId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Employee not found'});
        }
        res.json(result.rows[0]);
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }   
});

// Route to create new employee, admin only, requires valid JWT token and checks if role = ADMIN
router.post('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const {name, email, role, dept_id, is_active, password} = req.body;
    try {
        if (!password) {
            return res.status(400).json({message: 'Password is required'});
        }
        const password_hash = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO employee (name, email, role, dept_id, is_active, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING empl_id, name, email, role, dept_id, is_active', 
            [name, email, role, dept_id, is_active ?? true, password_hash]
        );
        res.status(201).json(result.rows[0]);
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Route to soft delete an employee
router.delete('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const employeeId = req.params.id;
    try {
        const result = await db.query(
            'UPDATE employee SET is_active = FALSE WHERE empl_id = $1 RETURNING empl_id, name, is_active',
            [employeeId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Employee not found'});
        }
        res.json({ message: 'Employee deactivated successfully', employee: result.rows[0] });
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

module.exports = router;