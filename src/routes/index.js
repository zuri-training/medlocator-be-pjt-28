const router = require("express").Router();
const userRoutes = require("./userRoutes");
const storeRoutes = require("./storeRoutes");
const homeRoutes = require("./homeRoutes");
const drugRoute = require("./drugRoutes");

router.use("/api/v1/user", userRoutes);
router.use("/api/v1/store", storeRoutes);
router.use("/api/v1/drug", drugRoute);
router.use("/", homeRoutes);

module.exports = router;
