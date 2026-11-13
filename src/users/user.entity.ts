import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
@Unique('UQ_users_email', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
