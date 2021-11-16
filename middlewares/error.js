const { CustomApiError } = require('../custom-error/customErr');
const errorHandler = (err, req, res, next) => {
    console.log("err",err.message)
    if (err instanceof CustomApiError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
    return res.status(500).json({ msg: err.message });
}

module.exports = errorHandler