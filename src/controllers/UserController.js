const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
// Require Models
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const generateTokens = async (user) => {
	const accessToken = jwt.sign(
		{ id: user._id, role: user.role },
		JWT_SECRET,
		{ expiresIn: "15m" }
	); // JWT sống 15 phút

	const refreshToken = jwt.sign(
		{ id: user._id, role: user.role },
		REFRESH_SECRET,
		{ expiresIn: "7d" }
	); // JWT sống 7 ngày

	// Lưu token vào database
	await RefreshToken.create({
		token: refreshToken,
		userId: user._id,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
	}); //7 ngày

	return { accessToken, refreshToken };
};

class UserController {
	me(req, res, next) {
		res.send(req.user);
	}
	showAllUser(req, res, next) {
		User.find()
			.then((users) => {
				res.send(users);
			})
			.catch(next);
	}

	register(req, res, next) {
		const { username, password, role } = req.body;
		const newUser = new User({ username, password, role });
		newUser
			.save()
			.then((newUser) => {
				res.status(201).json({ newUser });
			})
			.catch(next);
	}

	login(req, res, next) {
		const { username, password } = req.body;

		User.findOne({ username })
			.then(async (user) => {
				if (!user || !(await user.comparePassword(password))) {
					return res
						.status(400)
						.json({ message: "user is not in DB" });
				} else {
					const tokens = await generateTokens(user);
					res.json(tokens);
				}
			})
			.catch(next);
	}

	refresh(req, res, next) {
		const {refreshToken} = req.body;

		if (!refreshToken)
			return res.status(401).json({ error: "No refresh token provided" });

		try {
			const storedToken = RefreshToken.findOne({
				token: refreshToken,
			}).then((token) => token);
			if (!storedToken)
				return res.status(401).json({ error: "Invalid refresh token" });

			// Kiểm tra hạn của refresh token
			if (new Date(storedToken.expires) < Date.now())
				return res.status(403).json({ error: "Refresh token expired" });

			const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
			const accessToken = jwt.sign({id: decoded._id, role: decoded.role}, JWT_SECRET, { expiresIn: '15m' });
			res.json({ accessToken });
		} catch (err) {
			return res.status(500).json({ error: "Internal server error", err });
		}
	}

	myAccount(req, res, next) {
		User.find()
			.select("-password")
			.then((users) => {
				res.json(users);
			})
			.catch((err) => res.json({ err: err.message }));
	}
}

module.exports = new UserController();
