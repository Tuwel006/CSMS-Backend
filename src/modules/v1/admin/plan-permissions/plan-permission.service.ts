import { AppDataSource } from '../../../../config/db';
import { PlanPermission } from '../../shared/entities/PlanPermission';
import { Plan } from '../../shared/entities/Plan';
import { Permission } from '../../shared/entities/Permission';
import { HTTP_STATUS } from '../../../../constants/status-codes';

export class PlanPermissionService {
  static async assignPermissionToPlan({ planId, permissionId, limitValue, isAllowed }: any) {
    const planPermissionRepository = AppDataSource.getRepository(PlanPermission);
    const planRepository = AppDataSource.getRepository(Plan);
    const permissionRepository = AppDataSource.getRepository(Permission);

    const plan = await planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Plan not found' };
    }

    const permission = await permissionRepository.findOne({ where: { id: permissionId } });
    if (!permission) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Permission not found' };
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

  static async getPlanPermissions(planId: number) {
    const planPermissionRepository = AppDataSource.getRepository(PlanPermission);
    
    const permissions = await planPermissionRepository.find({
      where: { plan: { id: planId } },
      relations: ['permission'],
      order: { permission: { resource: 'ASC', action: 'ASC' } }
    });
    
    return { data: permissions };
  }

  static async updatePlanPermission(planId: number, permissionId: number, updateData: any) {
    const planPermissionRepository = AppDataSource.getRepository(PlanPermission);
    
    const planPermission = await planPermissionRepository.findOne({
      where: { plan: { id: planId }, permission: { id: permissionId } }
    });

    if (!planPermission) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Plan permission not found' };
    }

    if (updateData.limitValue !== undefined) planPermission.limit_value = updateData.limitValue;
    if (updateData.isAllowed !== undefined) planPermission.is_allowed = updateData.isAllowed;

    return await planPermissionRepository.save(planPermission);
  }

  static async removePlanPermission(planId: number, permissionId: number) {
    const planPermissionRepository = AppDataSource.getRepository(PlanPermission);
    
    const result = await planPermissionRepository.delete({
      plan: { id: planId },
      permission: { id: permissionId }
    });

    if (result.affected === 0) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Plan permission not found' };
    }

    return { message: 'Plan permission removed successfully' };
  }
}