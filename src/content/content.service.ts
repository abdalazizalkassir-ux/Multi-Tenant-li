import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ContentQueryDto } from './dto/content-query.dto';
import { ContentRecord } from './content.entity';
import { ContentType } from 'src/content-types/content-type.entity';
import { CreateContentDto } from './dto/create-content.dto';

import { validateContentData } from './validators/content-schema.validator';


@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentRecord)
    private readonly contentRecordRepository: Repository<ContentRecord>,

    @InjectRepository(ContentType)
    private readonly contentTypeRepository: Repository<ContentType>,
  ) {}

  async create(
    slug: string,
    tenantId: number,   
    dto: CreateContentDto,
  ) {
    
    const contentType = await this.contentTypeRepository.findOne({
      where: {
        slug,
        tenantId,
        deletedAt: IsNull(),
      },
    });
    if (!contentType) {
      throw new NotFoundException(
        'Content type not found',
      );
    }
    validateContentData(contentType.schema,dto.data);


  

    const contentRecord =
      this.contentRecordRepository.create({
        tenantId,
        contentTypeId: contentType.id,
        data: dto.data,
      });

     return this.contentRecordRepository.save(
      contentRecord,
    );
  }


async findAll(
  slug: string,
  tenantId: number,
  query: ContentQueryDto,
) {
  const contentType =
    await this.contentTypeRepository.findOne({
      where: {
        slug,
        tenantId,
        deletedAt: IsNull(),
      },
    });

  if (!contentType) {
    throw new NotFoundException(
      'Content type not found',
    );
  }

  const {
    page,
    limit,
    sort,
    order,
    filter,
  } = query;

  const queryBuilder =
    this.contentRecordRepository
      .createQueryBuilder('record')
      .where('record.tenant_id = :tenantId', {
        tenantId,
      })
      .andWhere(
        'record.content_type_id = :contentTypeId',
        {
          contentTypeId: contentType.id,
        },
      )
      .andWhere('record.deleted_at IS NULL');

  // JSON filtering
  if (filter) {
    for (const [field, value] of Object.entries(filter)) {
      queryBuilder.andWhere(
        `JSON_UNQUOTE(
          JSON_EXTRACT(record.data, :path)
        ) = :value`,
        {
          path: `$.${field}`,
          value,
        },
      );
    }
  }

  queryBuilder
    .orderBy(`record.${sort}`, order)
    .skip((page - 1) * limit)
    .take(limit);

  const [records, total] =
    await queryBuilder.getManyAndCount();

  return {
    data: records,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit,
      ),
    },
  };
}


async update(
  slug: string,
  id: number,
  tenantId: number,
  dto: CreateContentDto,
) {
  const contentType =
    await this.contentTypeRepository.findOne({
      where: {
        slug,
        tenantId,
        deletedAt: IsNull(),
      },
    });

  if (!contentType) {
    throw new NotFoundException(
      'Content type not found',
    );
  }

  const contentRecord =
    await this.contentRecordRepository.findOne({
      where: {
        id,
        tenantId,
        contentTypeId: contentType.id,
        deletedAt: IsNull(),
      },
    });

  if (!contentRecord) {
    throw new NotFoundException(
      'Content not found',
    );
  }

  validateContentData(
    contentType.schema,
    dto.data,
  );

  contentRecord.data = dto.data;

  return this.contentRecordRepository.save(
    contentRecord,
  );
}


async remove(
  slug: string,
  id: number,
  tenantId: number,
) {
  const contentType =
    await this.contentTypeRepository.findOne({
      where: {
        slug,
        tenantId,
        deletedAt: IsNull(),
      },
    });

  if (!contentType) {
    throw new NotFoundException(
      'Content type not found',
    );
  }

  const contentRecord =
    await this.contentRecordRepository.findOne({
      where: {
        id,
        tenantId,
        contentTypeId: contentType.id,
        deletedAt: IsNull(),
      },
    });

  if (!contentRecord) {
    throw new NotFoundException(
      'Content not found',
    );
  }

  contentRecord.deletedAt = new Date();

  await this.contentRecordRepository.save(
    contentRecord,
  );

  return {
    message: 'Content deleted successfully',
  };
}


}