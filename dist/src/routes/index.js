"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("../controllers/auth.controller");
const user_controller_1 = require("../controllers/user.controller");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
// Auth routes
router.get("/auth", passport_1.default.authenticate("openidconnect", {
    scope: ["openid", "profile", "email"],
}));
router.get("/auth/callback", passport_1.default.authenticate("openidconnect", { failureRedirect: "/" }), auth_controller_1.authCallback);
router.get("/logout", auth_controller_1.logout);
// User route
router.get("/profile", user_controller_1.getProfile);
// Health check
router.get("/health", health_controller_1.healthCheck);
exports.default = router;
