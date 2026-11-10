import { Body, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
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

  public async findMultipleTags(tagsIds: number[]): Promise<Tag[]> {
    if (!tagsIds || tagsIds.length === 0) {
      return [];
    }

    const result = await this.tagRepository.find({
      where: {
        id: In(tagsIds),
      },
    });

    return result;
  }
}
