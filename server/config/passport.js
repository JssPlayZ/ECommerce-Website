import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import User from '../models/User.js';

export default function(passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
                proxy: true
            },
            async (accessToken, refreshToken, profile, done) => {
                // This function is called after Google successfully authenticates the user.
                // 'profile' contains the user's Google info (name, email, etc.)
                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    // We can't get a password, so Google-based users will only log in via Google
                };

                try {
                    // Check if user already exists in our database
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // User already exists, log them in
                        done(null, user);
                    } else {
                        // User doesn't exist, check if email is already in use
                        user = await User.findOne({ email: profile.emails[0].value });
                        if(user) {
                             // Email is in use, but not with Google. 
                             // This is a complex case, for now we'll just deny login.
                             // A more advanced app might link the accounts.
                             done(new Error('This email is already registered. Please log in with your password.'), null);
                        } else {
                            // Create a new user in our database
                            user = await User.create(newUser);
                            done(null, user);
                        }
                    }
                } catch (err) {
                    console.error(err);
                    done(err, null);
                }
            }
        )
    );

    // These functions are required by passport-session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}