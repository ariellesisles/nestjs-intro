import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json', nullable: false })
  metaValue: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
