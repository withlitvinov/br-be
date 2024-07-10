import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UserModel } from '../models';
import * as modelTypes from '../models/user.model.types';

import * as types from './auth.service.types';

@Injectable()
export class AuthService {
  constructor(private readonly userModel: UserModel) {}

  async getUser(email: string) {
    return this.userModel.getByEmail(email);
  }

  async registerUser(payload: types.RegisterUserPayload) {
    const hashedPassword = await argon2.hash(payload.password);

    const _payload: modelTypes.CreateUserPayload = {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      birthday: new Date(payload.birthday),
    };

    return this.userModel.create(_payload);
  }

  async verifyPassword(password: string, value: string) {
    return argon2.verify(password, value);
  }
}
