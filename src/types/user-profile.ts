import { PublicUser } from './user';

type UserProfile = {
    user: PublicUser;
    title?: string;
    biography?: string;
    profileImage?: string;
    ownerId?: number;
    profileBackgroundImage?: string;
};

export { UserProfile };
