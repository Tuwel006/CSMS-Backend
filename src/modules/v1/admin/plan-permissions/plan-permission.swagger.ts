export const planPermissionPaths = {
  '/api/v1/admin/plan-permissions/assign': {
    post: {
      summary: 'Assign permission to plan',
      description: 'Assigns a permission to a subscription plan with optional limits',
      tags: ['Plan Permission Management'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'planId',
          in: 'query',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1
          },
          description: 'Plan ID to assign permission to',
          example: 1
        },
        {
          name: 'permissionId',
          in: 'query',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1
          },
          description: 'Permission ID to assign',
          example: 5
        },
        {
          name: 'limitValue',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 0
          },
          description: 'Usage limit (leave empty for unlimited)',
          example: 50
        },
        {
          name: 'isAllowed',
          in: 'query',
          required: true,
          schema: {
            type: 'boolean'
          },
          description: 'Whether permission is allowed',
          example: true
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['planId', 'permissionId', 'isAllowed'],
              properties: {
                planId: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Plan ID',
                  example: 1
                },
                permissionId: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Permission ID',
                  example: 5
                },
                limitValue: {
                  type: 'integer',
                  minimum: 0,
                  description: 'Usage limit (null for unlimited)',
                  example: 50
                },
                isAllowed: {
                  type: 'boolean',
                  description: 'Permission allowed status',
                  example: true
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Permission assigned successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Permission assigned to plan successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      plan: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 }
                        }
                      },
                      permission: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 5 }
                        }
                      },
                      limit_value: { type: 'integer', example: 50 },
                      is_allowed: { type: 'boolean', example: true },
                      createdAt: { type: 'string', format: 'date-time' }
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
          description: 'Forbidden - Global admin access required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        404: {
          description: 'Plan or permission not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/admin/plan-permissions/plan/{planId}': {
    get: {
      summary: 'Get plan permissions',
      description: 'Retrieves all permissions assigned to a specific plan',
      tags: ['Plan Permission Management'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'planId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1
          },
          description: 'Plan ID to get permissions for',
          example: 1
        }
      ],
      responses: {
        200: {
          description: 'Plan permissions retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Plan permissions retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      permissions: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer', example: 1 },
                            limit_value: { type: 'integer', nullable: true, example: 50 },
                            is_allowed: { type: 'boolean', example: true },
                            permission: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer', example: 5 },
                                name: { type: 'string', example: 'create_match' },
                                resource: { type: 'string', example: 'matches' },
                                action: { type: 'string', example: 'create' },
                                description: { type: 'string', example: 'Create new matches' }
                              }
                            },
                            createdAt: { type: 'string', format: 'date-time' }
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
          description: 'Forbidden - Global admin access required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/admin/plan-permissions/plan/{planId}/permission/{permissionId}': {
    put: {
      summary: 'Update plan permission',
      description: 'Updates permission settings for a specific plan',
      tags: ['Plan Permission Management'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'planId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1
          },
          description: 'Plan ID',
          example: 1
        },
        {
          name: 'permissionId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1
          },
          description: 'Permission ID',
          example: 5
        },
        {
          name: 'limitValue',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 0
          },
          description: 'Updated usage limit',
          example: 100
        },
        {
          name: 'isAllowed',
          in: 'query',
          required: false,
          schema: {
            type: 'boolean'
          },
          description: 'Updated permission status',
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
                limitValue: {
                  type: 'integer',
                  minimum: 0,
                  description: 'Updated usage limit',
                  example: 100
                },
                isAllowed: {
                  type: 'boolean',
                  description: 'Updated permission status',
                  example: true
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Plan permission updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Plan permission updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      limit_value: { type: 'integer', example: 100 },
                      is_allowed: { type: 'boolean', example: true },
                      createdAt: { type: 'string', format: 'date-time' }
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
          description: 'Plan permission not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Remove plan permission',
      description: 'Removes a permission from a plan',
      tags: ['Plan Permission Management'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'planId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1
          },
          description: 'Plan ID',
          example: 1
        },
        {
          name: 'permissionId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1
          },
          description: 'Permission ID',
          example: 5
        }
      ],
      responses: {
        200: {
          description: 'Plan permission removed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Plan permission removed successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Plan permission removed successfully' }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Plan permission not found',
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