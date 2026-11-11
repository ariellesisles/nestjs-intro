import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostStatus } from './enums/post-status.enum';
import { PostType } from './enums/post-type.enum';
import { MetaOption } from '../meta-options/meta-option.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    nullable: false,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedOn?: Date;

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    // eager: true, // can also call the eager in many-to-many
  })
  @JoinTable()
  tags?: Tag[];

  @ManyToOne(() => User, (user) => user.posts, {
    // eager: true,
  })
  author: User;

  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    cascade: true, // cascade :['insert', 'soft-remove']
    // eager: true,
  })
  metaOptions?: MetaOption;
}
