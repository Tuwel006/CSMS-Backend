export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds: number[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: number[];
  isActive?: boolean;
}

export interface RoleResponseDto {
  id: number;
  name: string;
  description: string | null;
  tenantId: number;
  isActive: boolean;
  permissions: PermissionDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionDto {
  id: number;
  name: string;
  resource: string;
  action: string;
  description: string | null;
}

export interface RoleListResponseDto {
  data: RoleResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}