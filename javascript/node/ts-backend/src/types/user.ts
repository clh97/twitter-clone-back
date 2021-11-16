import { IsDateString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { isRegExp } from 'util/types';

type User = {
    id?: number;
    username?: string;
    password: string;
    email?: string;
    birthdate?: string;
    uuid?: string;
};

class UserCreateInput implements User {
    @IsNotEmpty()
    @Length(6, 32)
    username: string;

    @Length(12, 48)
    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Matches(/(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/)
    @IsNotEmpty()
    birthdate: string;
}

type UserUpdateInput = {
    username: string;
    email: string;
    birthdate: string;
};

type PublicUser = {
    id?: number;
    username?: string;
    email?: string;
    birthdate?: string;
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
