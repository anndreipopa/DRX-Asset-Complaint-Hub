//function to handle database errors and return informative error messages
function errorHandler(err, res) {
    console.error(err);

    if (err.code === '23505'){
        return res.status(400).json({message: 'This value already exists'});
    }
    if (err.code === '23503') {
        return res.status(400).json({message: 'Referenced record does not exist'});
    }

    //default to err500 if unexpected crash
    return res.status(500).json({message: 'Server error', error: err.message});
}

module.exports = errorHandler;