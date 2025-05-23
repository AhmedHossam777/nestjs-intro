import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { MetaOption } from '../../meta-option/entities/meta-option.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.POST,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.DRAFT,
  })
  status: postStatus;

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
    type: 'timestamp', // 'datetime' in mysql
    nullable: true,
  })
  publishOn?: Date;

  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
    cascade: true,
  })
  metaOptions?: MetaOption;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    eager: true,
  })
  author: User;

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    eager: true,
  })
  @JoinTable()
  tags?: Tag[];
}