import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './user-role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateUserDto,
    @Request() req: any,
  ) {
    return this.usersService.create(
      dto,
      req.user.tenantId,
    );
  }

  @Get()
  async findAll(
    @Request() req: any,
  ) {
    return this.usersService.findAll(
      req.user.tenantId,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.usersService.findOne(
      Number(id),
      req.user.tenantId,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: any,
  ) {
    return this.usersService.update(
      Number(id),
      req.user.tenantId,
      dto,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.usersService.remove(
      Number(id),
      req.user.tenantId,
    );
  }
}