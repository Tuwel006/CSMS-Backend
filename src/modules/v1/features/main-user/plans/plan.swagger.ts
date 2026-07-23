export const planPaths = {
  '/api/v1/admin/plans': {
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
                  data: {
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
  }
};
