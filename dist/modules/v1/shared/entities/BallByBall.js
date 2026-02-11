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
exports.BallByBall = void 0;
const typeorm_1 = require("typeorm");
const MatchInnings_1 = require("./MatchInnings");
const Match_1 = require("./Match");
let BallByBall = class BallByBall {
};
exports.BallByBall = BallByBall;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BallByBall.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BallByBall.prototype, "match_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BallByBall.prototype, "innings_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], BallByBall.prototype, "over_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], BallByBall.prototype, "ball_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BallByBall.prototype, "ball_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], BallByBall.prototype, "runs", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], BallByBall.prototype, "batsman_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], BallByBall.prototype, "bowler_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BallByBall.prototype, "is_wicket", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BallByBall.prototype, "is_boundary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BallByBall.prototype, "wicket_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BallByBall.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Match_1.Match),
    (0, typeorm_1.JoinColumn)({ name: 'match_id' }),
    __metadata("design:type", Match_1.Match)
], BallByBall.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MatchInnings_1.MatchInnings),
    (0, typeorm_1.JoinColumn)({ name: 'innings_id' }),
    __metadata("design:type", MatchInnings_1.MatchInnings)
], BallByBall.prototype, "innings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BallByBall.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BallByBall.prototype, "updatedAt", void 0);
exports.BallByBall = BallByBall = __decorate([
    (0, typeorm_1.Entity)('ball_by_ball'),
    (0, typeorm_1.Index)("idx_ball_innings_lookup", ["innings_id", "tenant_id", "over_number", "ball_number"])
], BallByBall);
