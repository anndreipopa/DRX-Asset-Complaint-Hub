const db = require('../../db/index');

class DepartmentService {
    
    async getAllDepartments() {
        const departmentsFromDb = await db.query('SELECT * FROM department ORDER BY name ASC');
        return departmentsFromDb.rows;
    }

    async getDepartmentById(deptId) {
        const departmentFromDb = await db.query('SELECT * FROM department WHERE dept_id = $1', [deptId]);
        
        if (departmentFromDb.rows.length === 0) {
            throw new Error('Department not found.');
        }
        
        return departmentFromDb.rows[0];
    }

    async createDepartment(departmentData) {
        const query = `
            INSERT INTO department (name, responsible_id) 
            VALUES ($1, $2) 
            RETURNING *
        `;
        // ?? null means a department can be created without assigning a responbinle immediately
        const values = [departmentData.name, departmentData.responsible_id ?? null];
        
        const newDepartment = await db.query(query, values);
        return newDepartment.rows[0];
    }

    async updateDepartment(deptId, updateData) {
        const query = `
            UPDATE department 
            SET name = COALESCE($1, name), 
                responsible_id = COALESCE($2, responsible_id) 
            WHERE dept_id = $3 
            RETURNING *
        `;
        const values = [updateData.name, updateData.responsible_id, deptId];
        
        const updatedDepartment = await db.query(query, values);
        
        if (updatedDepartment.rows.length === 0) {
            throw new Error('Department not found.');
        }
        
        return updatedDepartment.rows[0];
    }
}

module.exports = new DepartmentService();