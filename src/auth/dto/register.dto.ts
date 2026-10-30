import { IsEmail , IsNotEmpty , IsString , MinLength ,isEmail,isInt,isNotEmpty,isString,Matches, minLength } from "class-validator";



export class RegisterDto{
    @IsString()
    @IsNotEmpty()
    tenantName!: string;

    @IsEmail()
    email!: string

    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/,{
        message: 'Password must contain at least one uppercasse letter !'
    })
    @Matches(/[0-9]/,{
        message: 'Password must contain at least one number'
    })
    password!: string;

}