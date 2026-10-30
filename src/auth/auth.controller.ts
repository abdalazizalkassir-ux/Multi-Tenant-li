import { Controller ,Body ,Post,Get} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
constructor(private readonly authService:AuthService){}

@Post('register')
register(@Body() RegisterDto: RegisterDto){
    return this.authService.register(RegisterDto)
}

@Post('login')
login(@Body() LoginDto:LoginDto){
    return this.authService.login(LoginDto)
}

@Post('refresh')
refresh(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.refresh(refreshTokenDto)
}





}
