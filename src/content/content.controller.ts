import {
    Delete,
    Patch,
    Query,
    Get,
    Body,
    Controller,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ContentQueryDto } from './dto/content-query.dto';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
  ) {}

  @Post(':slug')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.EDITOR)
  async create(
    @Param('slug') slug: string,
    @Body() dto: CreateContentDto,
    @Request() req: any,
  ) {
    return this.contentService.create(
      slug,
      req.user.tenantId,
      dto,
    );
  }



@Get(':slug')
@UseGuards(JwtAuthGuard)
async findAll(
  @Param('slug') slug: string,
  @Query() query: ContentQueryDto,
  @Request() req: any,
) {
  return this.contentService.findAll(
    slug,
    req.user.tenantId,
    query,
  );
}

@Patch(':slug/:id')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserRole.ADMIN,UserRole.EDITOR)
async update(
  @Param('slug') slug: string,
  @Param('id') id: string,
  @Body() dto: CreateContentDto,
  @Request() req: any,
) {
  return this.contentService.update(
    slug,
    Number(id),
    req.user.tenantId,
    dto,
  );
}

@Delete(':slug/:id')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserRole.ADMIN,UserRole.EDITOR)
async remove(
  @Param('slug') slug: string,
  @Param('id') id: string,
  @Request() req: any,
) {
  return this.contentService.remove(
    slug,
    Number(id),
    req.user.tenantId,
  );
}


}