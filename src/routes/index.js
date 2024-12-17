const postRouter = require("./post");
const authRouter = require("./auth");

function router(app) {
    app.use("/api", postRouter);
    app.use("/api/auth", authRouter);
}

module.exports = router;