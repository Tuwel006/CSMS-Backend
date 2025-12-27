"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRoutes = exports.TeamService = exports.TeamController = void 0;
var team_controller_1 = require("./team.controller");
Object.defineProperty(exports, "TeamController", { enumerable: true, get: function () { return team_controller_1.TeamController; } });
var team_service_1 = require("./team.service");
Object.defineProperty(exports, "TeamService", { enumerable: true, get: function () { return team_service_1.TeamService; } });
__exportStar(require("./team.dto"), exports);
require("./team.swagger");
const team_routes_1 = __importDefault(require("./team.routes"));
exports.teamRoutes = team_routes_1.default;
