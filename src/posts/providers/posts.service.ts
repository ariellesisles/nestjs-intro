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
