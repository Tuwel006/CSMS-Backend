"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRoutes = exports.MatchService = exports.MatchController = void 0;
var match_controller_1 = require("./match.controller");
Object.defineProperty(exports, "MatchController", { enumerable: true, get: function () { return match_controller_1.MatchController; } });
var match_service_1 = require("./match.service");
Object.defineProperty(exports, "MatchService", { enumerable: true, get: function () { return match_service_1.MatchService; } });
var match_route_1 = require("./match.route");
Object.defineProperty(exports, "matchRoutes", { enumerable: true, get: function () { return __importDefault(match_route_1).default; } });
