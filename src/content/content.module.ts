import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentRecord } from './content.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContentType } from 'src/content-types/content-type.entity';


@Module({
  imports:[
    TypeOrmModule.forFeature([
      ContentRecord,
      ContentType
    ])
  ],
  controllers: [ContentController],
  providers: [ContentService]
})
export class ContentModule {}
