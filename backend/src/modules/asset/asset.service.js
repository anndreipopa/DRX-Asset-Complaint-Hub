const db = require('../../db/index');

class AssetService {
    
    async getMyAssets(userId) {
        const query = `
            SELECT asset.asset_id, asset.serial_number, asset.acquired_at, asset.is_active, 
                   asset_model.name AS model_name, asset_model.category 
            FROM asset 
            JOIN asset_model ON asset.model_id = asset_model.model_id 
            WHERE asset.empl_id = $1 AND asset.is_active = TRUE
        `;
        const assetsFromDb = await db.query(query, [userId]);
        return assetsFromDb.rows;
    }

    async getAllAssets() {
        const query = `
            SELECT asset.asset_id, asset.serial_number, asset.acquired_at, asset.is_active, 
                   asset_model.name AS model_name, asset_model.category, 
                   employee.name AS assigned_to 
            FROM asset 
            JOIN asset_model ON asset.model_id = asset_model.model_id 
            LEFT JOIN employee ON asset.empl_id = employee.empl_id
        `;
        const assetsFromDb = await db.query(query);
        return assetsFromDb.rows;
    }

    async getAssetById(assetId) {
        const query = `
            SELECT asset.asset_id, asset.serial_number, asset.acquired_at, asset.is_active, 
                   asset_model.name AS model_name, asset_model.category, 
                   employee.name AS assigned_to 
            FROM asset 
            JOIN asset_model ON asset.model_id = asset_model.model_id 
            LEFT JOIN employee ON asset.empl_id = employee.empl_id 
            WHERE asset.asset_id = $1
        `;
        const assetFromDb = await db.query(query, [assetId]);
        
        if (assetFromDb.rows.length === 0) {
            throw new Error('Asset not found.');
        }
        return assetFromDb.rows[0];
    }

    async createAsset(assetData) {
        // Prevent duplicate serial numbers before hitting the database
        const existingSerial = await db.query('SELECT asset_id FROM asset WHERE serial_number = $1', [assetData.serial_number]);
        if (existingSerial.rows.length > 0) {
            throw new Error('An asset with this serial number already exists.');
        }

        const query = `
            INSERT INTO asset (model_id, serial_number, empl_id) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
        const values = [assetData.model_id, assetData.serial_number, assetData.empl_id ?? null];
        
        const newAsset = await db.query(query, values);
        return newAsset.rows[0];
    }

    async updateAsset(assetId, updateData) {
        // If they are changing the serial number, check for duplicates
        if (updateData.serial_number) {
            const existingSerial = await db.query(
                'SELECT asset_id FROM asset WHERE serial_number = $1 AND asset_id != $2', 
                [updateData.serial_number, assetId]
            );
            if (existingSerial.rows.length > 0) {
                throw new Error('Serial number already in use by another asset.');
            }
        }

        const query = `
            UPDATE asset 
            SET model_id = COALESCE($1, model_id), 
                serial_number = COALESCE($2, serial_number), 
                empl_id = COALESCE($3, empl_id), 
                is_active = COALESCE($4, is_active) 
            WHERE asset_id = $5 
            RETURNING *
        `;
        const values = [updateData.model_id, updateData.serial_number, updateData.empl_id, updateData.is_active, assetId];
        
        const updatedAsset = await db.query(query, values);
        
        if (updatedAsset.rows.length === 0) {
            throw new Error('Asset not found.');
        }
        return updatedAsset.rows[0];
    }

    async deactivateAsset(assetId) {
        const query = `
            UPDATE asset 
            SET is_active = false 
            WHERE asset_id = $1 
            RETURNING *
        `;
        const deactivatedAsset = await db.query(query, [assetId]);
        
        if (deactivatedAsset.rows.length === 0) {
            throw new Error('Asset not found.');
        }
        return deactivatedAsset.rows[0];
    }
}

module.exports = new AssetService();