import { Body, Injectable } from '@nestjs/common';
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
    //Create metaOptions (optional)
    const metaOptions = createPostDto.metaOptions
      ? this.metaOptionRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOptions) {
      await this.metaOptionRepository.save(metaOptions);
    }

    //Create Post
    const post = this.postRepository.create(createPostDto);

    //Add metaoption to the post
    if (metaOptions) {
      post.metaOptions = metaOptions;
    }

    //Save and return post
    return this.postRepository.save(post);
  }

  public patchPost(patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
    return 'Called patch post endpoint';
  }
}
