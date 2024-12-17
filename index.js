const docenv = require("dotenv");
docenv.config();

const express = require("express");
const cors = require("cors");
const db = require("./src/db/config/index");
const app = express();
const port = process.env.PORT || 5050;
const router = require("./src/routes");

app.use(cors({
    origin: "http://localhost:5173", // URL của frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"], // Cho phép header Authorization
}));
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

db.connectDB();

router(app);

app.listen(port, () => {
    console.log(`Server is running on URL: http://localhost:${port}`);
});