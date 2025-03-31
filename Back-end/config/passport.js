const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            //thêm user vào database
            try {
                const user = await User.findOne({ googleId: profile.id});
                if(!user) {
                    user = await User.create({
                        googleId: profile.id,
                        username: profile.emails[0].value.split("@")[0], // Lấy phần trước @ của email
                        email: profile.emails[0].value,
                    })
                }    

                done(null, user);
            } 
            catch (error) {
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});