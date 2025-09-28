import { AppDataSource } from '../../../../config/db';
import { Tenant } from '../../shared/entities/Tenant';
import { Plan } from '../../shared/entities/Plan';
import { User } from '../../shared/entities/User';
import { HTTP_STATUS } from '../../../../constants/status-codes';

export class TenantService {
  static async createTenant(userId: number, organizationName: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tenantRepository = queryRunner.manager.getRepository(Tenant);
      const userRepository = queryRunner.manager.getRepository(User);

      // Check if user already has a tenant
      const existingUser = await userRepository.findOne({ where: { id: userId } });
      if (existingUser?.tenant_id) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: 'User already has a tenant' };
      }

      // Create tenant
      const tenant = tenantRepository.create({
        name: organizationName,
        owner_user_id: userId
      });
      
      const savedTenant = await tenantRepository.save(tenant);

      // Update user with tenant_id
      await userRepository.update(userId, { tenant_id: savedTenant.id });

      await queryRunner.commitTransaction();
      return savedTenant;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async getTenantDashboard(tenantId: number) {
    const tenantRepository = AppDataSource.getRepository(Tenant);
    const userRepository = AppDataSource.getRepository(User);
    
    const tenant = await tenantRepository.findOne({
      where: { id: tenantId },
      relations: ['plan']
    });

    if (!tenant) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Tenant not found' };
    }

    const userCount = await userRepository.count({ where: { tenant_id: tenantId } });

    return {
      id: tenant.id,
      name: tenant.name,
      planId: tenant.plan_id,
      plan: tenant.plan ? {
        id: tenant.plan.id,
        name: tenant.plan.name,
        maxMatches: tenant.plan.max_matches_per_month,
        maxTournaments: tenant.plan.max_tournaments_per_month,
        maxUsers: tenant.plan.max_users
      } : null,
      usage: {
        currentMatches: 0, // TODO: Implement match counting
        currentTournaments: 0, // TODO: Implement tournament counting
        currentUsers: userCount
      },
      createdAt: tenant.createdAt
    };
  }

  static async updateTenant(tenantId: number, updateData: any) {
    const tenantRepository = AppDataSource.getRepository(Tenant);
    
    const tenant = await tenantRepository.findOne({ where: { id: tenantId } });
    if (!tenant) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Tenant not found' };
    }

    await tenantRepository.update(tenantId, updateData);
    
    return await tenantRepository.findOne({
      where: { id: tenantId },
      relations: ['plan', 'owner']
    });
  }
}