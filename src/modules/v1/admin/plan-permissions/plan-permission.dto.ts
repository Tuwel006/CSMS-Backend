export interface AssignPlanPermissionDto {
  planId: number;
  permissionId: number;
  limitValue?: number;
  isAllowed: boolean;
}

export interface UpdatePlanPermissionDto {
  limitValue?: number;
  isAllowed?: boolean;
}

export interface PlanPermissionResponseDto {
  id: number;
  planId: number;
  permissionId: number;
  permission: {
    id: number;
    name: string;
    resource: string;
    action: string;
    description: string;
  };
  limitValue: number | null;
  isAllowed: boolean;
  createdAt: Date;
}