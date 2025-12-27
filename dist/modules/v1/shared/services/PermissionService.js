"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const db_1 = require("../../../../config/db");
const UserPlan_1 = require("../entities/UserPlan");
const PlanPermission_1 = require("../entities/PlanPermission");
const UserRole_1 = require("../entities/UserRole");
class PermissionService {
    static async getUserEffectivePermissions(userId) {
        const userPlanRepository = db_1.AppDataSource.getRepository(UserPlan_1.UserPlan);
        const planPermissionRepository = db_1.AppDataSource.getRepository(PlanPermission_1.PlanPermission);
        const userRoleRepository = db_1.AppDataSource.getRepository(UserRole_1.UserRole);
        const userPlan = await userPlanRepository.findOne({
            where: { user: { id: userId }, is_active: true },
            relations: ['plan']
        });
        if (!userPlan) {
            return { permissions: [], limits: {} };
        }
        const planPermissions = await planPermissionRepository.find({
            where: { plan: { id: userPlan.plan.id } },
            relations: ['permission']
        });
        const userRoles = await userRoleRepository.find({
            where: { user: { id: userId } },
            relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission']
        });
        const effectivePermissions = new Map();
        const limits = {};
        planPermissions.forEach(pp => {
            const permName = pp.permission.name;
            effectivePermissions.set(permName, {
                allowed: pp.is_allowed,
                limit: pp.limit_value,
                resource: pp.permission.resource,
                action: pp.permission.action
            });
            if (pp.limit_value !== null) {
                limits[permName] = pp.limit_value;
            }
        });
        const rolePermissions = new Set();
        userRoles.forEach(ur => {
            ur.role.rolePermissions.forEach(rp => {
                rolePermissions.add(rp.permission.name);
            });
        });
        const finalPermissions = [];
        effectivePermissions.forEach((value, key) => {
            if (rolePermissions.has(key) && value.allowed) {
                finalPermissions.push({
                    name: key,
                    resource: value.resource,
                    action: value.action,
                    limit: value.limit
                });
            }
        });
        return {
            permissions: finalPermissions,
            limits,
            usage: {
                matches: userPlan.matches_used,
                tournaments: userPlan.tournaments_used,
                storage: userPlan.storage_used_gb
            }
        };
    }
    static async checkPermission(userId, permissionName) {
        const { permissions } = await this.getUserEffectivePermissions(userId);
        return permissions.some((p) => p?.name === permissionName);
    }
    static async checkLimit(userId, permissionName, requestedAmount = 1) {
        const userPlanRepository = db_1.AppDataSource.getRepository(UserPlan_1.UserPlan);
        const planPermissionRepository = db_1.AppDataSource.getRepository(PlanPermission_1.PlanPermission);
        const userPlan = await userPlanRepository.findOne({
            where: { user: { id: userId }, is_active: true },
            relations: ['plan']
        });
        if (!userPlan) {
            return { allowed: false, remaining: 0 };
        }
        const planPermission = await planPermissionRepository.findOne({
            where: {
                plan: { id: userPlan.plan.id },
                permission: { name: permissionName }
            }
        });
        if (!planPermission || !planPermission.is_allowed) {
            return { allowed: false, remaining: 0 };
        }
        if (planPermission.limit_value === null) {
            return { allowed: true, remaining: -1 };
        }
        const currentUsage = this.getCurrentUsage(userPlan, permissionName);
        const remaining = planPermission.limit_value - currentUsage;
        return {
            allowed: remaining >= requestedAmount,
            remaining: Math.max(0, remaining)
        };
    }
    static getCurrentUsage(userPlan, permissionName) {
        switch (permissionName) {
            case 'create_match':
                return userPlan.matches_used;
            case 'create_tournament':
                return userPlan.tournaments_used;
            case 'storage_access':
                return userPlan.storage_used_gb;
            default:
                return 0;
        }
    }
    static async updateUsage(userId, permissionName, amount) {
        const userPlanRepository = db_1.AppDataSource.getRepository(UserPlan_1.UserPlan);
        const userPlan = await userPlanRepository.findOne({
            where: { user: { id: userId }, is_active: true }
        });
        if (!userPlan)
            return;
        switch (permissionName) {
            case 'create_match':
                userPlan.matches_used += amount;
                break;
            case 'create_tournament':
                userPlan.tournaments_used += amount;
                break;
            case 'storage_access':
                userPlan.storage_used_gb += amount;
                break;
        }
        await userPlanRepository.save(userPlan);
    }
}
exports.PermissionService = PermissionService;
