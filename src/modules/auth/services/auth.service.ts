import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UsersService } from '@/modules/users';

import * as types from './auth.service.types';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async getUser(email: string) {
    return this.usersService.getByEmail(email);
  }

  async registerUser(p: types.RegisterUserPayload) {
    const hPass = await argon2.hash(p.password);

    return this.usersService.create({
      name: p.name,
      email: p.email,
      password: hPass,
      birthday: new Date(p.birthday),
      timeZone: p.timeZone,
    });
  }

  verifyPassword(pass: string, v: string) {
    return argon2.verify(pass, v);
  }
}
