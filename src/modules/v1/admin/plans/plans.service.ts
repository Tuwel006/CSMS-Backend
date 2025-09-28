import { AppDataSource } from '../../../../config/db';
import { Plan } from '../../shared/entities/Plan';
import { CreatePlanDto, UpdatePlanDto } from './plans.dto';

export class PlansService {
  static async createPlan(planData: CreatePlanDto) {
    const planRepository = AppDataSource.getRepository(Plan);
    
    const plan = planRepository.create({
      ...planData,
      is_active: true
    });
    
    return await planRepository.save(plan);
  }

  static async getAllPlans() {
    const planRepository = AppDataSource.getRepository(Plan);
    return await planRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  static async getPlanById(id: number) {
    const planRepository = AppDataSource.getRepository(Plan);
    return await planRepository.findOne({ where: { id } });
  }

  static async updatePlan(id: number, updateData: UpdatePlanDto) {
    const planRepository = AppDataSource.getRepository(Plan);
    
    const plan = await planRepository.findOne({ where: { id } });
    if (!plan) return null;

    Object.assign(plan, updateData);
    return await planRepository.save(plan);
  }

  static async deletePlan(id: number) {
    const planRepository = AppDataSource.getRepository(Plan);
    
    const result = await planRepository.delete(id);
    return result.affected > 0;
  }

  static async getActivePlans() {
    const planRepository = AppDataSource.getRepository(Plan);
    return await planRepository.find({
      where: { is_active: true },
      order: { price: 'ASC' }
    });
  }

  static async togglePlanStatus(id: number) {
    const planRepository = AppDataSource.getRepository(Plan);
    
    const plan = await planRepository.findOne({ where: { id } });
    if (!plan) return null;

    plan.is_active = !plan.is_active;
    return await planRepository.save(plan);
  }
}