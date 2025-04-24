import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findMany(ids: number[]) {
    return await this.tagRepository.find({ where: { id: In(ids) } });
  }

  async findOne(id: number) {
    return await this.tagRepository.findOneBy({ id });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    return await this.tagRepository.update(
      { id },
      {
        ...updateTagDto,
      },
    );
  }

  async remove(id: number) {
    await this.tagRepository.delete(id);
    return { deleted: true, id };
  }

  async softDelete(id: number) {
    await this.tagRepository.softDelete(id);
    return { deleted: true, id };
  }
}