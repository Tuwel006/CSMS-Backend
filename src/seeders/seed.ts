import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/db';
import { User } from '../modules/v1/shared/entities/User';
import { Plan } from '../modules/v1/shared/entities/Plan';
import { Tenant } from '../modules/v1/shared/entities/Tenant';
import { Team } from '../modules/v1/shared/entities/Team';
import { Player, PlayerRole } from '../modules/v1/shared/entities/Player';

export class DatabaseSeeder {
  static async run() {
    try {
      console.log('🌱 Starting database seeding...');

      await this.seedPlans();
      await this.seedGlobalAdmin();
      await this.seedTenantData();
      await this.seedPlayers();

      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      throw error;
    }
  }

  private static async seedPlans() {
    const planRepository = AppDataSource.getRepository(Plan);

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

  private static async seedGlobalAdmin() {
    const userRepository = AppDataSource.getRepository(User);
    const tenantRepository = AppDataSource.getRepository(Tenant);
    const planRepository = AppDataSource.getRepository(Plan);

    const adminData = {
      username: 'globaladmin',
      email: 'admin@csms.com',
      password: await bcrypt.hash('admin123', 10),
      is_global_admin: true
    };

    let admin = await userRepository.findOne({ where: { email: adminData.email } });
    if (!admin) {
      admin = userRepository.create(adminData);
      admin = await userRepository.save(admin);
      console.log('👑 Created global admin user');
    }

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

      admin.tenant_id = defaultTenant.id;
      await userRepository.save(admin);

      console.log('🏢 Created default tenant for admin');
    }
  }

  private static async seedTenantData() {
    const userRepository = AppDataSource.getRepository(User);
    const tenantRepository = AppDataSource.getRepository(Tenant);
    const teamRepository = AppDataSource.getRepository(Team);
    const planRepository = AppDataSource.getRepository(Plan);

    const tenantOwnerData = {
      username: 'tenantowner',
      email: 'owner@cricketclub.com',
      password: await bcrypt.hash('owner123', 10),
      is_global_admin: false
    };

    let tenantOwner = await userRepository.findOne({ where: { email: tenantOwnerData.email } });
    if (!tenantOwner) {
      const newOwner = userRepository.create(tenantOwnerData);
      tenantOwner = await userRepository.save(newOwner);
      console.log('👤 Created tenant owner user');
    }

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

      tenantOwner.tenant_id = tenant.id;
      await userRepository.save(tenantOwner);

      console.log('🏢 Created tenant: Mumbai Cricket Club');
    }

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
          password: await bcrypt.hash(userData.password, 10),
          is_global_admin: false,
          tenant_id: tenant.id
        });
        await userRepository.save(newUser);
        console.log(`👥 Created tenant user: ${userData.username}`);
      }
    }

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
  }

  private static async seedPlayers() {
    const playerRepository = AppDataSource.getRepository(Player);

    const players = [
      { full_name: 'Virat Kohli', role: PlayerRole.BATSMAN },
      { full_name: 'Rohit Sharma', role: PlayerRole.BATSMAN },
      { full_name: 'KL Rahul', role: PlayerRole.WICKETKEEPER },
      { full_name: 'Rishabh Pant', role: PlayerRole.WICKETKEEPER },
      { full_name: 'Hardik Pandya', role: PlayerRole.ALLROUNDER },
      { full_name: 'Ravindra Jadeja', role: PlayerRole.ALLROUNDER },
      { full_name: 'Jasprit Bumrah', role: PlayerRole.BOWLER },
      { full_name: 'Mohammed Shami', role: PlayerRole.BOWLER },
      { full_name: 'Yuzvendra Chahal', role: PlayerRole.BOWLER },
      { full_name: 'Kuldeep Yadav', role: PlayerRole.BOWLER },
      { full_name: 'Bhuvneshwar Kumar', role: PlayerRole.BOWLER },
      { full_name: 'Shikhar Dhawan', role: PlayerRole.BATSMAN },
      { full_name: 'Suryakumar Yadav', role: PlayerRole.BATSMAN },
      { full_name: 'Shreyas Iyer', role: PlayerRole.BATSMAN },
      { full_name: 'Axar Patel', role: PlayerRole.ALLROUNDER },
      { full_name: 'Deepak Chahar', role: PlayerRole.BOWLER },
      { full_name: 'Shardul Thakur', role: PlayerRole.BOWLER },
      { full_name: 'Mohammed Siraj', role: PlayerRole.BOWLER },
      { full_name: 'Ishan Kishan', role: PlayerRole.WICKETKEEPER },
      { full_name: 'Sanju Samson', role: PlayerRole.WICKETKEEPER },
      { full_name: 'Washington Sundar', role: PlayerRole.ALLROUNDER },
      { full_name: 'Venkatesh Iyer', role: PlayerRole.ALLROUNDER }
    ];

    for (const playerData of players) {
      const existing = await playerRepository.findOne({ where: { full_name: playerData.full_name } });
      if (!existing) {
        const player = playerRepository.create(playerData);
        await playerRepository.save(player);
        console.log(`👤 Created player: ${playerData.full_name}`);
      }
    }
  }
}
