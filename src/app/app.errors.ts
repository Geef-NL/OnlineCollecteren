export class NotFoundError extends Error {

  public code = 404;
  public inner?: Error;

  constructor(innerError?: Error) {
    super();
    this.name = 'NotFoundError';
    this.inner = innerError;
    Object.setPrototypeOf(this, new.target.prototype);
  }

}
