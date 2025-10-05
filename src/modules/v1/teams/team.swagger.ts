export const teamPaths = {
  '/api/v1/teams': {
    post: {
      summary: 'Create a new team',
      description: 'Creates a new team with name, short name, optional logo and location',
      tags: ['Teams'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'short_name'],
              properties: {
                name: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 100,
                  description: 'Team name',
                  example: 'Manchester United'
                },
                short_name: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 10,
                  description: 'Team short name',
                  example: 'MUN'
                },
                logo_url: {
                  type: 'string',
                  format: 'uri',
                  description: 'Team logo URL',
                  example: 'https://example.com/logo.png'
                },
                location: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 100,
                  description: 'Team location',
                  example: 'Manchester, England'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Team created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 201 },
                  message: { type: 'string', example: 'Team created successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      name: { type: 'string', example: 'Manchester United' },
                      short_name: { type: 'string', example: 'MUN' },
                      logo_url: { type: 'string', nullable: true, example: 'https://example.com/logo.png' },
                      location: { type: 'string', nullable: true, example: 'Manchester, England' },
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
      summary: 'Get all teams',
      description: 'Retrieves all teams with pagination',
      tags: ['Teams'],
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
        }
      ],
      responses: {
        200: {
          description: 'Teams retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Teams retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      teams: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                            short_name: { type: 'string' },
                            logo_url: { type: 'string', nullable: true },
                            location: { type: 'string', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                          }
                        }
                      },
                      total: { type: 'integer', example: 5 },
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 10 }
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
  '/api/v1/teams/search': {
    get: {
      summary: 'Search teams by name and location',
      description: 'Search teams by name or short name with optional location filter',
      tags: ['Teams'],
      parameters: [
        {
          name: 'name',
          in: 'query',
          required: true,
          schema: { type: 'string', minLength: 1 },
          description: 'Team name or short name to search for'
        },
        {
          name: 'location',
          in: 'query',
          required: false,
          schema: { type: 'string', minLength: 1 },
          description: 'Filter by team location'
        }
      ],
      responses: {
        200: {
          description: 'Teams found successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Teams found successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      teams: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                            short_name: { type: 'string' },
                            logo_url: { type: 'string', nullable: true },
                            location: { type: 'string', nullable: true },
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
          description: 'Bad request - name parameter required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/v1/teams/{id}': {
    get: {
      summary: 'Get team by ID',
      description: 'Retrieves a specific team by its ID',
      tags: ['Teams'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Team ID'
        }
      ],
      responses: {
        200: {
          description: 'Team retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Team retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      name: { type: 'string', example: 'Manchester United' },
                      short_name: { type: 'string', example: 'MUN' },
                      logo_url: { type: 'string', nullable: true, example: 'https://example.com/logo.png' },
                      location: { type: 'string', nullable: true, example: 'Manchester, England' },
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
          description: 'Team not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    put: {
      summary: 'Update team',
      description: 'Updates team information',
      tags: ['Teams'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Team ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 100,
                  description: 'Team name',
                  example: 'Manchester United FC'
                },
                short_name: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 10,
                  description: 'Team short name',
                  example: 'MUFC'
                },
                logo_url: {
                  type: 'string',
                  format: 'uri',
                  description: 'Team logo URL',
                  example: 'https://example.com/new-logo.png'
                },
                location: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 100,
                  description: 'Team location',
                  example: 'Manchester, England'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Team updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Team updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      name: { type: 'string', example: 'Manchester United FC' },
                      short_name: { type: 'string', example: 'MUFC' },
                      logo_url: { type: 'string', nullable: true, example: 'https://example.com/new-logo.png' },
                      location: { type: 'string', nullable: true, example: 'Manchester, England' },
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
          description: 'Team not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Delete team',
      description: 'Deletes a team',
      tags: ['Teams'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Team ID'
        }
      ],
      responses: {
        200: {
          description: 'Team deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 200 },
                  message: { type: 'string', example: 'Team deleted successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Team deleted successfully' }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Team not found',
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