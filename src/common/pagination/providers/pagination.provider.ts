import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../dto/pagination/pagination-query.dto';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';
@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    options: FindManyOptions<T>,
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const { page = 1, limit = 20 } = paginationQuery;

    const [result, total] = await repository.findAndCount({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    const baseUrl = `${this.request.protocol}://${this.request.headers.host}`;

    const currentUrl = new URL(this.request.url, baseUrl);

    const createPageUrl = (pageNumber: number): string => {
      const url = new URL(currentUrl);

      url.searchParams.set('page', pageNumber.toString());
      url.searchParams.set('limit', limit.toString());
      return url.toString();
    };

    return {
      data: result,
      meta: {
        itemPerPage: limit,
        totalItems: total,
        totalPages,
        currentPage: page,
      },
      links: {
        first: createPageUrl(1),
        last: createPageUrl(totalPages),
        current: createPageUrl(page),
        next: createPageUrl(Math.min(page + 1, totalPages)),
        previous: createPageUrl(Math.max(page - 1, 1)),
      },
    };
  }
}
