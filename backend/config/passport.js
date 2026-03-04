const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserIntern = require("../models/userIntern");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/intern/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserIntern.findOne({ googleId: profile.id });

        if (!user) {
          user = new UserIntern({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            provider: "google",
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // serialize Mongo _id instead of whole user object
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserIntern.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
