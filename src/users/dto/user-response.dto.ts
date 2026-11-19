import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 18 })
  id: number;

  @ApiProperty({ example: 'jonh' })
  firstName: string;
  @ApiProperty({ example: 'doe' })
  lastName: string;

  @ApiProperty({ example: 'jonhdoe@gmail.com' })
  email: string;
}
