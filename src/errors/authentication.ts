enum AuthenticationErrorMessage {
    INVALID_USERNAME_PASSWORD = 'Invalid username or password',
    UNAUTHORIZED = 'Unauthorized',
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
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

const AuthenticationErrors = {
    AuthenticationError,
    InvalidUsernameOrPasswordError,
};

export { AuthenticationErrors, AuthenticationErrorMessage };
