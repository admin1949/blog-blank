import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@/public';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  getHello(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
