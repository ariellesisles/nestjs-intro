import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { MetaOption } from './meta-options/meta-option.entity';
import { Tag } from './tags/tag.entity';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule will be able to all modules
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'blog_db',
        entities: [User, Post, MetaOption, Tag],
        synchronize: true, //should only be used on DEV environment
      }),
    }),
    TagsModule,
    MetaOptionsModule,
  ], // import all the module in your nestJS
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
