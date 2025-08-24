"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BDD_SERVICE_URL = exports.GOOGLE_CLIENT_ID = exports.GOOGLE_CLIENT_SECRET = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
_a = process.env, exports.PORT = _a.PORT, exports.GOOGLE_CLIENT_SECRET = _a.GOOGLE_CLIENT_SECRET, exports.GOOGLE_CLIENT_ID = _a.GOOGLE_CLIENT_ID, exports.BDD_SERVICE_URL = _a.BDD_SERVICE_URL;
