import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './common/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: false
    }),
    SharedModule,
    AuthModule,
    UserModule,
    ProfileModule
  ],
=======
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
>>>>>>> master
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
