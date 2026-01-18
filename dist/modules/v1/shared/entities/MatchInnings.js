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
exports.MatchInnings = void 0;
const typeorm_1 = require("typeorm");
const Match_1 = require("./Match");
const Team_1 = require("./Team");
let MatchInnings = class MatchInnings {
};
exports.MatchInnings = MatchInnings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MatchInnings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MatchInnings.prototype, "match_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchInnings.prototype, "innings_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchInnings.prototype, "batting_team_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchInnings.prototype, "bowling_team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchInnings.prototype, "runs", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchInnings.prototype, "wickets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 1, default: 0.0 }),
    __metadata("design:type", Number)
], MatchInnings.prototype, "overs", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchInnings.prototype, "balls", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], MatchInnings.prototype, "current_over", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MatchInnings.prototype, "extras", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MatchInnings.prototype, "is_completed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MatchInnings.prototype, "striker_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MatchInnings.prototype, "non_striker_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MatchInnings.prototype, "current_bowler_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchInnings.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Match_1.Match),
    (0, typeorm_1.JoinColumn)({ name: 'match_id' }),
    __metadata("design:type", Match_1.Match)
], MatchInnings.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team),
    (0, typeorm_1.JoinColumn)({ name: 'batting_team_id' }),
    __metadata("design:type", Team_1.Team)
], MatchInnings.prototype, "battingTeam", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team),
    (0, typeorm_1.JoinColumn)({ name: 'bowling_team_id' }),
    __metadata("design:type", Team_1.Team)
], MatchInnings.prototype, "bowlingTeam", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MatchInnings.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MatchInnings.prototype, "updatedAt", void 0);
exports.MatchInnings = MatchInnings = __decorate([
    (0, typeorm_1.Entity)('match_innings')
], MatchInnings);
