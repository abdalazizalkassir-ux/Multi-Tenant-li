import { Module } from '@nestjs/common';
import { ContentTypesController } from './content-types.controller';
import { ContentTypesService } from './content-types.service';
import { ContentType } from './content-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';




@Module({

imports:[TypeOrmModule.forFeature([ContentType])],
  controllers: [ContentTypesController],
  providers: [ContentTypesService]
})
export class ContentTypesModule {}
