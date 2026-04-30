const db = require('../../db/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async login(email,password) {
        const dbUser = await db.query('SELECT * FROM employee WHERE email = $1', [email]);

        //if array empty, then no user was foun d
        if(dbUser.rows.length ===0){
            //generic error message
            throw new Error('Invalid credentials');
        }
        const currentUser = dbUser.rows[0];
        const isMatch = await bcrypt.compare(password, currentUser.password_hash);

        if(!isMatch){
            //generic error message like email, as to not reveal what's wrong
            throw new Error ('Invalid credentials');
        }
        //generate token
        const token = jwt.sign(
            {
                id: currentUser.empl_id,
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                dept: currentUser.dept_id
            },
            process.env.JWT_SECRET,{expiresIn:'8h'}
        );

        //returning token and user info
        return {
            token: token,
            user: {
                id: currentUser.empl_id,
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                dept: currentUser.dept_id
            }
        };
    }
}
module.exports = new AuthService();