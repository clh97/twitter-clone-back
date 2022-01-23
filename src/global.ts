import { JwtPayload } from 'jsonwebtoken';

/*
https://www.typescriptlang.org/docs/handbook/declaration-merging.html
https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
*/
export {};

declare global {
    namespace Express {
        interface Request {
            authenticated?: boolean;
            decodedToken?: string | JwtPayload;
        }
    }
}

declare module 'jsonwebtoken' {
    export interface JwtPayload {
        id: number;
    }
}
