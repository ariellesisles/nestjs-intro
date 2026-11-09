import { IsJSON, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
