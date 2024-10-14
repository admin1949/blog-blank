import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { FileModule } from './file/file.module';
import { PrismaService } from './prisam/prisam.service';
import { FileService } from './file/file.service';
import { DictModule } from './dict/dict.module';
import { PagerService } from './pager/pager.service';
import { UtilService } from './util/util.service';
import { PrisamModule } from './prisam/prisam.module';
import { PagerModule } from './pager/pager.module';
import { UtilModule } from './util/util.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    FileModule,
    DictModule,
    PrisamModule,
    PagerModule,
    UtilModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    UserService,
    FileService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    PagerService,
    UtilService,
  ],
})
export class AppModule {}
