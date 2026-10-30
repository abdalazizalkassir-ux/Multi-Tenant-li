import { IsObject } from "class-validator";


export class CreateContentDto{
@IsObject()
data!:Record<string,any>;

}