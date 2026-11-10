import { Body, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';

/**
 * Tag Service
 */
@Injectable()
export class TagsService {
  
  /**
   * Inject Tag Repository
   * @param tagRepository 
   */
    constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   *  Create Tag Service
   * @param createTagDto
   * @returns Tag
   */
  public async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }
}
