import { AppDataSource } from '../../../../../config/db';
import { Tenant } from '../../../shared/entities/Tenant';
import { User } from '../../../shared/entities/User';
import { HTTP_STATUS } from '../../../../../constants/status-codes';

export class DashboardService {
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
        currentMatches: 0,
        currentTournaments: 0,
        currentUsers: userCount
      },
      createdAt: tenant.createdAt
    };
  }
}
