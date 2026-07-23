import { AppDataSource } from '../../../../../config/db';
import { Tenant } from '../../../shared/entities/Tenant';
import { User } from '../../../shared/entities/User';
import { HTTP_STATUS } from '../../../../../constants/status-codes';

export class TenantService {
  static async createTenant(userId: number, organizationName: string, planId: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tenantRepository = queryRunner.manager.getRepository(Tenant);
      const userRepository = queryRunner.manager.getRepository(User);

      const existingUser = await userRepository.findOne({ where: { id: userId } });
      if (existingUser?.tenant_id) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: 'User already has a tenant' };
      }

      const tenant = tenantRepository.create({
        name: organizationName,
        owner_user_id: userId,
        plan_id: planId,
      });

      const savedTenant = await tenantRepository.save(tenant);

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
}
