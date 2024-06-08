import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { DbService } from '@/services';

interface CreatePersonProfilePayload {
  name: string;
  birthday: string;
}

interface UpdatePersonProfilePayload {
  name?: string;
  birthday?: string;
}

@Injectable()
export class PersonProfileModel {
  constructor(private readonly db: DbService) {}

  all() {
    return this.db.personProfile.findMany();
  }

  create(payload: CreatePersonProfilePayload) {
    return this.db.personProfile.create({
      data: {
        name: payload.name,
        birthday: payload.birthday,
      },
    });
  }

  partialUpdate(id: string, payload: UpdatePersonProfilePayload) {
    const data: Prisma.PersonProfileUpdateInput = {};

    if (payload.name) {
      data.name = payload.name;
    }

    if (payload.birthday) {
      data.birthday = payload.birthday;
    }

    return this.db.personProfile.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: string) {
    return this.db.personProfile.delete({
      where: {
        id,
      },
    });
  }
}
