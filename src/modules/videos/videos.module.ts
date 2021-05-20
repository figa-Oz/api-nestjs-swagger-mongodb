import { forwardRef, Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './schemas/videos.schema';
import { ProfileModule } from '../profile/profile.module';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Video', schema: VideoSchema },
    ]),
    forwardRef(() => ContentModule),
    ProfileModule,
  ],
  providers: [VideosService],
  controllers: [VideosController],
  exports: [MongooseModule, VideosService]
})
export class VideosModule {}
