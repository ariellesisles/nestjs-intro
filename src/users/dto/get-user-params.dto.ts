import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetUserParamsDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id!: number;
}
