"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeeder = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../config/db");
const User_1 = require("../modules/v1/shared/entities/User");
const Plan_1 = require("../modules/v1/shared/entities/Plan");
const Tenant_1 = require("../modules/v1/shared/entities/Tenant");
const Permission_1 = require("../modules/v1/shared/entities/Permission");
const Team_1 = require("../modules/v1/shared/entities/Team");
const Role_1 = require("../modules/v1/shared/entities/Role");
const RolePermission_1 = require("../modules/v1/shared/entities/RolePermission");
class DatabaseSeeder {
    static async run() {
        try {
            console.log('🌱 Starting database seeding...');
            await this.seedPlans();
            await this.seedPermissions();
            await this.seedGlobalAdmin();
            await this.seedTenantData();
            console.log('✅ Database seeding completed successfully!');
        }
        catch (error) {
            console.error('❌ Error seeding database:', error);
            throw error;
        }
    }
    static async seedPlans() {
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const plans = [
            {
                name: 'Free',
                description: 'Perfect for small clubs getting started',
                price: 0,
                currency: 'USD',
                billing_cycle: 'monthly',
                max_matches_per_month: 10,
                max_tournaments_per_month: 2,
                max_users: 5,
                max_admins: 1,
                analytics_enabled: false,
                custom_branding: false,
                api_access: false,
                priority_support: false,
                live_streaming: false,
                advanced_reporting: false,
                is_active: true,
                is_popular: false
            },
            {
                name: 'Pro',
                description: 'For growing cricket organizations',
                price: 29.99,
                currency: 'USD',
                billing_cycle: 'monthly',
                max_matches_per_month: 100,
                max_tournaments_per_month: 10,
                max_users: 25,
                max_admins: 3,
                analytics_enabled: true,
                custom_branding: true,
                api_access: true,
                priority_support: false,
                live_streaming: false,
                advanced_reporting: true,
                is_active: true,
                is_popular: true
            },
            {
                name: 'Enterprise',
                description: 'For large cricket associations',
                price: 99.99,
                currency: 'USD',
                billing_cycle: 'monthly',
                analytics_enabled: true,
                custom_branding: true,
                api_access: true,
                priority_support: true,
                live_streaming: true,
                advanced_reporting: true,
                is_active: true,
                is_popular: false
            }
        ];
        for (const planData of plans) {
            const existing = await planRepository.findOne({ where: { name: planData.name } });
            if (!existing) {
                const plan = planRepository.create(planData);
                await planRepository.save(plan);
                console.log(`📋 Created plan: ${planData.name}`);
            }
        }
    }
    static async seedPermissions() {
        const permissionRepository = db_1.AppDataSource.getRepository(Permission_1.Permission);
        const permissions = [
            { name: 'matches.create', resource: 'matches', action: 'create', description: 'Create new matches' },
            { name: 'matches.read', resource: 'matches', action: 'read', description: 'View matches' },
            { name: 'matches.update', resource: 'matches', action: 'update', description: 'Update match details' },
            { name: 'matches.delete', resource: 'matches', action: 'delete', description: 'Delete matches' },
            { name: 'teams.create', resource: 'teams', action: 'create', description: 'Create new teams' },
            { name: 'teams.read', resource: 'teams', action: 'read', description: 'View teams' },
            { name: 'teams.update', resource: 'teams', action: 'update', description: 'Update team details' },
            { name: 'teams.delete', resource: 'teams', action: 'delete', description: 'Delete teams' },
            { name: 'users.create', resource: 'users', action: 'create', description: 'Create new users' },
            { name: 'users.read', resource: 'users', action: 'read', description: 'View users' },
            { name: 'users.update', resource: 'users', action: 'update', description: 'Update user details' },
            { name: 'users.delete', resource: 'users', action: 'delete', description: 'Delete users' },
            { name: 'roles.manage', resource: 'roles', action: 'manage', description: 'Manage roles and permissions' }
        ];
        for (const permData of permissions) {
            const existing = await permissionRepository.findOne({ where: { name: permData.name } });
            if (!existing) {
                const permission = permissionRepository.create(permData);
                await permissionRepository.save(permission);
                console.log(`🔐 Created permission: ${permData.name}`);
            }
        }
    }
    static async seedGlobalAdmin() {
        const userRepository = db_1.AppDataSource.getRepository(User_1.User);
        const tenantRepository = db_1.AppDataSource.getRepository(Tenant_1.Tenant);
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const adminData = {
            username: 'globaladmin',
            email: 'admin@csms.com',
            password: await bcrypt_1.default.hash('admin123', 10),
            is_global_admin: true
        };
        let admin = await userRepository.findOne({ where: { email: adminData.email } });
        if (!admin) {
            admin = userRepository.create(adminData);
            admin = await userRepository.save(admin);
            console.log('👑 Created global admin user');
        }
        // Create default tenant for admin
        const freePlan = await planRepository.findOne({ where: { name: 'Free' } });
        const defaultTenantData = {
            name: 'Default Admin Tenant',
            owner_user_id: admin.id,
            plan_id: freePlan?.id
        };
        let defaultTenant = await tenantRepository.findOne({ where: { name: defaultTenantData.name } });
        if (!defaultTenant) {
            defaultTenant = tenantRepository.create(defaultTenantData);
            defaultTenant = await tenantRepository.save(defaultTenant);
            // Assign tenant to admin user
            admin.tenant_id = defaultTenant.id;
            await userRepository.save(admin);
            console.log('🏢 Created default tenant for admin');
        }
    }
    static async seedTenantData() {
        const userRepository = db_1.AppDataSource.getRepository(User_1.User);
        const tenantRepository = db_1.AppDataSource.getRepository(Tenant_1.Tenant);
        const teamRepository = db_1.AppDataSource.getRepository(Team_1.Team);
        const roleRepository = db_1.AppDataSource.getRepository(Role_1.Role);
        const rolePermissionRepository = db_1.AppDataSource.getRepository(RolePermission_1.RolePermission);
        const planRepository = db_1.AppDataSource.getRepository(Plan_1.Plan);
        const permissionRepository = db_1.AppDataSource.getRepository(Permission_1.Permission);
        // Create tenant owner
        const tenantOwnerData = {
            username: 'tenantowner',
            email: 'owner@cricketclub.com',
            password: await bcrypt_1.default.hash('owner123', 10),
            is_global_admin: false
        };
        let tenantOwner = await userRepository.findOne({ where: { email: tenantOwnerData.email } });
        if (!tenantOwner) {
            const newOwner = userRepository.create(tenantOwnerData);
            tenantOwner = await userRepository.save(newOwner);
            console.log('👤 Created tenant owner user');
        }
        // Create tenant
        const proPlan = await planRepository.findOne({ where: { name: 'Pro' } });
        const tenantData = {
            name: 'Mumbai Cricket Club',
            owner_user_id: tenantOwner.id,
            plan_id: proPlan?.id
        };
        let tenant = await tenantRepository.findOne({ where: { name: tenantData.name } });
        if (!tenant) {
            const newTenant = tenantRepository.create(tenantData);
            tenant = await tenantRepository.save(newTenant);
            // Update owner with tenant_id
            tenantOwner.tenant_id = tenant.id;
            await userRepository.save(tenantOwner);
            console.log('🏢 Created tenant: Mumbai Cricket Club');
        }
        // Create tenant users
        const tenantUsers = [
            { username: 'scorekeeper', email: 'scorer@cricketclub.com', password: 'scorer123' },
            { username: 'manager', email: 'manager@cricketclub.com', password: 'manager123' },
            { username: 'player1', email: 'player1@cricketclub.com', password: 'player123' }
        ];
        for (const userData of tenantUsers) {
            const existing = await userRepository.findOne({ where: { email: userData.email } });
            if (!existing) {
                const newUser = userRepository.create({
                    ...userData,
                    password: await bcrypt_1.default.hash(userData.password, 10),
                    is_global_admin: false,
                    tenant_id: tenant.id
                });
                await userRepository.save(newUser);
                console.log(`👥 Created tenant user: ${userData.username}`);
            }
        }
        // Create teams for tenant
        const teams = [
            { name: 'Mumbai Warriors', short_name: 'MW', location: 'Mumbai, India', tenant_id: tenant.id },
            { name: 'Delhi Capitals', short_name: 'DC', location: 'Delhi, India', tenant_id: tenant.id },
            { name: 'Chennai Super Kings', short_name: 'CSK', location: 'Chennai, India', tenant_id: tenant.id },
            { name: 'Kolkata Knight Riders', short_name: 'KKR', location: 'Kolkata, India', tenant_id: tenant.id }
        ];
        for (const teamData of teams) {
            const existing = await teamRepository.findOne({ where: { name: teamData.name } });
            if (!existing) {
                const team = teamRepository.create({
                    ...teamData,
                    is_active: true
                });
                await teamRepository.save(team);
                console.log(`🏏 Created team: ${teamData.name}`);
            }
        }
        // Create roles for tenant
        const permissions = await permissionRepository.find();
        const roleData = [
            {
                name: 'Admin',
                description: 'Full access to all features',
                tenant_id: tenant.id,
                permissionIds: permissions.map(p => p.id)
            },
            {
                name: 'Score Keeper',
                description: 'Can manage matches and scores',
                tenant_id: tenant.id,
                permissionIds: permissions.filter(p => p.resource === 'matches').map(p => p.id)
            },
            {
                name: 'Team Manager',
                description: 'Can manage teams and players',
                tenant_id: tenant.id,
                permissionIds: permissions.filter(p => p.resource === 'teams').map(p => p.id)
            }
        ];
        for (const role of roleData) {
            const existing = await roleRepository.findOne({
                where: { name: role.name, tenant_id: role.tenant_id }
            });
            if (!existing) {
                const newRole = roleRepository.create({
                    name: role.name,
                    description: role.description,
                    tenant_id: role.tenant_id,
                    is_active: true
                });
                const savedRole = await roleRepository.save(newRole);
                // Assign permissions to role
                for (const permissionId of role.permissionIds) {
                    const rolePermission = rolePermissionRepository.create({
                        role: savedRole,
                        permission: { id: permissionId }
                    });
                    await rolePermissionRepository.save(rolePermission);
                }
                console.log(`🎭 Created role: ${role.name}`);
            }
        }
    }
}
exports.DatabaseSeeder = DatabaseSeeder;
