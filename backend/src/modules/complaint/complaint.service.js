const db = require ('../../db/index');

const VALID_TRANSITIONS = {
    'NEW': ['IN_REVIEW', 'REJECTED'],
    'IN_REVIEW': ['IN_PROGRESS'],
    'IN_PROGRESS': ['RESOLVED'],
    'RESOLVED': ['CLOSED'],
    'CLOSED': [],
    'REJECTED': []
}

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
        let whereClause = '';
        let values = [];

        if (user.role === 'USER'){
            whereClause = 'WHERE c.empl_id = $1';
            values = [user.id];
        } else if (user.role === 'DEPT_RESPONSIBLE'){
            whereClause = 'WHERE d.dept_id = $1';
            values = [user.dept_id];
        }

        const query = `SELECT
        c.complaint_id,
        c.title,
        c.status,
        c.created_at,
        c.resolution_category,
        c.resolved_at,
        e.name AS filed_by,
        am.name AS asset_name,
        d.name AS department_name
        FROM complaint c
        JOIN asset a ON c.asset_id = a.asset_id
        JOIN asset_model am ON a.model_id = am.model_id
        JOIN employee e ON c.empl_id = e.empl_id
        JOIN department d ON e.dept_id = d.dept_id
        ${whereClause}
        ORDER BY c.created_at DESC`;
        
        const complaints = await db.query(query,values);
        return complaints.rows;
    }

    async getComplaintById(complaintId){
        const query = `SELECT
        c.complaint_id.
        c.title,
        c.description,
        c.asset_id,
        c.assigned_to,
        c.status,
        c.created_at,
        c.resolution_category,
        c.resolved_at,
        e.name AS filed_by,
        am.name AS asset_name,
        d.name AS department_name,
        tech.name AS assigned_to_name
        FROM complaint c
        JOIN asset a ON c.asset_id = a.asset_id
        JOIN asset_model am ON a.model_id = am.model_id
        JOIN employee e ON c.empl_id = e.empl_id
        JOIN department d ON e.dept_id = d.dept_id
        LEFT JOIN employee tech ON c.assigned_to = tech.empl_id
        WHERE c.complaint_id = $1`;

        const complaint = await db.query(query, [complaintId]);

        if(complaint.rows.length === 0){
            throw new Error('Complaint not found');
        }
        
        return complaint.rows[0];
    }

    async updateStatus(complaintId, updateData){
        const current = await db.query('SELECT status FROM complaint WHERE complaint_id = $1',[complaintId]);
        if(current.rows.length === 0){
            throw new Error ('Complaint not found');
        }

        const oldStatus = current.rows[0].status;

        const query = `UPDATE complaint
        SET status = $1, updated_at = NOW()
        WHERE complaint_id = $2
        RETURNING *`;

        const values = [updateData.status, complaintId];

        if(!VALID_TRANSITIONS[oldStatus].includes(updateData.status)){
            throw new Error('Invalid transition');
        
        }

        const update = await db.query(query, values)
        if(update.rows.length ===0){
            throw new Error('Complaint not found');
        }
        await this._logWorkflow(complaintId, updateData.changedBy, oldStatus, updateData.status, updateData.note);


        return update.rows[0];
        
    }

    async assignComplaint(complaintId){
        
    }

}