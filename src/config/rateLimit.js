"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
class RateLimiter {
    constructor() {
        this.global = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000, // Période de 15 minutes
            max: 100, // Limite de 100 requêtes par IP pour chaque 15 minutes
            message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
            standardHeaders: true, // Retourne les informations de rate limiting dans les en-têtes `RateLimit-*`
            legacyHeaders: false, // Désactive les anciens en-têtes `X-RateLimit-*`
        });
        this.auth = (0, express_rate_limit_1.default)({
            windowMs: 10 * 60 * 1000, // Période de 10 minutes
            max: 5, // Limite de 5 requêtes par IP
            message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.',
        });
    }
}
exports.default = RateLimiter;
