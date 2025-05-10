const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken");  
const passport = require("passport");

//Đăng kýký
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) { 
            return res.status(400).json({ 
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin!' });
        }

        const existingUsername = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUsername) {  
            return res.status(400).json({ 
                success: false,
                message: 'Tên người dùng đã tồn tại!' });
        }
        if (existingEmail) {  
            return res.status(400).json({ 
                success: false,
                message: 'Email đã tồn tại!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save(); 

        res.status(200).json({ 
            success:  true,
            message: 'Đăng ký tài khoản thành công! 🎉' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server ❌', error: error.message });
    }
};

//Tạo access token
exports.generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            admin: user.admin
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "100s" }
    );
};

//Tạo refresh tokentoken
exports.generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            admin: user.admin,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "2d" }
    );
};

//đăng nhập
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "Wrong username!" 
            });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(404).json({ 
                success: false,
                message: "Wrong password!" 
            });
        }

        if (user && validPassword) {
            const accessToken = exports.generateAccessToken(user);
            const refreshToken = exports.generateRefreshToken(user);

            await RefreshToken.deleteMany({ userId: user.id }); 
            await RefreshToken.create({
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Hết hạn sau 1 năm
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: "strict"
            });

            const { password, ...others } = user._doc;
            res.status(200).json({ 
                success: true,
                ...others, 
                accessToken 
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi server ❌", error: error.message });
    }
};

// -------Đăng nhập bằng gg-----------
exports.google = passport.authenticate("google", { scope: ["profile", "email"], session: false });

exports.googleCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user, info) => {
        if (err) {
            return res.redirect(`http://localhost:5173/oauth-error?message=${encodeURIComponent("Đăng nhập Google thất bại ❌")}`);
        }
        if (!user) {
            return res.redirect(`http://localhost:5173/oauth-error?message=${encodeURIComponent("Không tìm thấy tài khoản Google!")}`);
        }

        try {
            const existingUser = user;

            const accessToken = exports.generateAccessToken(existingUser);
            const refreshToken = exports.generateRefreshToken(existingUser);

            await RefreshToken.deleteMany({ userId: existingUser.id });

            await RefreshToken.create({ 
                token: refreshToken, 
                userId: existingUser.id, 
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: "strict"
            });

            const redirectUrl = `http://localhost:5173/oauth-success?token=${accessToken}&username=${existingUser.username}`;
            return res.redirect(redirectUrl);

        } catch (error) {
            return res.redirect(`http://localhost:5173/oauth-error?message=${encodeURIComponent("Lỗi server ❌")}`);
        }
    })(req, res, next);
};

// Đăng nhập bằng Facebook
exports.facebook = passport.authenticate('facebook', { scope: ['email'] });

// Callback sau khi Facebook xác thực
exports.facebookCallback = (req, res,next) => {
  passport.authenticate('facebook', { session: false }, async (err, user, info) => {
    if (err) {
      return res.redirect(`http://localhost:5173/oauth-error?message=${encodeURIComponent('Đăng nhập Facebook thất bại ❌')}`);
    }

    if (!user) {
      return res.redirect(`http://localhost:5173/oauth-error?message=${encodeURIComponent('Không tìm thấy tài khoản Facebook!')}`);
    }

    try {
      const existingUser = user;
      const accessToken = exports.generateAccessToken(existingUser);
      const refreshToken = exports.generateRefreshToken(existingUser);

      await RefreshToken.deleteMany({ userId: existingUser.id });

      await RefreshToken.create({ 
        token: refreshToken, 
        userId: existingUser.id, 
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });

      const redirectUrl = `http://localhost:5173/oauth-success?token=${accessToken}&username=${existingUser.username}`;
      return res.redirect(redirectUrl);

    } catch (error) {
      return res.redirect(`http://localhost:5173/oauth-error?message=${encodeURIComponent('Lỗi server ❌')}`);
    }
  })(req, res,next);
};


//------------------------------


exports.requestRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json("User not authenticated");
    }
    
    const existingToken = await RefreshToken.findOne({ token: refreshToken });
    if (!existingToken) {
        return res.status(403).json({ message: "Token không hợp lệ!" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
        if (err) {
            return res.status(403).json("User not authenticated");
        }

        await RefreshToken.deleteOne({ token: refreshToken });

        const newAccessToken = exports.generateAccessToken(user);
        const newRefreshToken = exports.generateRefreshToken(user);

        await RefreshToken.create({
            token: newRefreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: "strict"
        });

        res.status(200).json({ accessToken: newAccessToken });
    });
};

exports.logoutUser = async (req, res) => {
    console.log("Cookies:", req.cookies.refreshToken);
    if (!req.cookies.refreshToken) {
        return res.status(400).json({ message: "No refresh token found" });
    }
    try {
        res.clearCookie("refreshToken");
        await RefreshToken.deleteOne({ token: req.cookies.refreshToken }); 
        res.status(200).json("User logged out");
    } catch (err) {
        res.status(500).json(err);
    }
};

