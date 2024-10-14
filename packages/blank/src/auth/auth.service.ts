import { RES } from '@/res';
import { User, UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userName: string, pass: string) {
    const user = await this.userService.findOne(userName);
    if (!user || user.password !== pass) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }

  login(user: User) {
    const payload = { username: user.userName, sub: user.userId };
    return RES.SUCCESS({
      access_token: this.jwtService.sign(payload),
    });
  }
}
