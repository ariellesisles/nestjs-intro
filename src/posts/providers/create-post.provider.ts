import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { TagsService } from '../../tags/providers/tags.service';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';
import { Exceptions } from '../../common/exceptions/http-exceptions';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagService: TagsService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  public async create(
    createPostDto: CreatePostDto,
    user: ActiveUserData,
  ): Promise<Post> {
    // Destructure DTO
    const { tags, ...postDto } = createPostDto;
    const { sub: authorId } = user;
    const requestedTags = tags ?? [];

    const [author, postTags] = await Promise.all([
      this.usersService.findOneById(authorId),
      requestedTags.length
        ? this.tagService.findMultipleTags(requestedTags)
        : Promise.resolve([]),
    ]);

    if (requestedTags.length !== postTags.length) {
      throw new BadRequestException('Please check your tags');
    }

    const post = this.postRepository.create({
      ...postDto,
      author,
      tags: postTags,
    });

    //Save and return post
    try {
      return await this.postRepository.save(post);
    } catch (err) {
      throw Exceptions.toHttpException(err, 'Post');
    }
  }
}
