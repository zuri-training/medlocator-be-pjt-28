const router = require("express").Router();
const cors = require("cors");
const userRoutes = require("./userRoutes");
const storeRoutes = require("./storeRoutes");
const homeRoutes = require("./homeRoutes");
const drugRoute = require("./drugRoutes");
const errorRoutes = require('./errorRoutes');
const corsOptions = {
    origin:true,
    credentials:true,
    maxAge:86400
}

router.options("*",cors(corsOptions));
router.use("/api/v1/user", userRoutes);
router.use("/api/v1/store", storeRoutes);
router.use("/api/v1/drug", drugRoute);
router.use("/", homeRoutes);
router.use('/', errorRoutes);

module.exports = router;
