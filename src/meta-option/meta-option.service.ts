import { Injectable } from '@nestjs/common';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from './entities/meta-option.entity';

@Injectable()
export class MetaOptionService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  async create(createMetaOptionDto: CreateMetaOptionDto) {
    const metaOption = this.metaOptionRepository.create(
      this.metaOptionRepository.create(createMetaOptionDto),
    );

    return await this.metaOptionRepository.save(metaOption);
  }

  findAll() {
    return this.metaOptionRepository.find();
  }

  findOne(id: number) {
    return this.metaOptionRepository.findBy({
      id,
    });
  }

  update(id: number, updateMetaOptionDto: UpdateMetaOptionDto) {
    return this.metaOptionRepository.update({ id }, updateMetaOptionDto);
  }

  remove(id: number) {
    return this.metaOptionRepository.delete({ id });
  }
}