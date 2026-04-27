const router = require('express').Router();
const db = require('../db/index');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Get all departments, requires valid JWT token
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM department');
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Create a new department, admin only, requires valid JWT token and checks if role = ADMIN
router.post('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const {name, responsible_id} = req.body;
    try {
        const result = await db.query(
            'INSERT INTO department (name, responsible_id) VALUES ($1, $2) RETURNING *', 
            [name, responsible_id ?? null]
        );
        res.json(result.rows[0]);
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Update department details, admin only, requires valid JWT token and checks if role = ADMIN
router.patch('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const { id } = req.params;
    const { name, responsible_id } = req.body;
    try {
        const result = await db.query(
            'UPDATE department SET name = COALESCE($1, name), responsible_id = COALESCE($2, responsible_id) WHERE dept_id = $3 RETURNING *', 
            [name, responsible_id, id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Department not found'});
        }
        res.json(result.rows[0]);
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Delete a department, admin only, requires valid JWT token and checks if role = ADMIN
router.delete('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM department WHERE dept_id = $1 RETURNING *', [id]);
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Department not found'});
        }
        res.json({ message: 'Department deleted successfully', deleted: result.rows[0] });
    } catch(err) {

        res.status(500).json({message: 'Server error', error: err.message});
    }
});

module.exports = router;