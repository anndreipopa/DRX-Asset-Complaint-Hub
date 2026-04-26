const router = require('express').Router();
const db = require('../db/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.post('/login', async (req, res) => {
    try{
        //waits for result from db query checking if email exists uses parameterized query to prevent SQL injection
        const result = await db.query('SELECT * FROM employee WHERE email = $1', [req.body.email]);
        // return generic invalid credentials message, without exposing whether email or password was wrong
        if(result.rows.length === 0){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const employee = result.rows[0];
        //compare provided password with stored hash using bcrypt
        const isMatch = await bcrypt.compare(req.body.password, employee.password_hash);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        //generate JWT token with employee info, sign with secret key and set expiration
        const token = jwt.sign({id: employee.empl_id, name: employee.name, email: employee.email, role: employee.role, dept: employee.dept_id}, process.env.JWT_SECRET, {expiresIn: '8h'});
        //return token and basic user info in response
        res.json({token,
            user: {
                id: employee.empl_id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                dept: employee.dept_id
            }   
    });
     // return server error message if something goes wrong during the process
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }

});

module.exports = router;