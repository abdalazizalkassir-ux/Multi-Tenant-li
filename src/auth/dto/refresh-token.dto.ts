import { IsNotEmpty , IsString, isString } from "class-validator";



export class RefreshTokenDto {
@IsString()
@IsNotEmpty()
refreshToken!:string;


}