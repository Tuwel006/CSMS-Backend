export const matchPaths = {
  '/api/v1/tenant/matches': {
    post: {
      summary: 'Create a new match',
      description: 'Creates a new match with either existing team IDs or new team names with locations',
      tags: ['Match Management'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              oneOf: [
                {
                  title: 'Create match with existing team IDs',
                  type: 'object',
                  required: ['teamAId', 'teamBId', 'matchDate', 'format', 'venue', 'status'],
                  properties: {
                    teamAId: {
                      type: 'integer',
                      minimum: 1,
                      description: 'Existing Team A ID',
                      example: 1
                    },
                    teamBId: {
                      type: 'integer',
                      minimum: 1,
                      description: 'Existing Team B ID',
                      example: 2
                    },
                    matchDate: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Match date and time',
                      example: '2024-01-15T10:00:00Z'
                    },
                    format: {
                      type: 'string',
                      description: 'Match format',
                      example: 'T20'
                    },
                    venue: {
                      type: 'string',
                      description: 'Match venue',
                      example: 'Stadium A'
                    },
                    status: {
                      type: 'string',
                      description: 'Match status',
                      example: 'scheduled'
                    }
                  }
                },
                {
                  title: 'Create match with new team names',
                  type: 'object',
                  required: ['teamAName', 'teamALocation', 'teamBName', 'teamBLocation', 'matchDate', 'format', 'venue', 'status'],
                  properties: {
                    teamAName: {
                      type: 'string',
                      minLength: 1,
                      description: 'New Team A name',
                      example: 'Team Alpha'
                    },
                    teamALocation: {
                      type: 'string',
                      minLength: 1,
                      description: 'Team A location (required for new teams)',
                      example: 'New York'
                    },
                    teamBName: {
                      type: 'string',
                      minLength: 1,
                      description: 'New Team B name',
                      example: 'Team Beta'
                    },
                    teamBLocation: {
                      type: 'string',
                      minLength: 1,
                      description: 'Team B location (required for new teams)',
                      example: 'Boston'
                    },
                    matchDate: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Match date and time',
                      example: '2024-01-15T10:00:00Z'
                    },
                    format: {
                      type: 'string',
                      description: 'Match format',
                      example: 'T20'
                    },
                    venue: {
                      type: 'string',
                      description: 'Match venue',
                      example: 'Stadium A'
                    },
                    status: {
                      type: 'string',
                      description: 'Match status',
                      example: 'scheduled'
                    }
                  }
                }
              ]
            },
            examples: {
              'existing-teams': {
                summary: 'Using existing team IDs',
                value: {
                  teamAId: 1,
                  teamBId: 2,
                  matchDate: '2024-01-15T10:00:00Z',
                  format: 'T20',
                  venue: 'Stadium A',
                  status: 'scheduled'
                }
              },
              'new-teams': {
                summary: 'Creating new teams',
                value: {
                  teamAName: 'Team Alpha',
                  teamALocation: 'New York',
                  teamBName: 'Team Beta',
                  teamBLocation: 'Boston',
                  matchDate: '2024-01-15T10:00:00Z',
                  format: 'T20',
                  venue: 'Stadium A',
                  status: 'scheduled'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Match created successfully'
        },
        400: {
          description: 'Bad request - validation error'
        },
        401: {
          description: 'Unauthorized - missing or invalid token'
        },
        403: {
          description: 'Forbidden - tenant access required'
        }
      }
    },
    get: {
      summary: 'Get all matches',
      description: 'Retrieves all matches for the tenant with pagination',
      tags: ['Match Management'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number for pagination'
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Number of items per page (1-100)'
        }
      ],
      responses: {
        200: {
          description: 'Matches retrieved successfully'
        },
        401: {
          description: 'Unauthorized'
        },
        403: {
          description: 'Forbidden - tenant access required'
        }
      }
    }
  },
  '/api/v1/tenant/matches/{id}': {
    get: {
      summary: 'Get match by ID',
      description: 'Retrieves a specific match with team details',
      tags: ['Match Management'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Match ID'
        }
      ],
      responses: {
        200: {
          description: 'Match retrieved successfully'
        },
        404: {
          description: 'Match not found'
        }
      }
    },
    put: {
      summary: 'Update match',
      description: 'Updates match information',
      tags: ['Match Management'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Match ID to update'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                teamAId: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Updated Team A ID'
                },
                teamBId: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Updated Team B ID'
                },
                matchDate: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Updated match date'
                },
                format: {
                  type: 'string',
                  description: 'Updated match format'
                },
                venue: {
                  type: 'string',
                  description: 'Updated venue'
                },
                status: {
                  type: 'string',
                  description: 'Updated status'
                },
                isActive: {
                  type: 'boolean',
                  description: 'Match active status'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Match updated successfully'
        },
        404: {
          description: 'Match not found'
        }
      }
    },
    delete: {
      summary: 'Delete match',
      description: 'Deletes a match',
      tags: ['Match Management'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Match ID'
        }
      ],
      responses: {
        200: {
          description: 'Match deleted successfully'
        },
        404: {
          description: 'Match not found'
        }
      }
    }
  }
};