const router = require('express').Router();
const db = require('../db/index');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Get all assets assigned to the authenticated user, requires valid JWT token
router.get('/my-assets', verifyToken, async (req, res) => {
    const userId = req.user.id // get user id from verified token
    try {
        const result = await db.query(
            `SELECT asset.asset_id, asset.serial_number, asset.acquired_at, asset.is_active, asset_model.name AS model_name, asset_model.category FROM asset JOIN asset_model ON asset.model_id = asset_model.model_id WHERE asset.empl_id = $1 AND asset.is_active = TRUE`, 
            [userId]
        );
        res.json(result.rows);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Get all assets with assigned employee names, admin only, requires valid JWT token and checks if role = ADMIN
router.get('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const result = await db.query(
            `SELECT asset.asset_id, asset.serial_number, asset.acquired_at, asset.is_active, asset_model.name AS model_name, asset_model.category, employee.name AS assigned_to FROM asset JOIN asset_model ON asset.model_id = asset_model.model_id LEFT JOIN employee ON asset.empl_id = employee.empl_id`
        );
        res.json(result.rows);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Get details of a specific asset by ID, admin only, requires valid JWT token and checks if role = ADMIN
router.get('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `SELECT asset.asset_id, asset.serial_number, asset.acquired_at, asset.is_active, asset_model.name AS model_name, asset_model.category, employee.name AS assigned_to FROM asset JOIN asset_model ON asset.model_id = asset_model.model_id LEFT JOIN employee ON asset.empl_id = employee.empl_id WHERE asset.asset_id = $1`, 
            [id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Asset not found'});
        }
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});
// Create a new asset and either assign it to an employee or leave it null to be assigned later, admin only, requires valid JWT token and checks if role = ADMIN
router.post('/', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const { model_id, serial_number, empl_id } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO asset (model_id, serial_number, empl_id) VALUES ($1, $2, $3) RETURNING *`, 
            [model_id, serial_number, empl_id ?? null]
        );
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Update asset details (model, serial number, assigned employee, active status), admin only, requires valid JWT token and checks if role = ADMIN
router.patch('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const { id } = req.params;
    const { model_id, serial_number, empl_id, is_active } = req.body;
    try {
        const result = await db.query(
            `UPDATE asset SET model_id = COALESCE($1, model_id), serial_number = COALESCE($2, serial_number), empl_id = COALESCE($3, empl_id), is_active = COALESCE($4, is_active) WHERE asset_id = $5 RETURNING *`, 
            [model_id, serial_number, empl_id, is_active, id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Asset not found'});
        }
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

// Soft delete an asset by setting is_active to false, admin only, requires valid JWT token and checks if role = ADMIN
router.delete('/:id', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('UPDATE asset SET is_active = false WHERE asset_id = $1 RETURNING *', [id]);
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Asset not found'}); 
        }
        res.json({ message: 'Asset deactivated successfully', updated: result.rows[0] });
    }
        catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
});

module.exports = router;