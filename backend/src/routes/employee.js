const router = require('express').Router();
const db = require('../db/index');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');

const VALID_ROLES = ['USER', 'TECHNICIAN', 'DEPT_RESPONSIBLE', 'ADMIN'];

//function to handle database errors and return informative error messages
function databaseErrorHandling(err, res) {
    if (err.code === '23505'){
        return res.status(400).json({message: 'This value already exists'});
    }
    if (err.code === '23503') {
        return res.status(400).json({message: 'Referenced record does not exist'});
    }
    return res.status(500).json({message: 'Server error', error: err.message});
}

// Route to get all employes, only the admin has access to this route
router.get('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const employees = await db.query('SELECT employee.empl_id, employee.name, employee.email, employee.role, employee.dept_id, employee.is_active, employee.created_at, department.name AS department_name FROM employee JOIN department ON employee.dept_id = department.dept_id ORDER BY employee.name ASC');
        res.json(employees.rows);
    } catch(err) {
        databaseErrorHandling(err, res);
    }
});

//Returning all employees in the same department as the requesting user
router.get('/my-department', verifyToken, requireRole(['DEPT_RESPONSIBLE', 'TECHNICIAN', 'ADMIN']), async(req, res) => {
    try {
        const employees = await db.query('SELECT employee.empl_id, employee.name, employee.email, employee.is_active, employee.created_at, department.name AS department_name FROM employee JOIN department on employee.dept_id = department.dept_id WHERE employee.dept_id = $1 ORDER BY employee.name ASC', [req.user.dept_id]); // dept_id comes from the jwt token, can't be manipulated by user

        if(employees.rows.length === 0){
            return res.status(404).json({message: 'No employees found in department'});
        }
        res.json(employees.rows);
    } catch(err){
        databaseErrorHandling(err, res);
    }
})


//Get single employee by ID, can be done by any authenthicated user
//Is used for profile pages and complaint pages
router.get('/:id', verifyToken, async (req, res) => {
    const employeeId = req.params.id;
    try {
        const employee = await db.query('SELECT employee.empl_id, employee.name, employee.email, employee.role, employee.dept_id, employee.is_active, employee.created_at, department.name AS department_name FROM employee JOIN department ON employee.dept_id = department.dept_id WHERE employee.empl_id = $1', [employeeId]);
        if (employee.rows.length === 0) {
            return res.status(404).json({message: 'Employee not found'});
        }
        res.json(employee.rows[0]);
    } catch(err) {
        databaseErrorHandling(err, res);
    }
});

//Update employee details
router.patch('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const employeeId = req.params.id;
    const { name, email, role, dept_id, is_active } = req.body;

    if(role && !VALID_ROLES.includes(role)){
        return res.status(400).json({message: 'Invalid role'});
    }

    //check for duplicate email if email is b eing changed
    //exludes current user from check
    if(email){
        try{
            const existing = await db.query('SELECT empl_id FROM employee where EMAIL = $1 AND empl_id != $2', [email, employeeId]);
            if(existing.rows.length > 0) {
                return res.status(400).json({message: 'Email already in use by an employee'});
                }
            } catch(err){
                return databaseErrorHandling(err, res);
            }
        }
    
    try {
        // COALESCE keeps old value if new value is null or undefined
        const updated = await db.query(
            'UPDATE employee SET name = COALESCE($1, name), email = COALESCE($2, email), role = COALESCE($3, role), dept_id = COALESCE($4, dept_id), is_active = COALESCE($5, is_active) WHERE empl_id = $6 RETURNING empl_id, name, email, role, dept_id, is_active', 
            [name, email, role, dept_id, is_active, employeeId]
        );
        if (updated.rows.length === 0) {
            return res.status(404).json({message: 'Employee not found'});
        }
        res.json(updated.rows[0]);
    } catch(err) {
        databaseErrorHandling(err, res);
    }   
});

//Create a new employee, used only by admin
router.post('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const {name, email, role, dept_id, is_active, password} = req.body;
    //validate all required field before db query
    if(!name || !email || !role || !dept_id || !password){
        return res.status(400).json({message: 'Missing required fields'});
    }
    if(!VALID_ROLES.includes(role)){
        return res.status(400).json({message: 'Invalid role'})
    }

    try {
        const existing = await db.query('SELECT empl_id FROM employee WHERE email = $1', [email]);
        if(existing.rows.length > 0){
            return res.status(400).json({message: 'An employee with this email already exists'});
        }
        const password_hash = await bcrypt.hash(password, 10);
        const created = await db.query(
            'INSERT INTO employee (name, email, role, dept_id, is_active, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING empl_id, name, email, role, dept_id, is_active', 
            [name, email, role, dept_id, true, password_hash]
        );
        res.status(201).json(created.rows[0]);
    } catch(err) {
        databaseErrorHandling(err, res);
    }
});

// Soft delete an employee, it keeps complaint history
router.delete('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const employeeId = req.params.id;
    if(parseInt(employeeId) === req.user.id){
        return res.status(400).json({message: 'You cannot deactivate your own account'});
    }

    try {
        const deactivated = await db.query(
            'UPDATE employee SET is_active = FALSE WHERE empl_id = $1 RETURNING empl_id, name, is_active',
            [employeeId]
        );
        if (deactivated.rows.length === 0) {
            return res.status(404).json({message: 'Employee not found'});
        }
        res.json({ message: 'Employee deactivated successfully', employee: deactivated.rows[0] });
    } catch(err) {
        databaseErrorHandling(err, res);
    }
});

module.exports = router;