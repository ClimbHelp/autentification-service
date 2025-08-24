"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = configurePassport;
const passport_1 = __importDefault(require("passport"));
const passport_openidconnect_1 = require("passport-openidconnect");
const env_1 = require("./env");
function configurePassport() {
    passport_1.default.use(new passport_openidconnect_1.Strategy({
        issuer: "https://accounts.google.com",
        authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenURL: "https://oauth2.googleapis.com/token",
        userInfoURL: "https://openidconnect.googleapis.com/v1/userinfo",
        clientID: env_1.GOOGLE_CLIENT_ID,
        clientSecret: env_1.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/callback",
        scope: ["openid", "profile", "email"],
    }, (_issuer, profile, cb) => {
        return cb(null, profile);
    }));
    passport_1.default.serializeUser((user, done) => done(null, user));
    passport_1.default.deserializeUser((obj, done) => done(null, obj));
}
