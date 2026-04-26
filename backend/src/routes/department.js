const router = require('express').Router();
const db = require('../db/index');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try{
        const result = await db.query('SELECT * FROM department');
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

router.post('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const {name, responsible_id} = req.body;
    try{
        const result = await db.query('INSERT INTO department (name, responsible_id) VALUES ($1, $2) RETURNING *', [name, responsible_id || null]);
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

module.exports = router;