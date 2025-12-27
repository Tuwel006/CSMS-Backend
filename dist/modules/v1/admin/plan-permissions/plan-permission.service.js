"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanPermissionService = void 0;
const db_1 = require("../../../../config/db");
const PlanPermission_1 = require("../../shared/entities/PlanPermission");
const Plan_1 = require("../../shared/entities/Plan");
const Permission_1 = require("../../shared/entities/Permission");
const status_codes_1 = require("../../../../constants/status-codes");
class PlanPermissionService {
    static async assignPermissionToPlan({ planId, permissionId, limitValue, isAllowed }) {
        const planPermissionRepository = db_1.AppDataSource.getRepository(PlanPermission_1.PlanPermission);
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const permissionRepository = db_1.AppDataSource.getRepository(Permission_1.Permission);
        const plan = await planRepository.findOne({ where: { id: planId } });
        if (!plan) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Plan not found' };
        }
        const permission = await permissionRepository.findOne({ where: { id: permissionId } });
        if (!permission) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Permission not found' };
        }
        const existing = await planPermissionRepository.findOne({
            where: { plan: { id: planId }, permission: { id: permissionId } }
        });
        if (existing) {
            existing.limit_value = limitValue;
            existing.is_allowed = isAllowed;
            return await planPermissionRepository.save(existing);
        }
        const planPermission = planPermissionRepository.create({
            plan: { id: planId },
            permission: { id: permissionId },
            limit_value: limitValue,
            is_allowed: isAllowed
        });
        return await planPermissionRepository.save(planPermission);
    }
    static async getPlanPermissions(planId) {
        const planPermissionRepository = db_1.AppDataSource.getRepository(PlanPermission_1.PlanPermission);
        const permissions = await planPermissionRepository.find({
            where: { plan: { id: planId } },
            relations: ['permission'],
            order: { permission: { resource: 'ASC', action: 'ASC' } }
        });
        return { data: permissions };
    }
    static async updatePlanPermission(planId, permissionId, updateData) {
        const planPermissionRepository = db_1.AppDataSource.getRepository(PlanPermission_1.PlanPermission);
        const planPermission = await planPermissionRepository.findOne({
            where: { plan: { id: planId }, permission: { id: permissionId } }
        });
        if (!planPermission) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Plan permission not found' };
        }
        if (updateData.limitValue !== undefined)
            planPermission.limit_value = updateData.limitValue;
        if (updateData.isAllowed !== undefined)
            planPermission.is_allowed = updateData.isAllowed;
        return await planPermissionRepository.save(planPermission);
    }
    static async removePlanPermission(planId, permissionId) {
        const planPermissionRepository = db_1.AppDataSource.getRepository(PlanPermission_1.PlanPermission);
        const result = await planPermissionRepository.delete({
            plan: { id: planId },
            permission: { id: permissionId }
        });
        if (result.affected === 0) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Plan permission not found' };
        }
        return { message: 'Plan permission removed successfully' };
    }
}
exports.PlanPermissionService = PlanPermissionService;
