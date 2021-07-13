const util = require("util");
const forErrorControl = {
    noResourceFound: (req, res)=> {
        let errObject = {
            status: 404,
            message: "No Resource Found",
            data: null
        };
        res.status(404).json(errObject);
    },

    internalSerevrError: (err, req, res, next)=> {
        console.error(`ERROR: ${err.stack}`);
        let objectError = {};
        let code = err.status || 500;
        if (err) {
            objectError = {
                status: code,
                message: err.message,
                data: null
            };
        }
        else {
            objectError = {
                status: 500,
                message: "error not known",
                data: null
            };
        }
        res.status(code).json(objectError);
    }
};

module.exports = forErrorControl;