import { Body, Controller, Post } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsService } from './providers/tags.service';

/**
 * Tag Controller
 */
@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  /**
   * Inject TagsService
   * @param tagsService
   */
  constructor(private readonly tagsService: TagsService) {}

  /**
   *  Create Tag Endpoint
   * @param createTagDto
   * @returns Tags
   */

  @ApiOperation({
    summary: 'Create Tag',
  })
  @ApiResponse({
    status: 201,
    description: 'Create tag succesffuly',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request/ Validation failed',
  })
  @Post()
  public createTags(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }
}
