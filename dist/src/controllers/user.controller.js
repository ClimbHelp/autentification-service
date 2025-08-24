"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const getProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/");
        return;
    }
    res.json(req.user);
};
exports.getProfile = getProfile;
