export const playerPaths = {
  '/api/v1/players': {
    post: {
      summary: 'Create a new player',
      description: 'Creates a new player with full name and role',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['full_name', 'role'],
              properties: {
                full_name: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 100,
                  description: 'Player full name',
                  example: 'Virat Kohli'
                },
                role: {
                  type: 'string',
                  enum: ['batsman', 'bowler', 'allrounder', 'wicketkeeper'],
                  description: 'Player role',
                  example: 'batsman'
                },
                user_id: {
                  type: 'integer',
                  description: 'Associated user ID (optional)',
                  example: 1
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Player created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 201 },
                  code: { type: 'string', example: 'CREATED' },
                  message: { type: 'string', example: 'Player created successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      full_name: { type: 'string', example: 'Virat Kohli' },
                      role: { type: 'string', example: 'batsman' },
                      user_id: { type: 'integer', nullable: true, example: 1 },
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
        }
      }
    },
    get: {
      summary: 'Get all players',
      description: 'Retrieves all players with pagination and filtering',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number'
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Number of items per page'
        },
        {
          name: 'search',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Search by player name',
          example: 'Virat'
        },
        {
          name: 'role',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['batsman', 'bowler', 'allrounder', 'wicketkeeper'] },
          description: 'Filter by player role'
        },
        {
          name: 'sort',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' },
          description: 'Sort order'
        },
        {
          name: 'sortBy',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['full_name', 'role', 'createdAt'], default: 'createdAt' },
          description: 'Field to sort by'
        }
      ],
      responses: {
        200: {
          description: 'Players retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Players retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer', example: 1 },
                            full_name: { type: 'string', example: 'Virat Kohli' },
                            role: { type: 'string', example: 'batsman' },
                            user_id: { type: 'integer', nullable: true, example: 1 },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                          }
                        }
                      },
                      meta: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer', example: 25 },
                          page: { type: 'integer', example: 1 },
                          limit: { type: 'integer', example: 10 },
                          totalPages: { type: 'integer', example: 3 }
                        }
                      }
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
  '/api/v1/players/search': {
    get: {
      summary: 'Search players by id or name',
      description: 'Search players by any combination of id or name. At least one parameter is required.',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'query',
          required: false,
          schema: { type: 'integer' },
          description: 'Search by player ID',
          example: 1
        },
        {
          name: 'name',
          in: 'query',
          required: false,
          schema: { type: 'string', minLength: 1 },
          description: 'Search by player name',
          example: 'Virat'
        }
      ],
      responses: {
        200: {
          description: 'Players found successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Players found successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer', example: 1 },
                            full_name: { type: 'string', example: 'Virat Kohli' },
                            role: { type: 'string', example: 'batsman' },
                            user_id: { type: 'integer', nullable: true, example: 1 },
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
        400: {
          description: 'Bad request - at least one search parameter required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/players/{id}': {
    get: {
      summary: 'Get player by ID',
      description: 'Retrieves a specific player by ID',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Player ID',
          example: 1
        }
      ],
      responses: {
        200: {
          description: 'Player retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Player retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      full_name: { type: 'string', example: 'Virat Kohli' },
                      role: { type: 'string', example: 'batsman' },
                      user_id: { type: 'integer', nullable: true, example: 1 },
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
          description: 'Player not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    put: {
      summary: 'Update player',
      description: 'Updates player information',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Player ID',
          example: 1
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                full_name: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 100,
                  description: 'Player full name',
                  example: 'Virat Kohli'
                },
                role: {
                  type: 'string',
                  enum: ['batsman', 'bowler', 'allrounder', 'wicketkeeper'],
                  description: 'Player role',
                  example: 'allrounder'
                },
                user_id: {
                  type: 'integer',
                  description: 'Associated user ID',
                  example: 2
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Player updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Player updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      full_name: { type: 'string', example: 'Virat Kohli' },
                      role: { type: 'string', example: 'allrounder' },
                      user_id: { type: 'integer', nullable: true, example: 2 },
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
          description: 'Player not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Delete player',
      description: 'Deletes a player',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Player ID',
          example: 1
        }
      ],
      responses: {
        200: {
          description: 'Player deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Player deleted successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Player deleted successfully' }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Player not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/players/{id}/matches': {
    get: {
      summary: 'Get player matches',
      description: 'Get all matches for a specific player with filters',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Player ID'
        },
        {
          name: 'format',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['T20', 'ODI', 'TEST'] },
          description: 'Match format'
        },
        {
          name: 'isPlaying11',
          in: 'query',
          required: false,
          schema: { type: 'boolean' },
          description: 'Filter by playing 11 status'
        },
        {
          name: 'teamId',
          in: 'query',
          required: false,
          schema: { type: 'integer' },
          description: 'Filter by team ID'
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer' },
          description: 'Limit number of records'
        }
      ],
      responses: {
        200: {
          description: 'Player matches retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Player matches retrieved successfully' },
                  data: { type: 'array', items: { type: 'object' } }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/players/{id}/matches/summary': {
    get: {
      summary: 'Get player match summary',
      description: 'Get summary statistics for a player',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Player ID'
        }
      ],
      responses: {
        200: {
          description: 'Player match summary retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Player match summary retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      player_id: { type: 'integer' },
                      total_matches: { type: 'integer' },
                      playing_11_matches: { type: 'integer' },
                      substitute_appearances: { type: 'integer' },
                      by_format: { type: 'object' },
                      by_status: { type: 'object' }
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
  '/api/v1/players/{id}/matches/recent': {
    get: {
      summary: 'Get recent matches with stats',
      description: 'Get player recent matches including performance stats',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Player ID'
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', default: 10 },
          description: 'Number of recent matches'
        }
      ],
      responses: {
        200: {
          description: 'Player recent matches retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Player recent matches retrieved successfully' },
                  data: { type: 'array', items: { type: 'object' } }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/players/{id}/matches/by-date': {
    get: {
      summary: 'Get matches by date range',
      description: 'Get player matches within a specific date range',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Player ID'
        },
        {
          name: 'startDate',
          in: 'query',
          required: true,
          schema: { type: 'string', format: 'date' },
          description: 'Start date (YYYY-MM-DD)'
        },
        {
          name: 'endDate',
          in: 'query',
          required: true,
          schema: { type: 'string', format: 'date' },
          description: 'End date (YYYY-MM-DD)'
        }
      ],
      responses: {
        200: {
          description: 'Player matches by date range retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Player matches by date range retrieved successfully' },
                  data: { type: 'array', items: { type: 'object' } }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/players/{id}/matches/by-team': {
    get: {
      summary: 'Get matches grouped by team',
      description: 'Get player matches grouped by the team they played for',
      tags: ['Players'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Player ID'
        }
      ],
      responses: {
        200: {
          description: 'Player matches grouped by team retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  code: { type: 'string', example: 'SUCCESS' },
                  message: { type: 'string', example: 'Player matches grouped by team retrieved successfully' },
                  data: { type: 'array', items: { type: 'object' } }
                }
              }
            }
          }
        }
      }
    }
  }
};
