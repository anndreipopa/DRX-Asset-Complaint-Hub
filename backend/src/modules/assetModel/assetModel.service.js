const db = require('../../db/index');

class AssetModelService {

    async getAllModels(){
        const query = `
        SELECT * FROM asset_model_reliability ORDER BY reliability_score ASC`;

        const allAssetModels = await db.query(query);
        return allAssetModels.rows;
    }

    async getModelById(modelId){
        const query = `
        SELECT * FROM asset_model_reliability WHERE model_id = $1`;
        const modelById = await db.query(query, [modelId]);

        if(modelById.rows.length === 0){
            throw new Error('Model not found');
        }
        return modelById.rows[0];
    }

    async getModelUnits(modelId){
        const query = `
        SELECT a.asset_id, a.serial_number, am.name AS model_name, am.category, e.empl_id, e.name AS employee_name,
        COUNT(c.complaint_id) AS complaint_count
        FROM asset a
        JOIN asset_model am
            ON a.model_id = am.model_id
        LEFT JOIN employee e
            ON a.empl_id = e.empl_id
        LEFT JOIN complaint c
            ON c.asset_id = a.asset_id
        WHERE a.model_id = $1
        GROUP BY a.asset_id, a.serial_number, am.name, am.category, e.empl_id, e.name
        ORDER BY a.asset_id`;

        const modelUnits = await db.query(query, [modelId]);

        return modelUnits.rows;
    }

    async getModelsAtRisk(){
        const query = `
        SELECT * FROM asset_model_reliability
        WHERE reliability_score < 70
        ORDER BY reliability_score ASC`;

        const modelsAtRisk = await db.query(query);

        return modelsAtRisk.rows;
    }

    async createModel(modelData){
        const existingName = await db.query('SELECT model_id FROM asset_model WHERE name = $1', [modelData.name]);
        if(existingName.rows.length > 0){
            throw new Error('A model with this name already exists.');
        }

        const query = `
        INSERT INTO asset_model (name, category)
        VALUES ($1, $2)
        RETURNING *`;

        const values = [modelData.name, modelData.category];
        const newModel = await db.query(query, values);
        return newModel.rows[0];
    }
    //daca ai timp, altfel nu are rost
    //async updateModel(modelId, modelData){}

}

module.exports = new AssetModelService();