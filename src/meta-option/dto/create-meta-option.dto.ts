import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreateMetaOptionDto {
  @IsNotEmpty()
  @IsJSON()
  meta_value: string;
}