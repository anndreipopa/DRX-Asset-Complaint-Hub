const router = require('express').Router();
const db = require('../db/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.post('/login', async (req, res) => {
    try{
        const result = await db.query('SELECT * FROM employee WHERE email = $1', [req.body.email]);
        if(result.rows.length === 0){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const employee = result.rows[0];
        const isMatch = await bcrypt.compare(req.body.password, employee.password_hash);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({id: employee.empl_id, name: employee.name, email: employee.email, role: employee.role, dept: employee.dept_id}, process.env.JWTSECRET, {expiresIn: '8h'});
        res.json({token,
            user: {
                id: employee.empl_id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                dept: employee.dept_id
            }   
    });
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }

});

module.exports = router;