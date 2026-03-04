const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserIntern = require("../models/userIntern");
const UserRecruiter = require("../models/userRecruiter");

passport.use('google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/intern/callback`,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const type = req.query.state === 'recruiter' ? 'recruiter' : 'intern';
        const Model = type === 'recruiter' ? UserRecruiter : UserIntern;

        let user = await Model.findOne({ googleId: profile.id });
        if (user) return done(null, user, { type });

        const newUser = new Model({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails?.[0]?.value,
          provider: "google",
        });
        await newUser.save();
        return done(null, newUser, { type, new: true });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
