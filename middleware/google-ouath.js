import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth2"
import dotenv from "dotenv"
import User from "../DataBase/models/UserModel.js"
import { createToken } from "./authentication.js"
dotenv.config()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALL_BACK_URL,
            passReqToCallback: true,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            let user = await User.findOne({ email: profile.email })
            if (!user)
                user = await User.create({
                    name: profile.displayName,
                    email: profile.email,
                })
            const token = await createToken(user)
            return done(null, { user, token })
        }
    )
)

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})
