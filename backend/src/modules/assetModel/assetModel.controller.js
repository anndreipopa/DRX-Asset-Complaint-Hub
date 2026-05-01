const assetModelService = require('./assetModel.service');

const VALID_CATEGORIES = ['LAPTOP', 'PHONE', 'HEADSET', 'MONITOR', 'KEYBOARD', 'MOUSE', 'OTHER'];

class AssetModelController {

    getAllModels  = async(req, res, next) => {
        try{
            const models = await assetModelService.getAllModels();
            res.json(models);
        } catch(err){
            next(err);
        }
    };

    getModelById = async(req, res, next) => {
      try{
        const model = await assetModelService.getModelById(req.params.id);
        res.json(model);
      } catch(err){
        if(err.message === 'Model not found'){
            return res.status(404).json({message: err.message});
        }
        next(err);
      }
    };


    getModelUnits  = async(req, res, next) => {
        try{
            const units = await assetModelService.getModelUnits(req.params.id);
            res.json(units);
        }catch(err){
            next(err);
        }
    }

    getModelsAtRisk = async(req, res, next) => {
        try{
            const atrisk = await assetModelService.getModelsAtRisk();
            res.json(atrisk);
        } catch (err){
            next(err);
        }
    }

    createModel  = async(req, res, next) => {
        try{
            if(!req.body.name  || !req.body.category){
                return res.status(400).json({message: 'Model name and category are required'});
            }

            if (!VALID_CATEGORIES.includes(req.body.category)) {
                return res.status(400).json({ message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` });
                }
            
            const newModel = await assetModelService.createModel(req.body);
            res.status(201).json(newModel);
        } catch(err){
            if(err.message === 'A model with this name already exists.'){
                return res.status(400).json({message: err.message});
            }
            next(err);
        }
    }

}

module.exports = new AssetModelController();