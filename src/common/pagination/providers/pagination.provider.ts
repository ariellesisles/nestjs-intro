import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../dto/pagination/pagination-query.dto';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    options: FindManyOptions<T>,
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ) {
    const { page = 1, limit = 20 } = paginationQuery;

    const [result, total] = await repository.findAndCount({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: result,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }
}
