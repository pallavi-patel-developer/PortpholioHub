
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const UserIntern = require("../models/userIntern"); // Assuming userIntern model is correct

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/callback/github", 
      scope: ['user:email'] // It's good practice to request scope here
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Email not available from GitHub."), null);
        }

        let user = await UserIntern.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user); // User exists, log them in
        }

        user = await UserIntern.findOne({ email: email });

        if (user) {
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = new UserIntern({
          username: profile.displayName || profile.username,
          email: email,
          githubId: profile.id,
          provider: "github",
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);