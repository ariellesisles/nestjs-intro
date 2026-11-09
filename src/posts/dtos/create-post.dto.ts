import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/post-type.enum';
import { PostStatus } from '../enums/post-status.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: 'Understanding NestJS Validation',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: PostType,
    description: 'The type of the post',
  })
  @IsEnum(PostType, {
    message: 'postType must be either post, page, story or series',
  })
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    description: 'URL-friendly unique slug for the post',
    example: 'my-slug-2134',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all in small letters and uses only "-" and without spaces. Example "my-url"',
  })
  @MaxLength(255)
  slug: string;

  @ApiProperty({
    enum: PostStatus,
    description: 'The publication status of the post',
  })
  @IsEnum(PostStatus, {
    message: 'status must be either draft, scheduled, review, or published',
  })
  @IsNotEmpty()
  status: PostStatus;

  @ApiPropertyOptional({
    description: 'The main body content of the post',
    example: 'test content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'A JSON string payload',
    example: '{"message": "Hello World!"}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'URL pointing to the featured image',
    example:
      'https://unsplash.com/photos/woman-at-the-controls-of-a-skid-steer-XHnS6_Q2_jo',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiProperty({
    description: 'The target publication date in ISO 8601 format',
    example: '2026-11-04T23:08:01-08:00',
  })
  @IsISO8601()
  @IsNotEmpty()
  publishedOn?: Date;

  @ApiPropertyOptional({
    description: 'List of tags associated with the post',
    type: [String],
    example: ['nestjs', 'REST API'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'The metaValue is JSON string',
          example: '{"sidebarEnable": true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;
}
