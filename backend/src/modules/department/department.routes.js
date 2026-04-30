const router = require('express').Router();
const departmentController = require('./department.controller');
const { verifyToken, requireRole } = require('../../middleware/auth.middleware');

// Get all departments, can be done by any authenthicated user
router.get('/', verifyToken, departmentController.getAllDepartments);

// Get a department by its ID, done by any user again
router.get('/:id', verifyToken, departmentController.getDepartmentById);

// Admin can create a new department
router.post('/', verifyToken, requireRole(['ADMIN']), departmentController.createDepartment);

// Admin can update department details
router.patch('/:id', verifyToken, requireRole(['ADMIN']), departmentController.updateDepartment);

module.exports = router;