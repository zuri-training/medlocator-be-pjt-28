const router = require("express").Router();
const cors = require("cors");
const userRoutes = require("./userRoutes");
const storeRoutes = require("./storeRoutes");
const homeRoutes = require("./homeRoutes");
const drugRoute = require("./drugRoutes");
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
router.use("*", (req, res) => {
  res.status(404).json({
    status: "failure",
    code: 404,
    message: "This page does not exist",
    body: {},
  });
});

module.exports = router;
