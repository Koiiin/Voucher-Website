const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user'); // Model người dùng



passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name', 'displayName']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Facebook profile:', profile);

    const existingUser = await User.findOne({ facebookId: profile.id });
    if (existingUser) return done(null, existingUser);

    const newUser = await User.create({
      username: profile.displayName,
      email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
      facebookId: profile.id,
    });
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}
));
