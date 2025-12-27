"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePaths = void 0;
exports.rolePaths = {
    '/api/v1/tenant/roles': {
        post: {
            summary: 'Create a new role',
            description: 'Creates a new role with assigned permissions for the tenant',
            tags: ['Role Management'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'name',
                    in: 'query',
                    required: true,
                    schema: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 50
                    },
                    description: 'Role name (2-50 characters)',
                    example: 'Score Operator'
                },
                {
                    name: 'description',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        maxLength: 255
                    },
                    description: 'Role description (optional)',
                    example: 'Responsible for updating match scores'
                },
                {
                    name: 'permissionIds',
                    in: 'query',
                    required: true,
                    schema: {
                        type: 'array',
                        items: {
                            type: 'integer',
                            minimum: 1
                        },
                        minItems: 1
                    },
                    style: 'form',
                    explode: true,
                    description: 'Permission IDs to assign (multiple values allowed)',
                    example: [1, 2, 3]
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name', 'permissionIds'],
                            properties: {
                                name: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 50,
                                    description: 'Role name',
                                    example: 'Score Operator'
                                },
                                description: {
                                    type: 'string',
                                    maxLength: 255,
                                    description: 'Role description',
                                    example: 'Responsible for updating match scores'
                                },
                                permissionIds: {
                                    type: 'array',
                                    items: { type: 'integer' },
                                    minItems: 1,
                                    description: 'Permission IDs',
                                    example: [1, 2, 3]
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Role created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 201 },
                                    message: { type: 'string', example: 'Role created successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            name: { type: 'string', example: 'Score Operator' },
                                            description: { type: 'string', example: 'Responsible for updating match scores' },
                                            tenantId: { type: 'integer', example: 1 },
                                            isActive: { type: 'boolean', example: true },
                                            permissions: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer', example: 1 },
                                                        name: { type: 'string', example: 'matches.update' },
                                                        resource: { type: 'string', example: 'matches' },
                                                        action: { type: 'string', example: 'update' },
                                                        description: { type: 'string', example: 'Update match information' }
                                                    }
                                                }
                                            },
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
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                403: {
                    description: 'Forbidden - tenant admin access required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        },
        get: {
            summary: 'Get all roles',
            description: 'Retrieves all roles for the tenant with pagination and filtering',
            tags: ['Role Management'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        default: 1
                    },
                    description: 'Page number for pagination',
                    'x-input-type': 'number',
                    'x-placeholder': '1'
                },
                {
                    name: 'limit',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100,
                        default: 10
                    },
                    description: 'Number of items per page (1-100)',
                    'x-input-type': 'number',
                    'x-placeholder': '10'
                },
                {
                    name: 'search',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        maxLength: 100
                    },
                    description: 'Search roles by name',
                    'x-input-type': 'text',
                    'x-placeholder': 'Search role name'
                },
                {
                    name: 'isActive',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'boolean'
                    },
                    description: 'Filter by active status',
                    'x-input-type': 'select',
                    'x-options': [
                        { label: 'All', value: '' },
                        { label: 'Active', value: 'true' },
                        { label: 'Inactive', value: 'false' }
                    ]
                }
            ],
            responses: {
                200: {
                    description: 'Roles retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: 'Roles retrieved successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer', example: 1 },
                                                        name: { type: 'string', example: 'Score Operator' },
                                                        description: { type: 'string', example: 'Responsible for updating match scores' },
                                                        tenantId: { type: 'integer', example: 1 },
                                                        isActive: { type: 'boolean', example: true },
                                                        permissions: {
                                                            type: 'array',
                                                            items: {
                                                                type: 'object',
                                                                properties: {
                                                                    id: { type: 'integer' },
                                                                    name: { type: 'string' },
                                                                    resource: { type: 'string' },
                                                                    action: { type: 'string' },
                                                                    description: { type: 'string' }
                                                                }
                                                            }
                                                        },
                                                        createdAt: { type: 'string', format: 'date-time' },
                                                        updatedAt: { type: 'string', format: 'date-time' }
                                                    }
                                                }
                                            },
                                            meta: {
                                                type: 'object',
                                                properties: {
                                                    total: { type: 'integer', example: 5 },
                                                    page: { type: 'integer', example: 1 },
                                                    limit: { type: 'integer', example: 10 },
                                                    totalPages: { type: 'integer', example: 1 }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                403: {
                    description: 'Forbidden - tenant admin access required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/v1/tenant/roles/permissions': {
        get: {
            summary: 'Get all available permissions',
            description: 'Retrieves all system permissions that can be assigned to roles',
            tags: ['Role Management'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Permissions retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: 'Permissions retrieved successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer', example: 1 },
                                                        name: { type: 'string', example: 'matches.create' },
                                                        resource: { type: 'string', example: 'matches' },
                                                        action: { type: 'string', example: 'create' },
                                                        description: { type: 'string', example: 'Create new matches' },
                                                        isActive: { type: 'boolean', example: true },
                                                        createdAt: { type: 'string', format: 'date-time' },
                                                        updatedAt: { type: 'string', format: 'date-time' }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                403: {
                    description: 'Forbidden - tenant admin access required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/v1/tenant/roles/{id}': {
        get: {
            summary: 'Get role by ID',
            description: 'Retrieves a specific role with its permissions',
            tags: ['Role Management'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer', minimum: 1 },
                    description: 'Role ID'
                }
            ],
            responses: {
                200: {
                    description: 'Role retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: 'Role retrieved successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            name: { type: 'string', example: 'Score Operator' },
                                            description: { type: 'string', example: 'Responsible for updating match scores' },
                                            tenantId: { type: 'integer', example: 1 },
                                            isActive: { type: 'boolean', example: true },
                                            permissions: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer' },
                                                        name: { type: 'string' },
                                                        resource: { type: 'string' },
                                                        action: { type: 'string' },
                                                        description: { type: 'string' }
                                                    }
                                                }
                                            },
                                            createdAt: { type: 'string', format: 'date-time' },
                                            updatedAt: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Role not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        },
        put: {
            summary: 'Update role',
            description: 'Updates role information and permissions',
            tags: ['Role Management'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'integer',
                        minimum: 1
                    },
                    description: 'Role ID to update'
                },
                {
                    name: 'name',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 50
                    },
                    description: 'Updated role name',
                    example: 'Senior Score Operator'
                },
                {
                    name: 'description',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        maxLength: 255
                    },
                    description: 'Updated role description',
                    example: 'Senior operator with additional privileges'
                },
                {
                    name: 'permissionIds',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'array',
                        items: {
                            type: 'integer',
                            minimum: 1
                        },
                        minItems: 1
                    },
                    style: 'form',
                    explode: true,
                    description: 'Updated permission IDs',
                    example: [1, 2, 3, 4]
                },
                {
                    name: 'isActive',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'boolean'
                    },
                    description: 'Role active status',
                    example: true
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
                                    maxLength: 50,
                                    description: 'Updated role name (2-50 characters)',
                                    example: 'Senior Score Operator',
                                    'x-input-type': 'text',
                                    'x-placeholder': 'Enter updated role name'
                                },
                                description: {
                                    type: 'string',
                                    maxLength: 255,
                                    description: 'Updated role description (optional, max 255 characters)',
                                    example: 'Senior operator with additional privileges',
                                    'x-input-type': 'textarea',
                                    'x-placeholder': 'Enter updated description'
                                },
                                permissionIds: {
                                    type: 'array',
                                    items: {
                                        type: 'integer',
                                        minimum: 1
                                    },
                                    minItems: 1,
                                    description: 'Select updated permissions for this role',
                                    example: [1, 2, 3, 4],
                                    'x-input-type': 'multiselect',
                                    'x-options-endpoint': '/api/v1/tenant/roles/permissions',
                                    'x-option-label': 'name',
                                    'x-option-value': 'id',
                                    'x-placeholder': 'Select permissions'
                                },
                                isActive: {
                                    type: 'boolean',
                                    description: 'Role active status',
                                    example: true,
                                    'x-input-type': 'select',
                                    'x-options': [
                                        { label: 'Active', value: true },
                                        { label: 'Inactive', value: false }
                                    ]
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
                                    maxLength: 50,
                                    description: 'Updated role name'
                                },
                                description: {
                                    type: 'string',
                                    maxLength: 255,
                                    description: 'Updated role description'
                                },
                                'permissionIds[]': {
                                    type: 'array',
                                    items: { type: 'integer' },
                                    description: 'Updated permission IDs'
                                },
                                isActive: {
                                    type: 'boolean',
                                    description: 'Role active status'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Role updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: 'Role updated successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            name: { type: 'string', example: 'Senior Score Operator' },
                                            description: { type: 'string', example: 'Senior operator with additional privileges' },
                                            tenantId: { type: 'integer', example: 1 },
                                            isActive: { type: 'boolean', example: true },
                                            permissions: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer' },
                                                        name: { type: 'string' },
                                                        resource: { type: 'string' },
                                                        action: { type: 'string' },
                                                        description: { type: 'string' }
                                                    }
                                                }
                                            },
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
                404: {
                    description: 'Role not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        },
        delete: {
            summary: 'Delete role',
            description: 'Deletes a role and removes all its permission assignments',
            tags: ['Role Management'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer', minimum: 1 },
                    description: 'Role ID'
                }
            ],
            responses: {
                200: {
                    description: 'Role deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: 'Role deleted successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Role deleted successfully' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Role not found',
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
