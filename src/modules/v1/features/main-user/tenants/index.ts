export { TenantController } from './controller';
export { TenantService } from './service';
export * from './dtos/tenant.dto';
import './swagger/tenant.swagger';
import tenantRoutes from './routes';
export { tenantRoutes };