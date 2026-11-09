import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { MetaOption } from './meta-option.entity';

/**
 * MetaOptions Controller
 */
@Controller('meta-options')
export class MetaOptionsController {
  /**
   * Inject metaOptionService
   * @param metaOptionService
   */
  constructor(private readonly metaOptionService: MetaOptionsService) {}

  /**
   * Create MetaOption
   * @param createPostMetaOptionsDto
   * @returns
   */
  @Post()
  public async createMetaOption(
    @Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    return this.metaOptionService.createMetaOption(createPostMetaOptionsDto);
  }
}
