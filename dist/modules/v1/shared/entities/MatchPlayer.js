"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchPlayer = void 0;
const typeorm_1 = require("typeorm");
const Match_1 = require("./Match");
const Player_1 = require("./Player");
const Team_1 = require("./Team");
let MatchPlayer = class MatchPlayer {
};
exports.MatchPlayer = MatchPlayer;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], MatchPlayer.prototype, "match_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "player_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Match_1.Match, { createForeignKeyConstraints: false }),
    (0, typeorm_1.JoinColumn)({ name: 'match_id' }),
    __metadata("design:type", Match_1.Match)
], MatchPlayer.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Player_1.Player, { createForeignKeyConstraints: false }),
    (0, typeorm_1.JoinColumn)({ name: 'player_id' }),
    __metadata("design:type", Player_1.Player)
], MatchPlayer.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team, { createForeignKeyConstraints: false }),
    (0, typeorm_1.JoinColumn)({ name: 'team_id' }),
    __metadata("design:type", Team_1.Team)
], MatchPlayer.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MatchPlayer.prototype, "is_playing11", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], MatchPlayer.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "runs", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "balls_faced", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "fours", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "sixes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MatchPlayer.prototype, "is_out", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 4, scale: 1, default: 0.0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "overs_bowled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "runs_conceded", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "wickets", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "maidens", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "catches", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "run_outs", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchPlayer.prototype, "stumpings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MatchPlayer.prototype, "createdAt", void 0);
exports.MatchPlayer = MatchPlayer = __decorate([
    (0, typeorm_1.Entity)('match_players'),
    (0, typeorm_1.Index)(['match_id', 'team_id'])
], MatchPlayer);
