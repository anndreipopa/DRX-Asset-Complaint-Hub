const router = require('express').Router();
const assetModelController = require('./assetModel.controller');
const { verifyToken, requireRole } = require('../../middleware/auth.middleware');

router.get('/at-risk', verifyToken, requireRole(['ADMIN', 'DEPT_RESPONSIBLE']), assetModelController.getModelsAtRisk);

router.get('/:id/units', verifyToken, requireRole(['ADMIN', 'TECHNICIAN', 'DEPT_RESPONSIBLE']), assetModelController.getModelUnits);

router.get('/', verifyToken, requireRole(['ADMIN', 'TECHNICIAN', 'DEPT_RESPONSIBLE']), assetModelController.getAllModels);

router.get('/:id', verifyToken, requireRole(['ADMIN', 'TECHNICIAN', 'DEPT_RESPONSIBLE']), assetModelController.getModelById);

router.post('/', verifyToken, requireRole(['ADMIN']), assetModelController.createModel);

module.exports = router;