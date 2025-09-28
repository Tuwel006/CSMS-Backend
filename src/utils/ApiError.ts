export class ApiError extends Error {
  public status: number;
  public code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }

  static badRequest(message: string = 'Bad request') {
    return new ApiError(400, 'BAD_REQUEST', message);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message: string = 'Forbidden') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message: string = 'Not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static serverError(message: string = 'Internal server error') {
    return new ApiError(500, 'SERVER_ERROR', message);
  }
}