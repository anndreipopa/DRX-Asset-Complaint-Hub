const router = require('express').Router();
const assetController = require('./asset.controller');
const { verifyToken, requireRole } = require('../../middleware/auth.middleware');

// Get assets for the logged-in user
router.get('/my-assets', verifyToken, assetController.getMyAssets);

// Admin gets all assets available
router.get('/', verifyToken, requireRole(['ADMIN', 'TECHNICIAN', 'DEPT_RESPONSIBLE']), assetController.getAllAssets);

// Gen an asset by its id, admin only
router.get('/:id', verifyToken, requireRole(['ADMIN']), assetController.getAssetById);

// Admin can create an asset
router.post('/', verifyToken, requireRole(['ADMIN']), assetController.createAsset);

// Admin can edit an asset detials
router.patch('/:id', verifyToken, requireRole(['ADMIN']), assetController.updateAsset);

// Soft delete of an asset, similar to employee soft delete, it keeps the asset in the databse so hstory is maintained
router.delete('/:id', verifyToken, requireRole(['ADMIN']), assetController.deactivateAsset);

module.exports = router;