import express from 'express';
import { Repository } from 'typeorm';
import { UserProfile } from '../types/user-profile';
import { UserProfileEntity } from '../entity/user-profile';

class UserProfileService {
  userProfileRepository: Repository<UserProfileEntity>;

  constructor(app: express.Application) {
    this.userProfileRepository = app.get('db').getRepository(UserProfileEntity);
  }

  async getUserProfileById(userId: number): Promise<UserProfile> {
    try {
      const profile = await this.userProfileRepository.findOne({ id: userId }, { relations: ['user'] });

      return profile;
    } catch (err) {
      throw err;
    }
  }
}

export default UserProfileService;
