const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const UserIntern = require("../models/userIntern");
const UserRecruiter = require("../models/userRecruiter");

passport.use('github',
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/callback/github`,
      scope: ['user:email'],
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const type = req.query.state === 'recruiter' ? 'recruiter' : 'intern';
        const Model = type === 'recruiter' ? UserRecruiter : UserIntern;

        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Email not available from GitHub."), null);

        let user = await Model.findOne({ githubId: profile.id });
        if (user) return done(null, user, { type });

        user = await Model.findOne({ email: email });
        if (user) {
          user.githubId = profile.id;
          await user.save();
          return done(null, user, { type });
        }

        const newUser = new Model({
          username: profile.displayName || profile.username,
          email: email,
          githubId: profile.id,
          provider: "github",
        });
        await newUser.save();
        return done(null, newUser, { type, new: true });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
