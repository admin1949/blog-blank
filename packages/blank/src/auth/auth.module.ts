import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory() {
        return {
          secret: process.env['JWT-SECRET'],
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
