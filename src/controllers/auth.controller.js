"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.authCallback = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const fetch = require("node-fetch");
const bddServiceUrl = env_1.BDD_SERVICE_URL || 'http://localhost:3003';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const authCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    // Récupérer les infos du profil Google
    const user = req.user;
    const username = (user === null || user === void 0 ? void 0 : user.displayName) || (user === null || user === void 0 ? void 0 : user.name) || ((_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.split('@')[0]) || "user";
    const email = (_e = (_d = user === null || user === void 0 ? void 0 : user.emails) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.value;
    const password = "Test12345!";
    // Appel à l'API bdd-service pour créer l'utilisateur
    if (username && email) {
        try {
            let userId;
            let userData;
            let premium = false;
            // D'abord, essayer de récupérer l'utilisateur existant
            const searchResponse = yield fetch(`${bddServiceUrl}/api/users/search?email=${encodeURIComponent(email)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            if (searchResponse.ok) {
                const searchData = yield searchResponse.json();
                if (searchData.data && searchData.data.length > 0) {
                    // L'utilisateur existe déjà
                    userData = searchData.data[0];
                    console.log("🚀 ~ authCallback ~ userData:", userData);
                    userId = userData.id;
                    premium = userData.premium;
                }
                else {
                    // L'utilisateur n'existe pas, le créer
                    const createResponse = yield fetch(`${bddServiceUrl}/api/users`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, email, password })
                    });
                    if (!createResponse.ok) {
                        throw new Error(`Failed to create user: ${createResponse.statusText}`);
                    }
                    const createData = yield createResponse.json();
                    userData = createData.data;
                    userId = createData.data.id;
                    console.log("Nouvel utilisateur créé:", userId);
                }
            }
            else {
                // Si la recherche échoue, essayer de créer l'utilisateur
                const createResponse = yield fetch(`${bddServiceUrl}/api/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password })
                });
                if (!createResponse.ok) {
                    throw new Error(`Failed to create user: ${createResponse.statusText}`);
                }
                const createData = yield createResponse.json();
                userData = createData.data;
                userId = createData.data.id;
                console.log("Nouvel utilisateur créé (recherche échouée):", userId);
            }
            if (!userId) {
                throw new Error('User ID not found or returned');
            }
            // Génération du token JWT avec l'ID utilisateur
            const token = jsonwebtoken_1.default.sign({
                username,
                email,
                userId,
                premium
            }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h", audience: env_1.GOOGLE_CLIENT_ID });
            // Redirection vers le frontend avec le token
            res.redirect(`${frontendUrl}/auth-callback?token=${token}`);
        }
        catch (err) {
            console.error("Erreur lors de l'authentification:", err);
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            res.redirect(`${frontendUrl}/auth-callback?error=Erreur lors de l'authentification: ${errorMessage}`);
        }
    }
    else {
        res.redirect(`${frontendUrl}/auth-callback?error=Informations utilisateur manquantes`);
    }
});
exports.authCallback = authCallback;
const logout = (req, res) => {
    req.logout({}, () => {
        res.redirect("/");
    });
};
exports.logout = logout;
