const departmentService = require('./department.service');

class DepartmentController {
    
    getAllDepartments = async (req, res, next) => {
        try {
            const departments = await departmentService.getAllDepartments();
            res.json(departments);
        } catch (err) {
            next(err);
        }
    };

    getDepartmentById = async (req, res, next) => {
        try {
            const department = await departmentService.getDepartmentById(req.params.id);
            res.json(department);
        } catch (err) {
            if (err.message === 'Department not found.') {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    };

    createDepartment = async (req, res, next) => {
        try {
            if (!req.body.name) {
                return res.status(400).json({ message: 'Department name is required.' });
            }

            const newDepartment = await departmentService.createDepartment(req.body);
            res.status(201).json(newDepartment);
        } catch (err) {
            next(err);
        }
    };

    updateDepartment = async (req, res, next) => {
        try {
            const updatedDepartment = await departmentService.updateDepartment(req.params.id, req.body);
            res.json(updatedDepartment);
        } catch (err) {
            if (err.message === 'Department not found.') {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    };
}

module.exports = new DepartmentController();