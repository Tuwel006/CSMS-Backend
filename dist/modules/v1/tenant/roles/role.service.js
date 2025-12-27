"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const db_1 = require("../../../../config/db");
const Role_1 = require("../../shared/entities/Role");
const Permission_1 = require("../../shared/entities/Permission");
const RolePermission_1 = require("../../shared/entities/RolePermission");
const status_codes_1 = require("../../../../constants/status-codes");
class RoleService {
    static async createRole(tenantId, { name, description, permissionIds }) {
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const roleRepository = queryRunner.manager.getRepository(Role_1.Role);
            const permissionRepository = queryRunner.manager.getRepository(Permission_1.Permission);
            const rolePermissionRepository = queryRunner.manager.getRepository(RolePermission_1.RolePermission);
            // Check if role name exists in tenant
            const existingRole = await roleRepository.findOne({
                where: { name, tenant_id: tenantId }
            });
            if (existingRole) {
                throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'Role name already exists in this tenant' };
            }
            // Validate permissions exist
            const permissions = await permissionRepository.findByIds(permissionIds);
            if (permissions.length !== permissionIds.length) {
                throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'Some permissions do not exist' };
            }
            // Create role
            const role = roleRepository.create({
                name,
                description,
                tenant_id: tenantId
            });
            const savedRole = await roleRepository.save(role);
            // Assign permissions to role
            const rolePermissions = permissionIds.map((permissionId) => rolePermissionRepository.create({
                role: savedRole,
                permission: { id: permissionId }
            }));
            await rolePermissionRepository.save(rolePermissions);
            await queryRunner.commitTransaction();
            return await this.getRoleById(savedRole.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async getRolesByTenant(tenantId, page = 1, limit = 10) {
        const roleRepository = db_1.AppDataSource.getRepository(Role_1.Role);
        const [roles, total] = await roleRepository.findAndCount({
            where: { tenant_id: tenantId },
            relations: ['rolePermissions', 'rolePermissions.permission'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' }
        });
        const formattedRoles = roles.map(role => ({
            id: role.id,
            name: role.name,
            description: role.description,
            tenantId: role.tenant_id,
            isActive: role.is_active,
            permissions: role.rolePermissions.map(rp => ({
                id: rp.permission.id,
                name: rp.permission.name,
                resource: rp.permission.resource,
                action: rp.permission.action,
                description: rp.permission.description
            })),
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        }));
        const totalPages = Math.ceil(total / limit);
        return {
            data: formattedRoles,
            meta: {
                total,
                page,
                limit,
                totalPages
            }
        };
    }
    static async getRoleById(roleId) {
        const roleRepository = db_1.AppDataSource.getRepository(Role_1.Role);
        const role = await roleRepository.findOne({
            where: { id: roleId },
            relations: ['rolePermissions', 'rolePermissions.permission']
        });
        if (!role) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Role not found' };
        }
        return {
            id: role.id,
            name: role.name,
            description: role.description,
            tenantId: role.tenant_id,
            isActive: role.is_active,
            permissions: role.rolePermissions.map(rp => ({
                id: rp.permission.id,
                name: rp.permission.name,
                resource: rp.permission.resource,
                action: rp.permission.action,
                description: rp.permission.description
            })),
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        };
    }
    static async updateRole(roleId, tenantId, updateData) {
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const roleRepository = queryRunner.manager.getRepository(Role_1.Role);
            const permissionRepository = queryRunner.manager.getRepository(Permission_1.Permission);
            const rolePermissionRepository = queryRunner.manager.getRepository(RolePermission_1.RolePermission);
            const role = await roleRepository.findOne({
                where: { id: roleId, tenant_id: tenantId }
            });
            if (!role) {
                throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Role not found' };
            }
            // Update basic fields
            if (updateData.name)
                role.name = updateData.name;
            if (updateData.description !== undefined)
                role.description = updateData.description;
            if (updateData.isActive !== undefined)
                role.is_active = updateData.isActive;
            await roleRepository.save(role);
            // Update permissions if provided
            if (updateData.permissionIds) {
                // Validate permissions exist
                const permissions = await permissionRepository.findByIds(updateData.permissionIds);
                if (permissions.length !== updateData.permissionIds.length) {
                    throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'Some permissions do not exist' };
                }
                // Remove existing permissions
                await rolePermissionRepository.delete({ role: { id: roleId } });
                // Add new permissions
                const rolePermissions = updateData.permissionIds.map((permissionId) => rolePermissionRepository.create({
                    role: { id: roleId },
                    permission: { id: permissionId }
                }));
                await rolePermissionRepository.save(rolePermissions);
            }
            await queryRunner.commitTransaction();
            return await this.getRoleById(roleId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async deleteRole(roleId, tenantId) {
        const roleRepository = db_1.AppDataSource.getRepository(Role_1.Role);
        const role = await roleRepository.findOne({
            where: { id: roleId, tenant_id: tenantId }
        });
        if (!role) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Role not found' };
        }
        await roleRepository.remove(role);
        return { message: 'Role deleted successfully' };
    }
    static async getAllPermissions() {
        const permissionRepository = db_1.AppDataSource.getRepository(Permission_1.Permission);
        const permissions = await permissionRepository.find({
            where: { is_active: true },
            order: { resource: 'ASC', action: 'ASC' }
        });
        return { data: permissions };
    }
}
exports.RoleService = RoleService;
