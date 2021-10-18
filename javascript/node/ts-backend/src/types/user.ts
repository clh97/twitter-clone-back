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
    birthdate: Date;
};

type UserUpdateInput = {
    username: string;
    email: string;
    birthdate: Date;
};

type PublicUser = {
    username?: string;
    email?: string;
    birthdate?: Date;
    uuid?: string;
};

export { User, PublicUser, UserCreateInput, UserUpdateInput };
