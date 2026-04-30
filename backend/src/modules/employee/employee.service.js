const db = require('../../db/index');
const bcrypt = require('bcrypt');

class EmployeeService {
    async getEmployeesAll(){
        const query= `
        SELECT employee.empl_id, employee.name, employee.email, employee.role, employee.dept_id, employee.is_active, employee.created_at, department.name AS department_name
        FROM employee JOIN department ON employee.dept_id = department.dept_id
        ORDER BY employee.name ASC
        `;
        const employees = await db.query(query);
        return employees.rows;
    }

    async getEmployeesFromDepartment(deptId){
        const query = `SELECT employee.empl_id, employee.name, employee.email, employee.is_active, employee.created_at, department.name AS department_name
        FROM employee JOIN department on employee.dept_id = department.dept_id
        WHERE employee.dept_id = $1
        ORDER BY employee.name ASC `;
        const employees = await db.query(query, [deptId]);
        if(employees.rows.length === 0){
            throw new Error('No employees in this department');
        }
        return employees.rows
    }

    async getEmployeeById(employeeId) {
        const query = `
            SELECT employee.empl_id, employee.name, employee.email, employee.role, employee.dept_id, employee.is_active, employee.created_at, department.name AS department_name 
            FROM employee 
            JOIN department ON employee.dept_id = department.dept_id 
            WHERE employee.empl_id = $1
        `;
        const employee = await db.query(query, [employeeId]);
        
        if (employee.rows.length === 0) {
            throw new Error('Employee not found');
        }
        return employee.rows[0];
    }

    async createEmployee(employeeData) {
        //check to see if email already exists in the databse
        const existEmail = await db.query('SELECT empl_id FROM employee WHERE email = $1', [employeeData.email]);
        if (existEmail.rows.length > 0) {
            throw new Error('Email already exists');
        }

        //hash the new password
        const password_hash = await bcrypt.hash(employeeData.password, 10);
        
        //insert the new user in the database,
        const query = `
            INSERT INTO employee (name, email, role, dept_id, is_active, password_hash) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING empl_id, name, email, role, dept_id, is_active
        `;
        const values = [employeeData.name, employeeData.email, employeeData.role, employeeData.dept_id, true, password_hash];
        
        const newEmployee = await db.query(query, values);
        return newEmployee.rows[0];
    }

    async updateEmployee(employeeId, updateData) {
        //if changing the email check if the new email isn't already used
        if (updateData.email) {
            const existingEmail = await db.query(
                'SELECT empl_id FROM employee WHERE email = $1 AND empl_id != $2', 
                [updateData.email, employeeId]
            );
            if (existingEmail.rows.length > 0) {
                throw new Error('Email already in use0');
            }
        }

        //COALESCE lets admin update just the needed fields, older ones keep their value
        const query = `
            UPDATE employee 
            SET name = COALESCE($1, name), 
                email = COALESCE($2, email), 
                role = COALESCE($3, role), 
                dept_id = COALESCE($4, dept_id), 
                is_active = COALESCE($5, is_active) 
            WHERE empl_id = $6 
            RETURNING empl_id, name, email, role, dept_id, is_active
        `;
        const values = [updateData.name, updateData.email, updateData.role, updateData.dept_id, updateData.is_active, employeeId];
        
        const updatedEmployee = await db.query(query, values);
        
        if (updatedEmployee.rows.length === 0) {
            throw new Error('Employee not found.');
        }
        return updatedEmployee.rows[0];
    }

    async deactivateEmployee(employeeId, requestingUserId) {
        if (parseInt(employeeId) === requestingUserId) {
            throw new Error('You cannot deactivate your own account.');
        }

        const query = `
            UPDATE employee 
            SET is_active = FALSE 
            WHERE empl_id = $1 
            RETURNING empl_id, name, is_active
        `;
        const deactivatedEmployee = await db.query(query, [employeeId]);
        
        if (deactivatedEmployee.rows.length === 0) {
            throw new Error('Employee not found.');
        }
        return deactivatedEmployee.rows[0];
    }
}

module.exports = new EmployeeService();
