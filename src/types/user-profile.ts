import { PublicUser } from './user';

type UserProfile = {
    user: PublicUser;
    title?: string;
    biography?: string;
    profileImage?: string;
    profileBackgroundImage?: string;
};

export { UserProfile };
