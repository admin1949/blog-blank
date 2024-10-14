import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  userName: string;
  password: string;
};

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      userId: 1,
      userName: 'tome',
      password: '123',
    },
    {
      userId: 2,
      userName: 'jon',
      password: '234',
    },
  ];
  async findOne(userName: string) {
    return this.users.find((i) => i.userName === userName);
  }
}
