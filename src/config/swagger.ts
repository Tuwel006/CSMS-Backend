import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userAuthPaths } from '../modules/v1/user/auth/userAuth.swagger';
import { plansPaths } from '../modules/v1/admin/plans/plans.swagger';
import { planPermissionPaths } from '../modules/v1/admin/plan-permissions/plan-permission.swagger';
import { tenantPaths } from '../modules/v1/tenant/tenants/tenant.swagger';
import { rolePaths } from '../modules/v1/tenant/roles/role.swagger';
import { teamPaths } from '../modules/v1/teams/team.swagger';
import { matchPaths } from '../modules/v1/tenant/matchs/match.swagger';
import { matchesPaths } from '../modules/v1/matches/matches.swagger';
import { playerPaths } from '../modules/v1/players/player.swagger';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSMS Backend API',
      version: '1.0.0',
      description: 'A comprehensive API for Customer Service Management System',
      contact: {
        name: 'API Support',
        email: 'support@csms.com'
      }
    },
    servers: [
      {
        url: process.env.SERVER_URL || 'http://localhost:5000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            subscription: {
              type: 'string',
              description: 'User subscription type'
            },
            role: {
              type: 'string',
              description: 'User role (user/admin)'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              description: 'Username (minimum 3 characters)'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Valid email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (minimum 6 characters)'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            password: {
              type: 'string',
              description: 'User password'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        CreatePlanRequest: {
          type: 'object',
          required: ['name', 'description', 'price', 'currency', 'billing_cycle'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Plan name (2-100 characters)',
              'x-input-type': 'text',
              'x-placeholder': 'Enter plan name'
            },
            description: {
              type: 'string',
              maxLength: 500,
              description: 'Plan description (max 500 characters)',
              'x-input-type': 'textarea',
              'x-placeholder': 'Enter plan description'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Plan price (minimum 0)',
              'x-input-type': 'number',
              'x-placeholder': '0.00'
            },
            currency: {
              type: 'string',
              description: 'Currency code',
              'x-input-type': 'select',
              'x-options': [
                { label: 'USD - US Dollar', value: 'USD' },
                { label: 'EUR - Euro', value: 'EUR' },
                { label: 'GBP - British Pound', value: 'GBP' },
                { label: 'INR - Indian Rupee', value: 'INR' }
              ]
            },
            billing_cycle: {
              type: 'string',
              enum: ['monthly', 'yearly', 'lifetime'],
              description: 'Billing cycle',
              'x-input-type': 'select',
              'x-options': [
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
                { label: 'Lifetime', value: 'lifetime' }
              ]
            },
            max_matches_per_month: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum matches per month (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_matches_per_day: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum matches per day (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_total_matches: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum total matches (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_tournaments_per_month: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum tournaments per month (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_tournaments_per_year: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum tournaments per year (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_users: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum users (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_admins: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum admins (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_match_duration_hours: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum match duration in hours (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_tournament_duration_days: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum tournament duration in days (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_storage_gb: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum storage in GB (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            max_file_size_mb: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'Maximum file size in MB (leave empty for unlimited)',
              'x-input-type': 'number',
              'x-placeholder': 'Unlimited'
            },
            analytics_enabled: {
              type: 'boolean',
              default: false,
              description: 'Enable analytics feature',
              'x-input-type': 'checkbox'
            },
            custom_branding: {
              type: 'boolean',
              default: false,
              description: 'Enable custom branding',
              'x-input-type': 'checkbox'
            },
            api_access: {
              type: 'boolean',
              default: false,
              description: 'Enable API access',
              'x-input-type': 'checkbox'
            },
            priority_support: {
              type: 'boolean',
              default: false,
              description: 'Enable priority support',
              'x-input-type': 'checkbox'
            },
            live_streaming: {
              type: 'boolean',
              default: false,
              description: 'Enable live streaming',
              'x-input-type': 'checkbox'
            },
            advanced_reporting: {
              type: 'boolean',
              default: false,
              description: 'Enable advanced reporting',
              'x-input-type': 'checkbox'
            },
            is_popular: {
              type: 'boolean',
              default: false,
              description: 'Mark as popular plan',
              'x-input-type': 'checkbox'
            }
          }
        },
        UpdatePlanRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            currency: { type: 'string' },
            billing_cycle: { type: 'string', enum: ['monthly', 'yearly', 'lifetime'] },
            max_matches_per_month: { type: 'integer', nullable: true },
            max_matches_per_day: { type: 'integer', nullable: true },
            max_total_matches: { type: 'integer', nullable: true },
            max_tournaments_per_month: { type: 'integer', nullable: true },
            max_tournaments_per_year: { type: 'integer', nullable: true },
            max_users: { type: 'integer', nullable: true },
            max_admins: { type: 'integer', nullable: true },
            max_match_duration_hours: { type: 'integer', nullable: true },
            max_tournament_duration_days: { type: 'integer', nullable: true },
            max_storage_gb: { type: 'integer', nullable: true },
            max_file_size_mb: { type: 'integer', nullable: true },
            analytics_enabled: { type: 'boolean' },
            custom_branding: { type: 'boolean' },
            api_access: { type: 'boolean' },
            priority_support: { type: 'boolean' },
            live_streaming: { type: 'boolean' },
            advanced_reporting: { type: 'boolean' },
            is_active: { type: 'boolean' },
            is_popular: { type: 'boolean' }
          }
        },
        PlanResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            currency: { type: 'string' },
            billing_cycle: { type: 'string' },
            max_matches_per_month: { type: 'integer', nullable: true },
            max_matches_per_day: { type: 'integer', nullable: true },
            max_total_matches: { type: 'integer', nullable: true },
            max_tournaments_per_month: { type: 'integer', nullable: true },
            max_tournaments_per_year: { type: 'integer', nullable: true },
            max_users: { type: 'integer', nullable: true },
            max_admins: { type: 'integer', nullable: true },
            max_match_duration_hours: { type: 'integer', nullable: true },
            max_tournament_duration_days: { type: 'integer', nullable: true },
            max_storage_gb: { type: 'integer', nullable: true },
            max_file_size_mb: { type: 'integer', nullable: true },
            analytics_enabled: { type: 'boolean' },
            custom_branding: { type: 'boolean' },
            api_access: { type: 'boolean' },
            priority_support: { type: 'boolean' },
            live_streaming: { type: 'boolean' },
            advanced_reporting: { type: 'boolean' },
            is_active: { type: 'boolean' },
            is_popular: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    paths: {
      ...userAuthPaths,
      ...plansPaths,
      ...planPermissionPaths,
      ...tenantPaths,
      ...rolePaths,
      ...teamPaths,
      ...matchPaths,
      ...matchesPaths,
      ...playerPaths
    }
  },
  apis: [] // Required by swagger-jsdoc even when using direct path definitions
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };