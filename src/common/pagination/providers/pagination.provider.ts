import { Injectable, Inject } from '@nestjs/common';
import { PaginatedInterface } from '../interfaces/paginated.interface';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<PaginatedInterface<T>> {
    const { page, limit } = paginationQueryDto;

    const [data, totalItems] = await repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    console.log('reqest', this.request);
    const baseUrl =
      this.request.protocol +
      '://' +
      this.request.get('host') +
      this.request.originalUrl;

    const paginatedResponse: PaginatedInterface<T> = {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage,
      },
      links: {
        first: `${baseUrl}?page=1&limit=${limit}`,
        previous:
          page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
        next:
          page < totalPages
            ? `${baseUrl}?page=${page + 1}&limit=${limit}`
            : null,
        last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
        current: `${baseUrl}?page=${currentPage}&limit=${limit}`,
      },
    };

    return paginatedResponse;
  }
}