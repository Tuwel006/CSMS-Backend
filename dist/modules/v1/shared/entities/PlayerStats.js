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
exports.PlayerStats = void 0;
const typeorm_1 = require("typeorm");
const Match_1 = require("./Match");
const Player_1 = require("./Player");
let PlayerStats = class PlayerStats {
};
exports.PlayerStats = PlayerStats;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PlayerStats.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlayerStats.prototype, "match_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PlayerStats.prototype, "player_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "runs", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "balls_faced", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "fours", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "sixes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], PlayerStats.prototype, "is_out", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "wickets", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 4, scale: 1, default: 0.0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "overs_bowled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "runs_conceded", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "maidens", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "wides", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "no_balls", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "catches", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "run_outs", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStats.prototype, "stumpings", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Match_1.Match, { createForeignKeyConstraints: false }),
    (0, typeorm_1.JoinColumn)({ name: 'match_id' }),
    __metadata("design:type", Match_1.Match)
], PlayerStats.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Player_1.Player, { createForeignKeyConstraints: false }),
    (0, typeorm_1.JoinColumn)({ name: 'player_id' }),
    __metadata("design:type", Player_1.Player)
], PlayerStats.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PlayerStats.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PlayerStats.prototype, "updatedAt", void 0);
exports.PlayerStats = PlayerStats = __decorate([
    (0, typeorm_1.Entity)('player_stats'),
    (0, typeorm_1.Index)(['match_id', 'player_id'], { unique: true })
], PlayerStats);
