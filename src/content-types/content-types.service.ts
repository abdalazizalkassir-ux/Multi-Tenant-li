import { ConflictException, Injectable ,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {IsNull, Repository } from 'typeorm';
import { ContentType } from './content-type.entity';
import { CreateContentTypeDto } from './dto/create-content-type.dto';
import { UpdateContentTypeDto } from './dto/update-content-type.dto';
import { validateContentTypeSchema } from './validators/content-type-schema.validator';



@Injectable()
export class ContentTypesService {
    constructor(
        @InjectRepository(ContentType)
        private readonly contentTypeRepository:Repository<ContentType>,
    ){}

    async create(
        dto:CreateContentTypeDto,
        tenantId:number,
    ){const existingContentType = 
        await this.contentTypeRepository.findOne({
            where:{
                tenantId,
                slug:dto.slug,
                deletedAt:IsNull()
            },
        });

        if(existingContentType){
            throw new ConflictException(
                'A content type with this slug is alredt exist'
            )
        }


        validateContentTypeSchema(dto.schema);
        const contentType =this.contentTypeRepository.create({
            name:dto.name,
            slug:dto.slug,
            schema:dto.schema,
            tenantId,
        });
    return this.contentTypeRepository.save(contentType);
    
    }

async findAll(tenantId: number) {
  return this.contentTypeRepository.find({
    where: {
      tenantId,
      deletedAt: IsNull(),
    },
  });
}


async findOne(id:number,tenantId:number){
    const contentType=await this.contentTypeRepository.findOne({
        where:{
            id,
            tenantId,
            deletedAt:IsNull()
        },
    });

    if(!contentType){
        throw new NotFoundException('Content type now found')
    }


    return contentType;
}


async update(
  id: number,
  tenantId: number,
  dto: UpdateContentTypeDto,
) {

  const contentType = await this.contentTypeRepository.findOne({
    where: {
      id,
      tenantId,
      deletedAt: IsNull(),
    },
  });

  if (!contentType) {
    throw new NotFoundException('Content type not found');
  }

      if(dto.schema){
        validateContentTypeSchema(dto.schema)
    }

  Object.assign(contentType, dto);

  return this.contentTypeRepository.save(contentType);
}


async remove(id: number, tenantId: number) {
  const contentType = await this.contentTypeRepository.findOne({
    where: {
      id,
      tenantId,
      deletedAt: IsNull(),
    },
  });

  if (!contentType) {
    throw new NotFoundException('Content type not found');
  }

  contentType.deletedAt = new Date();

  await this.contentTypeRepository.save(contentType);

  return {
    message: 'Content type deleted successfully',
  };
}



}
