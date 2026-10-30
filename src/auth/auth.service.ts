import { ConflictException,Injectable,UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Tenant } from 'src/tenants/tenants.entity';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/users/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { RefreshTokenDto } from './dto/refresh-token.dto';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,

    private readonly jwtServices : JwtService, 

  ) {}

  async register(registerDto: RegisterDto) {
    return this.dataSource.transaction(async (manager) => {
      
    const existingUser = await manager.findOne(User,{
        where:{
            email: registerDto.email,
        }
    })

    if(existingUser){
        throw new ConflictException('Email already used!');
    }

      const tenant = manager.create(Tenant, {
        name: registerDto.tenantName,
      });

      const savedTenant = await manager.save(tenant);

      const passwordHash = await bcrypt.hash(
        registerDto.password,
        10,
      );

      const user = manager.create(User, {
        email: registerDto.email,
        passwordHash,
        tenantId: savedTenant.id,
        role: UserRole.ADMIN,
      });

      const savedUser = await manager.save(user);

      return {
        tenant: {
            id:savedTenant.id,
            name:savedTenant.name
        },
        user: {
            id: savedUser.id,
            email:savedUser.email,
            tenantId:savedTenant.id,
            role:savedUser.role,
        },
      };
    });
  }


  async  login(loginDto:LoginDto) {
const user = await this.userRepository.findOne({
    where:{
        email: loginDto.email
    },
});
if(!user){
    throw new UnauthorizedException('Invalid Email !');
}

const passwordMatches = await bcrypt.compare(
    loginDto.password,
    user.passwordHash
)
 if(!passwordMatches){
    throw new UnauthorizedException('Invalid password !')
 }   

const accessToken = await this.jwtServices.signAsync({
    sub:user.id,
    tenantId:user.tenantId,
    role:user.role, 
})
 
const refreshTokenId = randomBytes(16).toString('hex');

const refreshTokenSecret = randomBytes(64).toString('hex');

const refreshTokenHash = await bcrypt.hash(
    refreshTokenSecret ,10,
);
const refreshToken = `${refreshTokenId}.${refreshTokenSecret}`;

const refreshTokenExpiresAt = new Date(
    Date.now() +7*24*60*60*1000,
)

user.refreshTokenId = refreshTokenId;
user.refreshTokenHash = refreshTokenHash;
user.refreshTokenExpiresAt = refreshTokenExpiresAt;
await this.userRepository.save(user);


return{
    accessToken,
    refreshToken
}
  }

async refresh(refreshTokenDto: RefreshTokenDto) {
  const [refreshTokenId, refreshTokenSecret] =
    refreshTokenDto.refreshToken.split('.');

  if (!refreshTokenId || !refreshTokenSecret) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const user = await this.userRepository.findOne({
    where: {
      refreshTokenId,
    },
  });

  if (!user || !user.refreshTokenHash) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const tokenMatches = await bcrypt.compare(
    refreshTokenSecret,
    user.refreshTokenHash,
  );

  if (!tokenMatches) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  if (
    !user.refreshTokenExpiresAt ||
    user.refreshTokenExpiresAt <= new Date()
  ) {
    throw new UnauthorizedException('Refresh token expired');
  }

  const accessToken = await this.jwtServices.signAsync({
    sub: user.id,
    tenantId: user.tenantId,
    role: user.role,
  });

  return {
    accessToken,
  };
}



}