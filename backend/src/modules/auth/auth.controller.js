const authService = require('./auth.service');

class AuthController {
    login = async(req, res, next) => {
        try{
            const{email, password} = req.body;
            if(!email || !password){
                return res.status(400).json({message: 'Missing credentials'});
                }
                //send data to auth.service to be processed
                const authData = await authService.login(email, password);
                res.json(authData);
            } catch(err){
                if(err.message === 'Invalid credentials'){
                    return res.status(401).json({message: 'Invalid email or password'})
                }
                next(err);
            }
        }
    }

module.exports = new AuthController();
