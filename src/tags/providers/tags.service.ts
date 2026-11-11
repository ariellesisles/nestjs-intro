import { Body, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { deleteEntity } from '../../common/utils/delete-entity.util';

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
   * Retrieve all tags
   * @returns A list of tags
   */
  public async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }
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

  /**
   * Delete Tag by ID
   * @param id Entity ID of tag to delete
   * @returns An object confirming deletion with `deleted:true` and its ID
   */
  public async delete(id: number): Promise<{ deleted: true; id: number }> {
    return deleteEntity(this.tagRepository, id, 'Tag');
  }
}
