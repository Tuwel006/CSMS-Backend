"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plansPaths = void 0;
exports.plansPaths = {
    '/api/v1/admin/plans': {
        post: {
            summary: 'Create a new plan',
            description: 'Create a new subscription plan (Admin only)',
            tags: ['Plans Management'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CreatePlanRequest'
                        },
                        example: {
                            name: 'Pro Plan',
                            description: 'Professional plan with advanced features',
                            price: 29.99,
                            currency: 'USD',
                            billing_cycle: 'monthly',
                            max_matches_per_month: 500,
                            max_matches_per_day: 50,
                            max_tournaments_per_month: 20,
                            max_users: 100,
                            max_admins: 10,
                            max_storage_gb: 50,
                            analytics_enabled: true,
                            custom_branding: true,
                            api_access: true,
                            is_popular: true
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Plan created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' },
                                    plan: { $ref: '#/components/schemas/PlanResponse' }
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
                    description: 'Forbidden - Admin only',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        },
        get: {
            summary: 'Get all plans',
            description: 'Retrieve all subscription plans',
            tags: ['Plans Management'],
            responses: {
                200: {
                    description: 'Plans retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    plans: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/PlanResponse' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/api/v1/admin/plans/active': {
        get: {
            summary: 'Get active plans',
            description: 'Retrieve all active subscription plans',
            tags: ['Plans Management'],
            responses: {
                200: {
                    description: 'Active plans retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    plans: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/PlanResponse' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/api/v1/admin/plans/{id}': {
        get: {
            summary: 'Get plan by ID',
            description: 'Retrieve a specific plan by its ID',
            tags: ['Plans Management'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'Plan ID'
                }
            ],
            responses: {
                200: {
                    description: 'Plan retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    plan: { $ref: '#/components/schemas/PlanResponse' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Plan not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        },
        put: {
            summary: 'Update plan',
            description: 'Update an existing plan (Admin only)',
            tags: ['Plans Management'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'Plan ID'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/UpdatePlanRequest'
                        },
                        example: {
                            name: 'Updated Pro Plan',
                            price: 39.99,
                            max_matches_per_month: 1000,
                            is_popular: false
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Plan updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' },
                                    plan: { $ref: '#/components/schemas/PlanResponse' }
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
                    description: 'Forbidden - Admin only',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: {
                    description: 'Plan not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        },
        delete: {
            summary: 'Delete plan',
            description: 'Delete a plan (Admin only)',
            tags: ['Plans Management'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'Plan ID'
                }
            ],
            responses: {
                200: {
                    description: 'Plan deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' }
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
                    description: 'Forbidden - Admin only',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: {
                    description: 'Plan not found',
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
