const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Kiểm tra nếu profile có emails
                if (!profile.emails || profile.emails.length === 0) {
                    return done(new Error("Không tìm thấy email từ Google"), null);
                }

                // Kiểm tra nếu người dùng đã tồn tại
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    // Tạo tài khoản mới nếu người dùng chưa tồn tại
                    user = await User.create({
                        googleId: profile.id,
                        username: profile.emails[0].value.split("@")[0], // Lấy phần trước @ của email
                        email: profile.emails[0].value,
                    });
                }

                done(null, user);
            } catch (error) {
                // Ghi lại lỗi chi tiết nếu có
                console.error("Lỗi khi xử lý đăng nhập Google:", error);
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Lấy user từ id trong session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});