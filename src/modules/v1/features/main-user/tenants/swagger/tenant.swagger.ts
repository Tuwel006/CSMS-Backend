export const tenantPaths = {
  '/api/v1/tenants/create': {
    post: {
      summary: 'Create a new tenant organization',
      description: 'Creates a new tenant organization for the authenticated user',
      tags: ['Tenant Management'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['organizationName', 'planId'],
              properties: {
                organizationName: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 100,
                  description: 'Name of the organization (2-100 characters)',
                  example: 'My Cricket Club'
                },
                planId: {
                  type: 'integer',
                  description: 'Select subscription plan for tenant',
                  example: 1
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Tenant created successfully'
        },
        400: {
          description: 'Bad request - validation error or user already has tenant'
        },
        401: {
          description: 'Unauthorized'
        }
      }
    }
  }
};
