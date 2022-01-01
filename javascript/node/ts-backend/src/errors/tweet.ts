enum TweetErrorMessage {
    PAGINATION_PARAMS_NEGATIVE = 'Page and limit must be both positive integers',
}

class PaginationError extends Error {
    constructor(msg: string = TweetErrorMessage.PAGINATION_PARAMS_NEGATIVE) {
        super(msg);
        Object.setPrototypeOf(this, PaginationError.prototype);
    }
}

const TweetErrors = {
    PaginationError: PaginationError,
};

export { TweetErrorMessage, TweetErrors };
