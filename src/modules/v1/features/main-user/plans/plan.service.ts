import { AppDataSource } from '../../../../../config/db';
import { Plan } from '../../../shared/entities/Plan';

export class PlansService {
  static async getAllPlans() {
    const planRepository = AppDataSource.getRepository(Plan);
    const plans = await planRepository.find({
      order: { createdAt: 'DESC' }
    });
    return { data: plans };
  }
}
