const assetService = require('./asset.service');

class AssetController {
    
    getMyAssets = async (req, res, next) => {
        try {
            // req.user.id comes from the verified JWT token
            const assets = await assetService.getMyAssets(req.user.id);
            res.json(assets);
        } catch (err) {
            next(err);
        }
    };

    getAllAssets = async (req, res, next) => {
        try {
            const assets = await assetService.getAllAssets();
            res.json(assets);
        } catch (err) {
            next(err);
        }
    };

    getAssetById = async (req, res, next) => {
        try {
            const asset = await assetService.getAssetById(req.params.id);
            res.json(asset);
        } catch (err) {
            if (err.message === 'Asset not found.') {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    };

    createAsset = async (req, res, next) => {
        try {
            if (!req.body.model_id || !req.body.serial_number) {
                return res.status(400).json({ message: 'Model ID and Serial Number are required.' });
            }

            const newAsset = await assetService.createAsset(req.body);
            res.status(201).json(newAsset);
        } catch (err) {
            if (err.message === 'An asset with this serial number already exists.') {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    };

    updateAsset = async (req, res, next) => {
        try {
            const updatedAsset = await assetService.updateAsset(req.params.id, req.body);
            res.json(updatedAsset);
        } catch (err) {
            if (err.message === 'Asset not found.' || err.message === 'Serial number already in use by another asset.') {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    };

    deactivateAsset = async (req, res, next) => {
        try {
            const deactivated = await assetService.deactivateAsset(req.params.id);
            res.json({ message: 'Asset deactivated successfully', updated: deactivated });
        } catch (err) {
            if (err.message === 'Asset not found.') {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    };
}

module.exports = new AssetController();