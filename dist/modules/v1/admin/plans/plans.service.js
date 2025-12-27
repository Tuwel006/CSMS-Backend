"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansService = void 0;
const db_1 = require("../../../../config/db");
const Plan_1 = require("../../shared/entities/Plan");
class PlansService {
    static async createPlan(planData) {
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const plan = planRepository.create({
            ...planData,
            is_active: true
        });
        return await planRepository.save(plan);
    }
    static async getAllPlans() {
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const plans = await planRepository.find({
            order: { createdAt: 'DESC' }
        });
        return { data: plans };
    }
    static async getPlanById(id) {
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        return await planRepository.findOne({ where: { id } });
    }
    static async updatePlan(id, updateData) {
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const plan = await planRepository.findOne({ where: { id } });
        if (!plan)
            return null;
        Object.assign(plan, updateData);
        return await planRepository.save(plan);
    }
    static async deletePlan(id) {
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const result = await planRepository.delete(id);
        if (result && result.affected && result.affected > 0) {
            return true;
        }
        return false;
    }
    static async getActivePlans() {
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const plans = await planRepository.find({
            where: { is_active: true },
            order: { price: 'ASC' }
        });
        return { data: plans };
    }
    static async togglePlanStatus(id) {
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const plan = await planRepository.findOne({ where: { id } });
        if (!plan)
            return null;
        plan.is_active = !plan.is_active;
        return await planRepository.save(plan);
    }
}
exports.PlansService = PlansService;
