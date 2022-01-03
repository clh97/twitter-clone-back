enum ConnectionErrorMessage {
    ALREADY_FOLLOWING = 'Already following user',
    NOT_FOLLOWING = 'User is not being followed',
    NOT_AFFECTED = 'Unable to unfollow user',
}

class AlreadyFollowingError extends Error {
    constructor(msg: string = ConnectionErrorMessage.ALREADY_FOLLOWING) {
        super(msg);
        Object.setPrototypeOf(this, AlreadyFollowingError.prototype);
    }
}

class NotFollowingError extends Error {
    constructor(msg: string = ConnectionErrorMessage.NOT_FOLLOWING) {
        super(msg);
        Object.setPrototypeOf(this, NotFollowingError.prototype);
    }
}

class NotAffectedError extends Error {
    constructor(msg: string = ConnectionErrorMessage.NOT_AFFECTED) {
        super(msg);
        Object.setPrototypeOf(this, NotAffectedError.prototype);
    }
}

const ConnectionErrors = {
    AlreadyFollowingError,
    NotFollowingError,
    NotAffectedError,
};

export { ConnectionErrorMessage, ConnectionErrors };
