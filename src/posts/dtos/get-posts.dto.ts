import { IsDate, IsOptional } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/pagination/dto/pagination-query.dto';

class GetPostsBaseDto {
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}

export class GetPostsDto extends IntersectionType(
  PaginationQueryDto,
  GetPostsBaseDto,
) {}