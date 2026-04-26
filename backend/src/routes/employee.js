const router = require('express').Router();
const db = require('../db/index');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    try{
        const result = await db.query('SELECT employee.empl_id, employee.name, employee.email, employee.role, employee.dept_id, employee.is_active, department.name AS department_name FROM employee JOIN department ON employee.dept_id = department.dept_id');
        res.json(result.rows);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
})

module.exports = router;