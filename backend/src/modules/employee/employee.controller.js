const employeeService = require('./employee.service');
const VALID_ROLES = ['USER', 'TECHNICIAN', 'DEPT_RESPONSIBLE', 'ADMIN'];

class EmployeeController {
    
    getEmployeesAll = async (req, res, next) => {
        try {
            const employees = await employeeService.getEmployeesAll();
            res.json(employees);
        } catch (err) {
            next(err);
        }
    };

    getDepartmentEmployees = async (req, res, next) => {
        try {
            // req.user comes from ./middleware/auth.middleware
            const employees = await employeeService.getEmployeesFromDepartment(req.user.dept_id);
            res.json(employees);
        } catch (err) {
            if (err.message === 'No employees found in this department.') {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    };

    getEmployeeById = async (req, res, next) => {
        try {
            const employee = await employeeService.getEmployeeById(req.params.id);
            res.json(employee);
        } catch (err) {
            if (err.message === 'Employee not found.') {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    };

    createEmployee = async (req, res, next) => {
        try {
            const { name, email, role, dept_id, password } = req.body;
            
            // Basic input validation
            if (!name || !email || !role || !dept_id || !password) {
                return res.status(400).json({ message: 'Missing required fields.' });
            }
            if (!VALID_ROLES.includes(role)) {
                return res.status(400).json({ message: 'Invalid role.' });
            }

            // Hand off to service
            const newEmployee = await employeeService.createEmployee(req.body);
            res.status(201).json(newEmployee);

        } catch (err) {
            if (err.message === 'An employee with this email already exists.') {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    };

    updateEmployee = async (req, res, next) => {
        try {
            if (req.body.role && !VALID_ROLES.includes(req.body.role)) {
                return res.status(400).json({ message: 'Invalid role.' });
            }

            const updatedEmployee = await employeeService.updateEmployee(req.params.id, req.body);
            res.json(updatedEmployee);

        } catch (err) {
            if (err.message === 'Email already in use by another employee.' || err.message === 'Employee not found.') {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    };

    deactivateEmployee = async (req, res, next) => {
        try {
            // Pass the ID to deactivate, and the ID of the person making the request
            const deactivated = await employeeService.deactivateEmployee(req.params.id, req.user.id);
            res.json({ message: 'Employee deactivated successfully', employee: deactivated });
            
        } catch (err) {
            if (err.message === 'You cannot deactivate your own account.' || err.message === 'Employee not found.') {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    };
}

module.exports = new EmployeeController();