import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";

// Configure Google OAuth 2.0 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user info from Google profile
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const picture = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        // Find existing user or create new one
        let user = await User.findOne({ googleId });

        if (!user) {
          // Create new user
          user = await User.create({
            googleId,
            email,
            name,
            picture,
            accessToken,
            refreshToken,
          });
        } else {
          // Update existing user info and tokens
          user.name = name;
          user.picture = picture;
          user.accessToken = accessToken;
          // Only update refresh token if provided (Google may not always return it)
          if (refreshToken) {
            user.refreshToken = refreshToken;
          }
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Serialize user to session (stores user._id in session)
passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

// Deserialize user from session (retrieves full user object)
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;