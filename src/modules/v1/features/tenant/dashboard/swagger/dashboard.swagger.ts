export const dashboardPaths = {
  '/api/v1/tenant/dashboard': {
    get: {
      summary: 'Get tenant dashboard',
      description: 'Retrieves tenant dashboard with plan information and usage statistics',
      tags: ['Dashboard'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Dashboard retrieved successfully'
        },
        401: {
          description: 'Unauthorized'
        },
        403: {
          description: 'Forbidden - tenant access required'
        },
        404: {
          description: 'Tenant not found'
        }
      }
    }
  }
};
