type User = {
    id: number;
    username: string;
    password: string;
    email: string;
    birthdate: Date;
    uuid: string;
};

type UserCreateInput = {
    username: string;
    password: string;
    email: string;
    birthdate: string;
};

type UserUpdateInput = {
    username: string;
    email: string;
    birthdate: string;
};

type PublicUser = {
    id?: number;
    username?: string;
    email?: string;
    birthdate?: Date;
    uuid?: string;
};

type UserLoginInput = {
    username: string;
    password: string;
}

type UserLoginOutput = {
    token: string;
    expiresAt: string;
}

export { User, PublicUser, UserCreateInput, UserUpdateInput, UserLoginInput, UserLoginOutput };
