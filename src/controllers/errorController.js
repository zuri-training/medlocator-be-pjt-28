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
        let objectError;
        if (err) {
            objectError = {
                status: 500,
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
        res.status(500)
        .json(objectError);
    }
};

module.exports = forErrorControl;