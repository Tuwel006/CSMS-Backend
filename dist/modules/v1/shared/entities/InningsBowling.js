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
exports.InningsBowling = void 0;
const typeorm_1 = require("typeorm");
const MatchInnings_1 = require("./MatchInnings");
const Player_1 = require("./Player");
let InningsBowling = class InningsBowling {
};
exports.InningsBowling = InningsBowling;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InningsBowling.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], InningsBowling.prototype, "innings_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], InningsBowling.prototype, "player_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], InningsBowling.prototype, "over", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], InningsBowling.prototype, "runs", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], InningsBowling.prototype, "balls", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], InningsBowling.prototype, "wickets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], InningsBowling.prototype, "economy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], InningsBowling.prototype, "is_current_bowler", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], InningsBowling.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MatchInnings_1.MatchInnings),
    (0, typeorm_1.JoinColumn)({ name: 'innings_id' }),
    __metadata("design:type", MatchInnings_1.MatchInnings)
], InningsBowling.prototype, "innings", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Player_1.Player),
    (0, typeorm_1.JoinColumn)({ name: 'player_id' }),
    __metadata("design:type", Player_1.Player)
], InningsBowling.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], InningsBowling.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], InningsBowling.prototype, "updatedAt", void 0);
exports.InningsBowling = InningsBowling = __decorate([
    (0, typeorm_1.Entity)('innings_bowling')
], InningsBowling);
