export class ApiResponse {
  static success(data: any, message: string = 'Success') {
    return {
      status: 200,
      code: 'SUCCESS',
      message,
      data
    };
  }

  static created(data: any, message: string = 'Created successfully') {
    return {
      status: 201,
      code: 'CREATED',
      message,
      data
    };
  }

  static badRequest(message: string = 'Bad request') {
    return {
      status: 400,
      code: 'BAD_REQUEST',
      message
    };
  }

  static unauthorized(message: string = 'Unauthorized') {
    return {
      status: 401,
      code: 'UNAUTHORIZED',
      message
    };
  }

  static forbidden(message: string = 'Forbidden') {
    return {
      status: 403,
      code: 'FORBIDDEN',
      message
    };
  }

  static notFound(message: string = 'Not found') {
    return {
      status: 404,
      code: 'NOT_FOUND',
      message
    };
  }

  static serverError(message: string = 'Internal server error') {
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message
    };
  }
}