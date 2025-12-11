export const teamSetupPaths = {
  '/api/v1/matches/team-setup': {
    post: {
      summary: 'Setup team for a match',
      description: 'Creates or assigns a team and its players to a match. If team_a_id is empty, assigns to team_a, otherwise to team_b.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['matchId', 'team', 'players'],
              properties: {
                matchId: {
                  type: 'string',
                  description: 'Match ID',
                  example: 'match_123'
                },
                team: {
                  type: 'object',
                  required: ['name', 'location'],
                  properties: {
                    id: {
                      type: 'integer',
                      description: 'Team ID (optional, if exists)',
                      example: 1
                    },
                    name: {
                      type: 'string',
                      description: 'Team name',
                      example: 'Mumbai Warriors'
                    },
                    location: {
                      type: 'string',
                      description: 'Team location',
                      example: 'Mumbai, India'
                    }
                  }
                },
                players: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['name', 'role'],
                    properties: {
                      id: {
                        type: 'integer',
                        description: 'Player ID (optional, if exists)',
                        example: 1
                      },
                      name: {
                        type: 'string',
                        description: 'Player name',
                        example: 'Virat Kohli'
                      },
                      role: {
                        type: 'string',
                        description: 'Player role in this match',
                        example: 'batsman'
                      }
                    }
                  }
                }
              }
            },
            examples: {
              'New Team and Players': {
                value: {
                  matchId: 'match_123',
                  team: {
                    name: 'Mumbai Warriors',
                    location: 'Mumbai, India'
                  },
                  players: [
                    {
                      name: 'Virat Kohli',
                      role: 'batsman'
                    },
                    {
                      name: 'Jasprit Bumrah',
                      role: 'bowler'
                    }
                  ]
                }
              },
              'Existing Team with Mixed Players': {
                value: {
                  matchId: 'match_123',
                  team: {
                    id: 1,
                    name: 'Mumbai Warriors',
                    location: 'Mumbai, India'
                  },
                  players: [
                    {
                      id: 5,
                      name: 'Virat Kohli',
                      role: 'batsman'
                    },
                    {
                      name: 'New Player',
                      role: 'allrounder'
                    }
                  ]
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Team setup completed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 201 },
                  code: { type: 'string', example: 'CREATED' },
                  message: { type: 'string', example: 'Team setup completed successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      matchId: { type: 'string', example: 'match_123' },
                      teamId: { type: 'integer', example: 1 },
                      teamAssignedTo: { type: 'string', example: 'team_a' },
                      players: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            playerId: { type: 'integer', example: 1 },
                            name: { type: 'string', example: 'Virat Kohli' },
                            role: { type: 'string', example: 'batsman' }
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
        400: {
          description: 'Bad request - validation error or both teams already assigned',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        404: {
          description: 'Match, team, or player not found',
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
        }
      }
    }
  },
  '/api/v1/matches/team-setup/{matchId}/{teamId}': {
    delete: {
      summary: 'Delete team setup from a match',
      description: 'Removes team assignment and all associated players from a match',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'matchId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match ID',
          example: 'match_123'
        },
        {
          name: 'teamId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'Team ID',
          example: 1
        }
      ],
      responses: {
        200: {
          description: 'Team setup deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Team setup deleted successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Team setup deleted successfully' }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Team not assigned to this match',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        404: {
          description: 'Match not found',
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
        }
      }
    }
  }
};
