import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @ApiProperty({
    description: 'A JSON string payload',
    example: '{"message": "Hello World!"}',
  })
  @IsJSON()
  @IsNotEmpty()
  metaValue: string;
}
