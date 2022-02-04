import { Tweet } from './tweet';
import { UserProfile } from './user-profile';

export type Timeline = {
  tweets: Tweet[];
  profiles?: UserProfile[];
};
