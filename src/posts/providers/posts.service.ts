import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { deleteEntity } from '../../common/utils/delete-entity.util';
import { GetPostsDto } from '../dtos/get-post.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Paginated } from '../../common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';

/**
 * Post  Service
 */
@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  /**
   * Inject {metaOptionRepository, postRepository, usersService, tagService, postsService}
   * @param metaOptionRepository
   * @param postRepository
   * @param usersService
   * @param tagService
   * @param postsService
   */
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly tagService: TagsService,
    private readonly datasource: DataSource,
    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  /**
   * Find post  by ID
   *  @param id
   * @returns post object
   */
  public findPostById(id: number) {
    return this.postRepository.findOneBy({ id });
  }

  public async findPostByAuthorId(
    authorId: number,
    dto: GetPostsDto,
  ): Promise<Paginated<Post>> {
    return this.paginationProvider.paginateQuery(
      {
        where: {
          author: { id: authorId },
        },
        relations: {
          author: true,
          metaOptions: true,
          tags: true,
        },
      },
      dto,
      this.postRepository,
    );
  }

  /**
   * Find all Post
   * @returns Post object
   */
  public async findAll(dto: GetPostsDto): Promise<Paginated<Post>> {
    return this.paginationProvider.paginateQuery(
      {
        relations: {
          author: true,
          metaOptions: true,
          tags: true,
        },
        order: {
          id: 'DESC',
        },
      },
      dto,
      this.postRepository,
    );
  }
  /**
   * Create post
   * @param createPostDto
   * @returns Post
   */
  public async create(
    createPostDto: CreatePostDto,
    user: ActiveUserData,
  ): Promise<Post> {
    return this.createPostProvider.create(createPostDto, user);
  }

  /**
   * Update existing Post
   * @param patchPostDto
   * @returns post object
   */
  public async update(id: number, patchPostDto: PatchPostDto) {
    // Deconstruct DTO
    const { tags, metaOptions, ...restDto } = patchPostDto;

    return await this.datasource.transaction(async (manager) => {
      const post = await manager.findOne(Post, {
        where: { id },
        relations: {
          author: true,
          tags: true,
          metaOptions: true, // <-- load existing meta option
        },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID #${id} not found`);
      }

      if (tags !== undefined) {
        const existingTags = await this.tagService.findMultipleTags(tags);

        if (existingTags.length !== new Set(tags).size) {
          throw new NotFoundException('One or more tags were not found');
        }

        post.tags = existingTags;
      }

      if (metaOptions !== undefined) {
        if (post.metaOptions) {
          manager.merge(MetaOption, post.metaOptions, metaOptions); // UPDATE
        } else {
          post.metaOptions = manager.create(MetaOption, metaOptions); // INSERT
        }
      }

      // Update regular post scalar properties
      manager.merge(Post, post, restDto);

      // Save
      return await manager.save(post);
    });
  }

  /**
   *
   * @param id
   * @returns
   */
  public async delete(id: number): Promise<{ deleted: true; id: number }> {
    return deleteEntity(this.postRepository, id, 'Post');
  }
}
