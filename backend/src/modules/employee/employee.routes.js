const router = require('express').Router();
const employeeController = require('./employee.controller');
const { verifyToken, requireRole } = require('../../middleware/auth.middleware');

// Admin can get all employees
router.get('/', verifyToken, requireRole(['ADMIN']), employeeController.getEmployeesAll);

// Get all employees in the user's department
router.get('/my-department', verifyToken, requireRole(['DEPT_RESPONSIBLE', 'TECHNICIAN', 'ADMIN']), employeeController.getDepartmentEmployees);

// Get an employee by their id
router.get('/:id', verifyToken, employeeController.getEmployeeById);

// Admin can create a new employee
router.post('/', verifyToken, requireRole(['ADMIN']), employeeController.createEmployee);

// Admin can update and existing employee's details
router.patch('/:id', verifyToken, requireRole(['ADMIN']), employeeController.updateEmployee);

// This is a soft deactivate, employee remains in the database to keep history
router.delete('/:id', verifyToken, requireRole(['ADMIN']), employeeController.deactivateEmployee);

module.exports = router;