export class AuthError extends Error {
  isAuthError: boolean;
  constructor(msg: string) {
    super(msg);
    this.isAuthError = true;
  }
}
