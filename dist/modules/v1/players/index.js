"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerPaths = exports.playerRoutes = void 0;
var player_routes_1 = require("./player.routes");
Object.defineProperty(exports, "playerRoutes", { enumerable: true, get: function () { return __importDefault(player_routes_1).default; } });
var player_swagger_1 = require("./player.swagger");
Object.defineProperty(exports, "playerPaths", { enumerable: true, get: function () { return player_swagger_1.playerPaths; } });
