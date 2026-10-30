import { Controller, 
        Delete,
        Get,
        Body,
        Patch,
        Post,
        Request,
        UseGuards,
        Param
} from '@nestjs/common';
import { ContentTypesService } from './content-types.service';
import { CreateContentTypeDto } from './dto/create-content-type.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateContentTypeDto } from './dto/update-content-type.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user-role.enum';


@Controller('content-types')
export class ContentTypesController {
    constructor(
        private readonly contentTypesService: ContentTypesService,
    ){}

@Post()
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserRole.ADMIN)
async create(
    @Body() dto: CreateContentTypeDto,
    @Request() req:any,
){

    return this.contentTypesService.create(
        dto,
        req.user.tenantId
    );
}


@Get()
@UseGuards(JwtAuthGuard)
async findAll(@Request() req:any){
    return this.contentTypesService.findAll(req.user.tenantId)
}


@Get(':id')
@UseGuards(JwtAuthGuard)
async findOne(
    @Param('id') id: string,
    @Request() req:any
            ){
    return this.contentTypesService.findOne(Number(id), 
         req.user.tenantId)
            }


@Patch(':id')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserRole.ADMIN)
async update(
    @Param('id') id:string,
    @Body() dto: UpdateContentTypeDto,
    @Request() req: any,
){
return this.contentTypesService.update(
    Number(id),
    req.user.tenantId,
    dto,
)
}

@Delete(':id')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserRole.ADMIN)
async remove(
  @Param('id') id: string,
  @Request() req: any,
) {
  return this.contentTypesService.remove(
    Number(id),
    req.user.tenantId,
  );
}



}
