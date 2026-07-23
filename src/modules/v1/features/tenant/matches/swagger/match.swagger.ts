export const matchPaths = {
  '/api/v1/matches/{id}/score': {
    get: {
      summary: 'Get live match score',
      description: 'Retrieves live match score with teams, current innings, batting, bowling, and current over data. Publicly accessible.',
      tags: ['Matches'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match ID'
        }
      ],
      responses: {
        200: {
          description: 'Live match score data',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      meta: {
                        type: 'object',
                        properties: {
                          matchId: { type: 'string', example: 'CSMSMATCH123456' },
                          format: { type: 'string', example: 'T20' },
                          status: { type: 'string', example: 'LIVE' },
                          lastUpdated: { type: 'string', format: 'date-time' }
                        }
                      },
                      teams: {
                        type: 'object',
                        properties: {
                          A: {
                            type: 'object',
                            properties: {
                              id: { type: 'integer', example: 1 },
                              name: { type: 'string', example: 'Mumbai Indians' },
                              short: { type: 'string', example: 'MI' }
                            }
                          },
                          B: {
                            type: 'object',
                            properties: {
                              id: { type: 'integer', example: 2 },
                              name: { type: 'string', example: 'Chennai Super Kings' },
                              short: { type: 'string', example: 'CSK' }
                            }
                          }
                        }
                      },
                      innings: {
                        type: 'array',
                        items: { type: 'object' }
                      }
                    }
                  }
                }
              }
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
        }
      }
    }
  },
  '/api/v1/matches/tokens': {
    post: {
      summary: 'Generate a match token',
      description: 'Generates a new unique match token and creates an initial match record.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      responses: {
        201: {
          description: 'Match token generated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 201 },
                  message: { type: 'string', example: 'Match token generated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'CSMSMATCH123456' },
                      is_active: { type: 'boolean', example: true },
                      tenant_id: { type: 'integer', example: 1 },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' }
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
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/matches/tokens/{tokenId}': {
    get: {
      summary: 'Get match by token',
      description: 'Retrieves match details (with team rosters) for a previously generated match token.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'tokenId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match token (ID)'
        }
      ],
      responses: {
        200: {
          description: 'Match details with players',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Match details retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'CSMSMATCH123456' },
                      teamA: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: 'Mumbai Warriors' },
                          players: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer', example: 1 },
                                name: { type: 'string', example: 'John Doe' },
                                role: { type: 'string', example: 'Batsman' }
                              }
                            }
                          }
                        }
                      },
                      teamB: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 2 },
                          name: { type: 'string', example: 'Delhi Capitals' },
                          players: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer', example: 2 },
                                name: { type: 'string', example: 'Jane Smith' },
                                role: { type: 'string', example: 'Bowler' }
                              }
                            }
                          }
                        }
                      },
                      match_date: { type: 'string', format: 'date-time' },
                      format: { type: 'string', example: 'T20' },
                      venue: { type: 'string', example: 'Wankhede Stadium' },
                      status: { type: 'string', example: 'SCHEDULED' }
                    }
                  }
                }
              }
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
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Delete a match token',
      description: 'Deletes a match token (and the associated match record).',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'tokenId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match token (ID)'
        }
      ],
      responses: {
        200: {
          description: 'Match token deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Match token deleted successfully' }
                }
              }
            }
          }
        },
        404: {
          description: 'Match token not found',
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
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/matches': {
    post: {
      summary: 'Create a new match',
      description: 'Creates a new match. Checks if teams exist by name; if not, creates them.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['teamA', 'teamB', 'match_date', 'format', 'venue', 'status'],
              properties: {
                teamA: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Mumbai Indians' },
                    short_name: { type: 'string', example: 'MI' },
                    logo_url: { type: 'string', example: 'https://example.com/mi-logo.png' },
                    location: { type: 'string', example: 'Mumbai' }
                  }
                },
                teamB: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Chennai Super Kings' },
                    short_name: { type: 'string', example: 'CSK' },
                    logo_url: { type: 'string', example: 'https://example.com/csk-logo.png' },
                    location: { type: 'string', example: 'Chennai' }
                  }
                },
                match_date: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-10-25T14:30:00Z'
                },
                format: { type: 'string', example: 'T20' },
                venue: { type: 'string', example: 'Wankhede Stadium, Mumbai' },
                status: {
                  type: 'string',
                  enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
                  example: 'SCHEDULED'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Match created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 201 },
                  message: { type: 'string', example: 'Match created successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'CSMSMATCH123456' },
                      team_a_id: { type: 'integer', example: 1 },
                      team_b_id: { type: 'integer', example: 2 },
                      match_date: { type: 'string', format: 'date-time' },
                      format: { type: 'string', example: 'T20' },
                      venue: { type: 'string', example: 'Wankhede Stadium, Mumbai' },
                      status: { type: 'string', example: 'SCHEDULED' },
                      is_active: { type: 'boolean', example: true },
                      tenant_id: { type: 'integer', example: 1 },
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
          description: 'Bad request',
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
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    get: {
      summary: 'List tenant matches',
      description: 'Retrieves matches for the authenticated tenant with pagination and filtering. Tenant ID is automatically extracted from the authentication token.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
          description: 'Page number'
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 10 },
          description: 'Items per page'
        },
        {
          name: 'status',
          in: 'query',
          schema: { type: 'string', enum: ['LIVE', 'UPCOMING', 'COMPLETED'] },
          description: 'Filter by match status'
        }
      ],
      responses: {
        200: {
          description: 'Paginated list of matches',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Matches retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            meta: {
                              type: 'object',
                              properties: {
                                matchId: { type: 'string', example: 'CSMSMATCH123456' },
                                format: { type: 'string', example: 'T20' },
                                status: { type: 'string', example: 'LIVE' },
                                lastUpdated: { type: 'string', format: 'date-time' }
                              }
                            },
                            teams: {
                              type: 'object',
                              properties: {
                                A: {
                                  type: 'object',
                                  properties: {
                                    id: { type: 'integer', example: 1 },
                                    name: { type: 'string', example: 'Mumbai Indians' },
                                    short: { type: 'string', example: 'MI' }
                                  }
                                },
                                B: {
                                  type: 'object',
                                  properties: {
                                    id: { type: 'integer', example: 2 },
                                    name: { type: 'string', example: 'Chennai Super Kings' },
                                    short: { type: 'string', example: 'CSK' }
                                  }
                                }
                              }
                            },
                            innings: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  i: { type: 'integer', example: 1 },
                                  battingTeam: { type: 'string', example: 'MI' },
                                  bowlingTeam: { type: 'string', example: 'CSK' },
                                  score: {
                                    type: 'object',
                                    properties: {
                                      r: { type: 'integer', example: 150 },
                                      w: { type: 'integer', example: 5 },
                                      b: { type: 'integer', example: 120 }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      meta: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer', example: 1 },
                          limit: { type: 'integer', example: 10 },
                          total: { type: 'integer', example: 50 },
                          totalPages: { type: 'integer', example: 5 },
                          hasNextPage: { type: 'boolean', example: true },
                          hasPreviousPage: { type: 'boolean', example: false }
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
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/matches/{id}': {
    get: {
      summary: 'Get match by ID',
      description: 'Retrieves a specific match by its ID',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match ID'
        }
      ],
      responses: {
        200: {
          description: 'Match details',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Match retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'CSMSMATCH123456' },
                      team_a_id: { type: 'integer', example: 1 },
                      team_b_id: { type: 'integer', example: 2 },
                      match_date: { type: 'string', format: 'date-time' },
                      format: { type: 'string', example: 'T20' },
                      venue: { type: 'string', example: 'Wankhede Stadium, Mumbai' },
                      status: { type: 'string', example: 'SCHEDULED' },
                      is_active: { type: 'boolean', example: true },
                      tenant_id: { type: 'integer', example: 1 },
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
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    patch: {
      summary: 'Update match',
      description: 'Updates match information',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                match_date: { type: 'string', format: 'date-time' },
                format: { type: 'string' },
                venue: { type: 'string' },
                status: {
                  type: 'string',
                  enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']
                },
                team_a_id: { type: 'integer' },
                team_b_id: { type: 'integer' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Match updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Match updated successfully' },
                  data: { $ref: '#/components/schemas/Match' }
                }
              }
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
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Delete match',
      description: 'Deletes a match',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match ID'
        }
      ],
      responses: {
        200: {
          description: 'Match deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Match deleted successfully' }
                }
              }
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
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/matches/{id}/schedule': {
    patch: {
      summary: 'Schedule a match',
      description: 'Updates match with schedule details including venue, date, format, and umpires. Sets status to SCHEDULED.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['venue', 'match_date', 'format'],
              properties: {
                venue: { type: 'string', example: 'Wankhede Stadium, Mumbai' },
                match_date: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T14:30:00Z'
                },
                format: {
                  type: 'string',
                  enum: ['T20', 'ODI', 'TEST'],
                  example: 'T20'
                },
                umpire_1: { type: 'string', example: 'John Doe' },
                umpire_2: { type: 'string', example: 'Jane Smith' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Match scheduled successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Match scheduled successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'CSMSMATCH123456' },
                      venue: { type: 'string', example: 'Wankhede Stadium, Mumbai' },
                      match_date: { type: 'string', format: 'date-time' },
                      format: { type: 'string', example: 'T20' },
                      umpire_1: { type: 'string', example: 'John Doe' },
                      umpire_2: { type: 'string', example: 'Jane Smith' },
                      status: { type: 'string', example: 'SCHEDULED' }
                    }
                  }
                }
              }
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
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/matches/{id}/start': {
    patch: {
      summary: 'Start a match',
      description: 'Starts a match by setting toss winner, batting first team, and marking playing 11 players. Updates match status to LIVE.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Match ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['toss_winner_team_id', 'batting_first_team_id', 'over', 'teamA', 'teamB'],
              properties: {
                toss_winner_team_id: { type: 'integer', example: 1 },
                batting_first_team_id: { type: 'integer', example: 1 },
                over: { type: 'integer', example: 20 },
                teamA: {
                  type: 'object',
                  required: ['id', 'playing_11_id', 'captain_id'],
                  properties: {
                    id: { type: 'integer', example: 1 },
                    playing_11_id: {
                      type: 'array',
                      items: { type: 'integer' },
                      example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                    },
                    captain_id: { type: 'integer', example: 1 }
                  }
                },
                teamB: {
                  type: 'object',
                  required: ['id', 'playing_11_id', 'captain_id'],
                  properties: {
                    id: { type: 'integer', example: 2 },
                    playing_11_id: {
                      type: 'array',
                      items: { type: 'integer' },
                      example: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
                    },
                    captain_id: { type: 'integer', example: 12 }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Match started successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Match started successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'CSMSMATCH123456' },
                      toss_winner_team_id: { type: 'integer', example: 1 },
                      batting_first_team_id: { type: 'integer', example: 1 },
                      status: { type: 'string', example: 'LIVE' },
                      team_a_id: { type: 'integer', example: 1 },
                      team_b_id: { type: 'integer', example: 2 },
                      match_date: { type: 'string', format: 'date-time' },
                      format: { type: 'string', example: 'T20' },
                      venue: { type: 'string', example: 'Wankhede Stadium, Mumbai' },
                      updatedAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
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
        400: {
          description: 'Bad request - Invalid data or transaction failed',
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
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/matches/{id}/complete': {
    patch: {
      summary: 'Complete match',
      description: 'Marks match as completed and archives ball-by-ball data.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['is_match_tied', 'man_of_the_match_player_id'],
              properties: {
                is_match_tied: { type: 'boolean', example: false },
                man_of_the_match_player_id: { type: 'integer', example: 5 },
                winner_team_id: { type: 'integer', example: 1 },
                result_description: { type: 'string', example: 'MI won by 24 runs' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Match completed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Match completed successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Match completed and data archived successfully' }
                    }
                  }
                }
              }
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
        }
      }
    }
  },
  '/api/v1/matches/{id}/balls': {
    post: {
      summary: 'Record a ball',
      description: 'Records each ball delivery with runs, wickets, boundaries, and automatic cricket logic including striker rotation.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'Match ID'
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['ball_type', 'batsman_id', 'bowler_id'],
              properties: {
                ball_type: {
                  type: 'string',
                  enum: ['NORMAL', 'WIDE', 'NO_BALL', 'BYE', 'LEG_BYE', 'DOT'],
                  example: 'NORMAL'
                },
                runs: { type: 'integer', minimum: 0, example: 4 },
                batsman_id: { type: 'integer', example: 101 },
                bowler_id: { type: 'integer', example: 201 },
                is_wicket: { type: 'boolean', example: false },
                wicket_type: {
                  type: 'string',
                  enum: ['BOWLED', 'CAUGHT', 'LBW', 'RUN_OUT', 'STUMPED'],
                  example: 'CAUGHT'
                },
                is_boundary: { type: 'boolean', example: true }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Ball recorded successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Ball recorded successfully' },
                  data: { type: 'object' }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad request - Invalid ball data or match not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        404: {
          description: 'Match or active innings not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/matches/{id}/innings': {
    post: {
      summary: 'Switch to next innings',
      description: 'Closes the current innings and creates a new one with the other team batting.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'Match ID'
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                isFollowOn: { type: 'boolean', example: false }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Switched to next innings successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Switched to next innings successfully' },
                  data: { type: 'object' }
                }
              }
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
        }
      }
    }
  },
  '/api/v1/matches/{id}/batsmen': {
    get: {
      summary: 'List available batsmen',
      description: "Returns players who haven't batted yet in the current innings.",
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Available batsmen list' }
      }
    },
    post: {
      summary: 'Add a batsman to the crease',
      description: 'Adds a new batsman to innings or marks existing batsman as retired hurt. Only allows if less than 2 current batsmen at crease.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Match ID' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['innings_id', 'player_id'],
              properties: {
                innings_id: { type: 'integer', example: 1 },
                player_id: { type: 'integer', example: 101 },
                is_striker: { type: 'boolean', example: true },
                ret_hurt: { type: 'boolean', example: false }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Batsman set successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Batsman set successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Batsman set successfully' }
                    }
                  }
                }
              }
            }
          }
        },
        400: { description: 'Cannot add batsman - two batsmen already at crease' }
      }
    }
  },
  '/api/v1/matches/{id}/bowlers': {
    get: {
      summary: 'List bowling team players',
      description: 'Returns all bowling team players for assigning bowlers and fielders.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Bowling team players list' }
      }
    },
    post: {
      summary: 'Add a bowler for the innings',
      description: 'Sets the current bowler for innings. Automatically deactivates previous bowler and creates bowling record if needed.',
      tags: ['Matches'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Match ID' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['innings_id', 'player_id'],
              properties: {
                innings_id: { type: 'integer', example: 1 },
                player_id: { type: 'integer', example: 201 }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Bowler set successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Bowler set successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Bowler set successfully' }
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
};
