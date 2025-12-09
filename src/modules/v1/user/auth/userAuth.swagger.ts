export const userAuthPaths = {
  '/api/v1/user/auth/signup': {
    post: {
      summary: 'Register a new user',
      description: 'Create a new user account with username, email, and password',
      tags: ['User Authentication'],
      parameters: [
        {
          name: 'username',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
            minLength: 3,
            maxLength: 50,
            pattern: '^[a-zA-Z0-9_]+$'
          },
          description: 'Username (3-50 characters, alphanumeric)',
          example: 'johndoe'
        },
        {
          name: 'email',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
            format: 'email',
            maxLength: 100
          },
          description: 'Valid email address',
          example: 'john@example.com'
        },
        {
          name: 'password',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
            minLength: 6,
            maxLength: 100
          },
          description: 'Password (minimum 6 characters)',
          example: 'securepassword123'
        },
        {
          name: 'tenantName',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            minLength: 2,
            maxLength: 100
          },
          description: 'Organization name (optional)',
          example: 'My Cricket Club'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['username', 'email', 'password'],
              properties: {
                username: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 50,
                  description: 'Username (3-50 characters, alphanumeric)',
                  example: 'johndoe',
                  'x-input-type': 'text',
                  'x-placeholder': 'Enter username',
                  pattern: '^[a-zA-Z0-9_]+$'
                },
                email: {
                  type: 'string',
                  format: 'email',
                  maxLength: 100,
                  description: 'Valid email address',
                  example: 'john@example.com',
                  'x-input-type': 'email',
                  'x-placeholder': 'Enter email address'
                },
                password: {
                  type: 'string',
                  minLength: 6,
                  maxLength: 100,
                  description: 'Password (minimum 6 characters)',
                  example: 'securepassword123',
                  'x-input-type': 'password',
                  'x-placeholder': 'Enter password'
                },
                tenantName: {
                  type: 'string',
                  minLength: 2,
                  maxLength: 100,
                  description: 'Organization name (optional, creates tenant)',
                  example: 'My Cricket Club',
                  'x-input-type': 'text',
                  'x-placeholder': 'Enter organization name (optional)'
                }
              }
            }
          },
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              required: ['username', 'email', 'password'],
              properties: {
                username: {
                  type: 'string',
                  minLength: 3,
                  description: 'Username'
                },
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'Email address'
                },
                password: {
                  type: 'string',
                  minLength: 6,
                  description: 'Password'
                },
                tenantName: {
                  type: 'string',
                  description: 'Organization name (optional)'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                message: 'User registered successfully',
                user: {
                  id: 1,
                  username: 'johndoe',
                  email: 'john@example.com',
                  subscription: 'free',
                  role: 'user',
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updatedAt: '2024-01-01T00:00:00.000Z'
                }
              }
            }
          }
        },
        400: {
          description: 'Bad request - validation error or user already exists',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              examples: {
                userExists: {
                  summary: 'User already exists',
                  value: {
                    error: 'User with this email or username already exists'
                  }
                },
                validation: {
                  summary: 'Validation error',
                  value: {
                    error: 'Username must be at least 3 characters'
                  }
                }
              }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Internal server error'
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/user/auth/login': {
    post: {
      summary: 'User login',
      description: 'Authenticate user with email and password, returns JWT token',
      tags: ['User Authentication'],
      parameters: [
        {
          name: 'email',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
            format: 'email'
          },
          description: 'Your registered email address',
          example: 'admin@csms.com'
        },
        {
          name: 'password',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
            minLength: 6
          },
          description: 'Your account password',
          example: 'admin123'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'Your registered email address',
                  example: 'admin@csms.com',
                  'x-input-type': 'email',
                  'x-placeholder': 'Enter your email'
                },
                password: {
                  type: 'string',
                  minLength: 6,
                  description: 'Your account password',
                  example: 'admin123',
                  'x-input-type': 'password',
                  'x-placeholder': 'Enter your password'
                }
              }
            }
          },
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'Email address'
                },
                password: {
                  type: 'string',
                  description: 'Password'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              },
              example: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                  id: 1,
                  username: 'johndoe',
                  email: 'john@example.com',
                  subscription: 'free',
                  role: 'user',
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updatedAt: '2024-01-01T00:00:00.000Z'
                }
              }
            }
          }
        },
        401: {
          description: 'Unauthorized - invalid credentials',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Invalid credentials'
              }
            }
          }
        },
        400: {
          description: 'Bad request - missing required fields',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Email and password are required'
              }
            }
          }
        }
      }
    }
  }
};