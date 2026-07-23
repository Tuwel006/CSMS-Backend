export const teamAssignmentPaths = {
  '/api/v1/matches/{id}/teams': {
    post: {
      summary: 'Assign a team to a match',
      description: 'Creates or assigns a team and its players to a match. If team_a_id is empty, assigns to team_a, otherwise to team_b.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match ID',
          example: 'match_123'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['team', 'players'],
              properties: {
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
          description: 'Team assignment completed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 201 },
                  code: { type: 'string', example: 'CREATED' },
                  message: { type: 'string', example: 'Team assigned successfully' },
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
  '/api/v1/matches/{id}/teams/{teamId}': {
    patch: {
      summary: 'Update team assignment for a match',
      description: 'Updates team players and their roles for a specific team in a match',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
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
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['team', 'players'],
              properties: {
                team: {
                  type: 'object',
                  required: ['name', 'location'],
                  properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Mumbai Warriors' },
                    location: { type: 'string', example: 'Mumbai, India' }
                  }
                },
                players: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['id', 'name', 'role'],
                    properties: {
                      id: { type: 'integer', example: 1 },
                      name: { type: 'string', example: 'Virat Kohli' },
                      role: { type: 'string', example: 'Captain' }
                    }
                  }
                }
              }
            },
            example: {
              team: {
                id: 1,
                name: 'Mumbai Warriors',
                location: 'Mumbai, India'
              },
              players: [
                {
                  id: 1,
                  name: 'Virat Kohli',
                  role: 'Captain'
                },
                {
                  id: 2,
                  name: 'Rohit Sharma',
                  role: 'Wicket Keeper'
                }
              ]
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Team assignment updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Team assignment updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      matchId: { type: 'string', example: 'match_123' },
                      teamId: { type: 'integer', example: 1 },
                      players: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            playerId: { type: 'integer', example: 1 },
                            name: { type: 'string', example: 'Virat Kohli' },
                            role: { type: 'string', example: 'Captain' }
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
    },
    delete: {
      summary: 'Remove team assignment from a match',
      description: 'Removes team assignment and all associated players from a match',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
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
          description: 'Team assignment removed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Team assignment removed successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Team assignment removed successfully' }
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
