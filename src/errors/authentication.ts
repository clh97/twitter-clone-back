enum AuthenticationErrorMessage {
  INVALID_USERNAME_PASSWORD = 'Invalid username or password',
  USER_ALREADY_REGISTERED = 'Username or email already exists',
  UNAUTHORIZED = 'Unauthorized',
}

class AlreadyRegisteredError extends Error {
  constructor(msg: string = AuthenticationErrorMessage.USER_ALREADY_REGISTERED) {
    super(msg);
    Object.setPrototypeOf(this, AlreadyRegisteredError.prototype);
  }
}
class AuthenticationError extends Error {
  constructor(msg: string = AuthenticationErrorMessage.UNAUTHORIZED) {
    super(msg);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
class InvalidUsernameOrPasswordError extends Error {
  constructor(msg: string = AuthenticationErrorMessage.INVALID_USERNAME_PASSWORD) {
    super(msg);
    Object.setPrototypeOf(this, InvalidUsernameOrPasswordError.prototype);
  }
}

const AuthenticationErrors = {
  AlreadyRegisteredError,
  AuthenticationError,
  InvalidUsernameOrPasswordError,
};

export { AuthenticationErrors, AuthenticationErrorMessage };
