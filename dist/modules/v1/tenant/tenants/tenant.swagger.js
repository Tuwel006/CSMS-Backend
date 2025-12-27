"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantPaths = void 0;
exports.tenantPaths = {
    '/api/v1/tenant/tenants/create': {
        post: {
            summary: 'Create a new tenant organization',
            description: 'Creates a new tenant organization for the authenticated user',
            tags: ['Tenant Management'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'organizationName',
                    in: 'query',
                    required: true,
                    schema: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 100
                    },
                    description: 'Organization name (2-100 characters)',
                    example: 'My Cricket Club'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['organizationName'],
                            properties: {
                                organizationName: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 100,
                                    description: 'Name of the organization (2-100 characters)',
                                    example: 'My Cricket Club',
                                    'x-input-type': 'text',
                                    'x-placeholder': 'Enter your organization name'
                                }
                            }
                        }
                    },
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            required: ['organizationName'],
                            properties: {
                                organizationName: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 100,
                                    description: 'Organization name'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Tenant created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 201 },
                                    message: { type: 'string', example: 'Tenant created successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            name: { type: 'string', example: 'My Cricket Club' },
                                            owner_user_id: { type: 'integer', example: 123 },
                                            plan_id: { type: 'integer', nullable: true, example: null },
                                            createdAt: { type: 'string', format: 'date-time' },
                                            updatedAt: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Bad request - validation error or user already has tenant',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 400 },
                                    message: { type: 'string', example: 'User already has a tenant' }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - invalid or missing token',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/v1/tenant/tenants/dashboard': {
        get: {
            summary: 'Get tenant dashboard',
            description: 'Retrieves tenant dashboard with plan information and usage statistics',
            tags: ['Tenant Management'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Dashboard retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: 'Tenant dashboard retrieved successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            name: { type: 'string', example: 'My Cricket Club' },
                                            planId: { type: 'integer', nullable: true, example: 2 },
                                            plan: {
                                                type: 'object',
                                                nullable: true,
                                                properties: {
                                                    id: { type: 'integer', example: 2 },
                                                    name: { type: 'string', example: 'Professional' },
                                                    maxMatches: { type: 'integer', nullable: true, example: 50 },
                                                    maxTournaments: { type: 'integer', nullable: true, example: 10 },
                                                    maxUsers: { type: 'integer', nullable: true, example: 25 }
                                                }
                                            },
                                            usage: {
                                                type: 'object',
                                                properties: {
                                                    currentMatches: { type: 'integer', example: 5 },
                                                    currentTournaments: { type: 'integer', example: 2 },
                                                    currentUsers: { type: 'integer', example: 8 }
                                                }
                                            },
                                            createdAt: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - invalid or missing token',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                403: {
                    description: 'Forbidden - tenant access required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: {
                    description: 'Tenant not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/v1/tenant/tenants/update': {
        put: {
            summary: 'Update tenant information',
            description: 'Updates tenant name or plan assignment',
            tags: ['Tenant Management'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'name',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 100
                    },
                    description: 'Updated tenant name',
                    example: 'Updated Cricket Club'
                },
                {
                    name: 'planId',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                        minimum: 1
                    },
                    description: 'Plan ID to assign',
                    example: 2
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 100,
                                    description: 'Updated tenant name (2-100 characters)',
                                    example: 'Updated Cricket Club',
                                    'x-input-type': 'text',
                                    'x-placeholder': 'Enter updated tenant name'
                                },
                                planId: {
                                    type: 'integer',
                                    minimum: 1,
                                    description: 'Select subscription plan for tenant',
                                    example: 2,
                                    'x-input-type': 'select',
                                    'x-options-endpoint': '/api/v1/admin/plans/active',
                                    'x-option-label': 'name',
                                    'x-option-value': 'id',
                                    'x-placeholder': 'Select a plan'
                                }
                            }
                        }
                    },
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 100,
                                    description: 'Updated tenant name'
                                },
                                planId: {
                                    type: 'integer',
                                    minimum: 1,
                                    description: 'Plan ID'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Tenant updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: 'Tenant updated successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            name: { type: 'string', example: 'Updated Cricket Club' },
                                            owner_user_id: { type: 'integer', example: 123 },
                                            plan_id: { type: 'integer', example: 2 },
                                            createdAt: { type: 'string', format: 'date-time' },
                                            updatedAt: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Bad request - validation error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - invalid or missing token',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                403: {
                    description: 'Forbidden - tenant access required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: {
                    description: 'Tenant not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    }
};
