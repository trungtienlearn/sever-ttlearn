const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const RefreshToken = require("../models/RefreshToken");

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({error: "Access denied"});
    };

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Gắn thông tin người dùng vào req
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return refreshToken(req, res, next); // Làm mới token nếu hết hạn
        }
        res.status(403).json({error: "Invalid token"});
    }
}

// Middleware làm mới token
const refreshToken = async (req, res, next) => {
    const refreshToken = req.headers['x-refresh-token'];
    if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
    }

    try {
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        // Kiểm tra hạn của refresh token
        if (new Date(storedToken.expires) < Date.now()) {
            return res.status(403).json({ error: "Refresh token expired" });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, JWT_SECRET, { expiresIn: '15m' });
        res.setHeader('x-access-token', newAccessToken);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Refresh token error: ", err);
        res.status(500).json({ error: "Internal server error", err });
    }
}

// Middleware kiểm tra quyền
const authorizeRole = (roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) {
        return res.status(403).json({message: "Access denied"});
    };
    next();
};

module.exports = { authenticateToken, authorizeRole };