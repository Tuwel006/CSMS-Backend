export const HTTP_RESPONSE = {
  // Success responses
  OK: (message: string, data?: any) => ({
    status: 200,
    code: 'SUCCESS',
    message,
    data
  }),

  CREATED: (message: string, data?: any) => ({
    status: 201,
    code: 'CREATED',
    message,
    data
  }),

  UPDATED: (message: string, data?: any) => ({
    status: 200,
    code: 'UPDATED',
    message,
    data
  }),

  DELETED: (message: string, data?: any) => ({
    status: 200,
    code: 'DELETED',
    message,
    data
  }),

  // Error responses
  BAD_REQUEST: (message: string, error?: any) => ({
    status: 400,
    code: 'BAD_REQUEST',
    message,
    error
  }),

  UNAUTHORIZED: (message: string, error?: any) => ({
    status: 401,
    code: 'UNAUTHORIZED',
    message,
    error
  }),

  FORBIDDEN: (message: string, error?: any) => ({
    status: 403,
    code: 'FORBIDDEN',
    message,
    error
  }),

  NOT_FOUND: (message: string, error?: any) => ({
    status: 404,
    code: 'NOT_FOUND',
    message,
    error
  }),

  CONFLICT: (message: string, error?: any) => ({
    status: 409,
    code: 'CONFLICT',
    message,
    error
  }),

  UNPROCESSABLE_ENTITY: (message: string, error?: any) => ({
    status: 422,
    code: 'UNPROCESSABLE_ENTITY',
    message,
    error
  }),

  SERVER_ERROR: (message: string, error?: any) => ({
    status: 500,
    code: 'SERVER_ERROR',
    message,
    error
  })
};