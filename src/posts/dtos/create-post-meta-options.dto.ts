import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  key: string;

  @IsNotEmpty()
  value: any;
}
