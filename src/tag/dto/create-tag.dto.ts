import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsJSON,
  MinLength,
  IsUrl,
} from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  slug: string;

  @IsOptional()
  @IsString()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsJSON()
  schema?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featured_image_url?: string;
}