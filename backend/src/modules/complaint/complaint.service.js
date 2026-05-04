const db = require ('../../db/index');

class ComplaintService {
    async _logWorkflow(complaintId, changedBy, oldStatus, newStatus, note){
        const query = `INSERT INTO complaint_workflow(complaint_id, changed_by, old_status, new_status, note)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING *`;

        const values = [complaintId, changedBy, oldStatus, newStatus, note];
        const workflowUpdate = await db.query(query, values);
    }

    async _createNotification(employeeId, complaintId, message){
        const query = `INSERT INTO notification(empl_id, complaint_id, message)
        VALUES ($1, $2, $3)
        RETURNING *`;
        const values = [employeeId, complaintId, message];
        const createNotification = await db.query(query, values);
    }

    async createComplaint(data){
        const asset = await db.query('SELECT * FROM asset WHERE asset_id = $1 AND empl_id = $2', [data.asset_id, data.empl_id]);
        if(asset.rows.length === 0){
            throw new Error ('Asset not found OR Asset does not belong to you');
        }

        const created = await db.query(`
            INSERT INTO complaint (title, description, asset_id, empl_id, status)
            VALUES ($1, $2, $3, $4, 'NEW')
            RETURNING *`, [data.title, data.description, data.asset_id, data.empl_id]);

        const complaint = created.rows[0];

        await this._logWorkflow(complaint.complaint_id, data.empl_id, null, 'NEW', null);

        const deptResponsible = await db.query(`
            SELECT d.responsible_id
            FROM asset a
            JOIN employee e ON a.empl_id = e.empl_id
            JOIN department d ON e.dept_id = d.dept_id
            WHERE a.asset_id = $1
            `, [data.asset_id]);

        if(deptResponsible.rows.length > 0) {
            await this._createNotification(deptResponsible.rows[0].responsible_id, complaint.complaint_id, `New complaint: ${complaint.title}`);
        }

        return complaint;
    }

    async getComplaints(user){
        
    }

}