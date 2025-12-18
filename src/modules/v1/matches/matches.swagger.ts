import { teamSetupPaths } from './team-setup.swagger';

export const matchesPaths = {
    ...teamSetupPaths,
    '/api/v1/matches/start/{id}': {
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
                                toss_winner_team_id: {
                                    type: 'integer',
                                    example: 1,
                                    description: 'ID of the team that won the toss'
                                },
                                batting_first_team_id: {
                                    type: 'integer',
                                    example: 1,
                                    description: 'ID of the team that will bat first'
                                },
                                over: {
                                    type: 'integer',
                                    example: 20,
                                    description: 'Number of overs for the match (overwrites format field)'
                                },
                                teamA: {
                                    type: 'object',
                                    required: ['id', 'playing_11_id', 'captain_id'],
                                    properties: {
                                        id: {
                                            type: 'integer',
                                            example: 1,
                                            description: 'Team A ID'
                                        },
                                        playing_11_id: {
                                            type: 'array',
                                            items: { type: 'integer' },
                                            example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                                            description: 'Array of player IDs for Team A playing 11'
                                        },
                                        captain_id: {
                                            type: 'integer',
                                            example: 1,
                                            description: 'Player ID of Team A captain'
                                        }
                                    }
                                },
                                teamB: {
                                    type: 'object',
                                    required: ['id', 'playing_11_id', 'captain_id'],
                                    properties: {
                                        id: {
                                            type: 'integer',
                                            example: 2,
                                            description: 'Team B ID'
                                        },
                                        playing_11_id: {
                                            type: 'array',
                                            items: { type: 'integer' },
                                            example: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                                            description: 'Array of player IDs for Team B playing 11'
                                        },
                                        captain_id: {
                                            type: 'integer',
                                            example: 12,
                                            description: 'Player ID of Team B captain'
                                        }
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
    '/api/v1/matches/schedule/{id}': {
        patch: {
            summary: 'Schedule a match',
            description: 'Updates match with schedule details including venue, date, time, format, and umpires',
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
                                venue: {
                                    type: 'string',
                                    example: 'Wankhede Stadium, Mumbai'
                                },
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
                                umpire_1: {
                                    type: 'string',
                                    example: 'John Doe'
                                },
                                umpire_2: {
                                    type: 'string',
                                    example: 'Jane Smith'
                                }
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
    '/api/v1/matches/current/{id}': {
        get: {
            summary: 'Get current created match with players',
            description: 'Retrieves match details with team information and player lists (id, name, role)',
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
        }
    },
    '/api/v1/matches/generate-token': {
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
    '/api/v1/matches/delete-token/{id}': {
        delete: {
            summary: 'Delete a match token',
            description: 'Deletes a match token (and the associated match record).',
            tags: ['Matches'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Match Token (ID)'
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
                                        name: {
                                            type: 'string',
                                            example: 'Mumbai Indians'
                                        },
                                        short_name: {
                                            type: 'string',
                                            example: 'MI'
                                        },
                                        logo_url: {
                                            type: 'string',
                                            example: 'https://example.com/mi-logo.png'
                                        },
                                        location: {
                                            type: 'string',
                                            example: 'Mumbai'
                                        }
                                    }
                                },
                                teamB: {
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                        name: {
                                            type: 'string',
                                            example: 'Chennai Super Kings'
                                        },
                                        short_name: {
                                            type: 'string',
                                            example: 'CSK'
                                        },
                                        logo_url: {
                                            type: 'string',
                                            example: 'https://example.com/csk-logo.png'
                                        },
                                        location: {
                                            type: 'string',
                                            example: 'Chennai'
                                        }
                                    }
                                },
                                match_date: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2023-10-25T14:30:00Z'
                                },
                                format: {
                                    type: 'string',
                                    example: 'T20'
                                },
                                venue: {
                                    type: 'string',
                                    example: 'Wankhede Stadium, Mumbai'
                                },
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
                                            id: { type: 'integer', example: 1 },
                                            team_a_id: { type: 'integer', example: 1 },
                                            team_b_id: { type: 'integer', example: 2 },
                                            match_date: { type: 'string', format: 'date-time', example: '2023-10-25T14:30:00Z' },
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
            summary: 'Get all matches',
            description: 'Retrieves all matches',
            tags: ['Matches'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'List of matches',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: 'Matches retrieved successfully' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer', example: 1 },
                                                team_a_id: { type: 'integer', example: 1 },
                                                team_b_id: { type: 'integer', example: 2 },
                                                match_date: { type: 'string', format: 'date-time', example: '2023-10-25T14:30:00Z' },
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
                    schema: { type: 'integer' },
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
                                            id: { type: 'integer', example: 1 },
                                            team_a_id: { type: 'integer', example: 1 },
                                            team_b_id: { type: 'integer', example: 2 },
                                            match_date: { type: 'string', format: 'date-time', example: '2023-10-25T14:30:00Z' },
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
                    schema: { type: 'integer' },
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
                                match_date: {
                                    type: 'string',
                                    format: 'date-time'
                                },
                                format: {
                                    type: 'string'
                                },
                                venue: {
                                    type: 'string'
                                },
                                status: {
                                    type: 'string',
                                    enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']
                                },
                                team_a_id: {
                                    type: 'integer'
                                },
                                team_b_id: {
                                    type: 'integer'
                                }
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
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            team_a_id: { type: 'integer', example: 1 },
                                            team_b_id: { type: 'integer', example: 2 },
                                            match_date: { type: 'string', format: 'date-time', example: '2023-10-25T14:30:00Z' },
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
                    schema: { type: 'integer' },
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
    }
};
