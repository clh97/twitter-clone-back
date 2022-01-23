enum TweetErrorMessage {
    PAGINATION_PARAMS_NEGATIVE = 'Page and limit must be both positive integers',
    SELF_REPLY = 'Unable to reply to your own recently created tweet',
    ALREADY_FOLLOWING = 'Already following user',
}

class PaginationError extends Error {
    constructor(msg: string = TweetErrorMessage.PAGINATION_PARAMS_NEGATIVE) {
        super(msg);
        Object.setPrototypeOf(this, PaginationError.prototype);
    }
}

class SelfReplyError extends Error {
    constructor(msg: string = TweetErrorMessage.SELF_REPLY) {
        super(msg);
        Object.setPrototypeOf(this, SelfReplyError.prototype);
    }
}

const TweetErrors = {
    PaginationError,
    SelfReplyError,
};

export { TweetErrorMessage, TweetErrors };
