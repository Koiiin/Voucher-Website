const jwt = require("jsonwebtoken");

// Xác thực token
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const accessToken = authHeader.split(" ")[1]; // Sửa lỗi biến token
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid");
            }
            req.user = user;
            next();
         });
    } else {
        return res.status(401).json("You are not authenticated");
    }
};

// Xác thực token và kiểm tra quyền admin hoặc chủ tài khoản
exports.verifyTokenAndAdAuth = (req, res, next) => {
    exports.verifyToken(req, res, () => {
        if (req.user.id == req.params.id || req.user.admin) {
            next();
        } else {
            return res.status(403).json("You are not allowed to delete others");
        }
    });
};

