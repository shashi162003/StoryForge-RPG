import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import colors from 'colors';

export default function(passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        user.googleId = profile.id;
                        user.avatar = user.avatar || profile.photos[0].value;
                        await user.save();
                        return done(null, user);
                    }

                    const newUser = {
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        isVerified: true,
                    };
                    user = await User.create(newUser);
                    done(null, user);

                } catch (err) {
                    console.error(`[Passport] Error authenticating user: ${err.message}`);
                    done(err, null);
                }
            }
        )
    );

    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: '/api/auth/github/callback',
                scope: ['user:email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    githubId: profile.id,
                    username: profile.displayName || profile.username,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                };

                try {
                    let user = await User.findOne({ githubId: profile.id });

                    if (user) {
                        done(null, user);
                    } else {
                        user = await User.create(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
};