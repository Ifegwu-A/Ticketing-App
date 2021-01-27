import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to a database';
  statusCode = 500;
  constructor() {
    super('Error connecting to a database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
