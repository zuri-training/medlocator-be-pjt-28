const router = require("express").Router();
const userRoutes = require("./userRoutes");
const storeRoutes = require("./storeRoutes");
const homeRoutes = require("./homeRoutes");

router.use("/api/user",userRoutes);
router.use("/api/store",storeRoutes);
router.use("/",homeRoutes);

module.exports = router;