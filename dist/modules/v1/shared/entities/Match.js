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
exports.Match = exports.MatchFormat = void 0;
const typeorm_1 = require("typeorm");
const Team_1 = require("./Team");
const Tenant_1 = require("./Tenant");
const MatchInnings_1 = require("./MatchInnings");
const User_1 = require("./User");
var MatchFormat;
(function (MatchFormat) {
    MatchFormat["T20"] = "T20";
    MatchFormat["ODI"] = "ODI";
    MatchFormat["TEST"] = "TEST";
})(MatchFormat || (exports.MatchFormat = MatchFormat = {}));
let Match = class Match {
};
exports.Match = Match;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Match.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "team_a_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "team_b_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Match.prototype, "match_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Match.prototype, "is_completed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "match_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Match.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "playing_count", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Match.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Match.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "toss_winner_team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "batting_first_team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "winner_team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "man_of_the_match_player_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "result_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "umpire_1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "umpire_2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Match.prototype, "current_innings_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 2 }),
    __metadata("design:type", Number)
], Match.prototype, "no_of_innings", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => MatchInnings_1.MatchInnings),
    (0, typeorm_1.JoinColumn)({ name: 'current_innings_id' }),
    __metadata("design:type", MatchInnings_1.MatchInnings)
], Match.prototype, "currentInnings", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team),
    (0, typeorm_1.JoinColumn)({ name: 'team_a_id' }),
    __metadata("design:type", Team_1.Team)
], Match.prototype, "teamA", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team),
    (0, typeorm_1.JoinColumn)({ name: 'winner_team_id' }),
    __metadata("design:type", Team_1.Team)
], Match.prototype, "winner", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team),
    (0, typeorm_1.JoinColumn)({ name: 'toss_winner_team_id' }),
    __metadata("design:type", Team_1.Team)
], Match.prototype, "tossWinner", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team),
    (0, typeorm_1.JoinColumn)({ name: 'batting_first_team_id' }),
    __metadata("design:type", Team_1.Team)
], Match.prototype, "battingFirst", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team),
    (0, typeorm_1.JoinColumn)({ name: 'team_b_id' }),
    __metadata("design:type", Team_1.Team)
], Match.prototype, "teamB", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", Tenant_1.Tenant)
], Match.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], Match.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MatchInnings_1.MatchInnings, innings => innings.match),
    __metadata("design:type", Array)
], Match.prototype, "innings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Match.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Match.prototype, "updatedAt", void 0);
exports.Match = Match = __decorate([
    (0, typeorm_1.Entity)('matches'),
    (0, typeorm_1.Index)("idx_match_current_innings", ["id", "tenant_id", "current_innings_id"])
], Match);
