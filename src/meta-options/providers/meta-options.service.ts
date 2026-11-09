import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * MetaOption Service
 */
@Injectable()
export class MetaOptionsService {
  /**
   *  Inject metaOption Repository
   * @param metaOptionsRepository
   */
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /**
   *  Create metaOption method
   * @param createPostMetaOptionsDto
   * @returns MetaOption
   */
  public async createMetaOption(
    createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ): Promise<MetaOption> {
    const metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );

    return await this.metaOptionsRepository.save(metaOption);
  }
}
