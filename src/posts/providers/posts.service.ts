import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../post.entity';
import { UsersService } from '../../users/providers/users.service';
import { TagsService } from '../../tags/providers/tags.service';

/**
 * Post  Service
 */
@Injectable()
export class PostsService {
  /**
   * Inject {metaOptionRepository, postRepository, usersService, tagService, postsService}
   * @param metaOptionRepository
   * @param postRepository
   * @param usersService
   * @param tagService
   * @param postsService
   */
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly tagService: TagsService,
    private readonly datasource: DataSource,
  ) {}

  /**
   * Find post  by ID
   *  @param id
   * @returns post object
   */
  public findPostById(id: number) {
    return this.postRepository.findOneBy({ id });
  }

  /**
   * Find all Post
   * @returns Post object
   */
  public async findAll() {
    return this.postRepository.find({
      relations: {
        author: true,
        metaOptions: true,
        tags: true,
      },
    });
  }
  /**
   * Create post
   * @param createPostDto
   * @returns Post
   */
  public async create(@Body() createPostDto: CreatePostDto): Promise<Post> {
    // Destructure DTO
    const { authorId, tags, ...postDto } = createPostDto;

    //Find authorId exists in users table
    let author = await this.usersService.findOneById(authorId);

    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }
    // Find Tags
    const tagIds = tags ? await this.tagService.findMultipleTags(tags) : [];

    //Create Post
    const post = this.postRepository.create({
      ...postDto,
      author,
      tags: tagIds,
    });

    //Save and return post
    return this.postRepository.save(post);
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
        post.tags = await this.tagService.findMultipleTags(tags);
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
   * Delete post
   * @param id
   * @return object
   */
  public async delete(id: number) {
    const post = await this.postRepository.delete(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return { deleted: true, id };
  }
}
