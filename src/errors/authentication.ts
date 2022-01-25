enum AuthenticationErrorMessage {
    USER_NOT_FOUND = 'Invalid username or password',
    UNAUTHORIZED = 'Unauthorized',
}

class AuthenticationError extends Error {
    constructor(msg: string = AuthenticationErrorMessage.UNAUTHORIZED) {
        super(msg);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

const AuthenticationErrors = {
    AuthenticationError,
};

export { AuthenticationErrors, AuthenticationErrorMessage };
