import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';

/**
 * Post  Service
 */
@Injectable()
export class PostsService {
  /**
   * Inject MetaOption and Post Repository
   * @param metaOptionRepository
   * @param postRepository
   */
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  /**
   * Find post  by ID
   *  @param id
   * @returns
   */
  public findPostById(id: number) {
    return this.postRepository.findOneBy({ id });
  }

  public async findAll() {
    return this.postRepository.find();
  }
  /**
   * Create post
   * @param createPostDto
   * @returns Post
   */
  public async create(@Body() createPostDto: CreatePostDto): Promise<Post> {
    //Create Post
    const post = this.postRepository.create(createPostDto);

    //Save and return post
    return this.postRepository.save(post);
  }

  public patchPost(patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
    return 'Called patch post endpoint';
  }
  /**
   *
   * @param id
   * @returns
   */
  public async delete(id: number) {
    // 1. Find the post along with its relation so we can get the metaOptions ID
    const post = await this.postRepository.findOne({
      where: { id },
      relations: {
        metaOptions: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // 2. Delete the post first (or delete metaOptions first depending on FK constraints)
    await this.postRepository.delete(id);

    // 3. Safely delete associated metaOptions if they exist
    if (post.metaOptions?.id) {
      await this.metaOptionRepository.delete(post.metaOptions.id);
    }

    return { deleted: true, id };
  }
}
