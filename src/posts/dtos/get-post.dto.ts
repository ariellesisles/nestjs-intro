import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination/pagination-query.dto';
import { IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class GetPostBaseDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}
export class GetPostsDto extends IntersectionType(
  GetPostBaseDto,
  PaginationQueryDto,
) {}
