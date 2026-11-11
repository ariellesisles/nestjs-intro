import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsService } from './providers/tags.service';
import { Tag } from './tag.entity';

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

  @ApiOperation({ summary: 'Retrieve all tags' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of tags.',
    type: Tag,
    isArray: true,
  })
  @Get()
  public async getTags(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }
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

  /**
   * Deletes a tag by its ID.
   *
   * @param id - ID of the tag to delete.
   * @returns An object confirming deletion, containing `deleted: true` and the tag ID.
   */
  @ApiOperation({ summary: 'Delete a Tag' })
  @ApiResponse({
    status: 200,
    description: 'Deletion confirmation.',
    schema: {
      example: {
        deleted: true,
        id: 12,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tag not found.',
  })
  @Delete(':id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }
}
