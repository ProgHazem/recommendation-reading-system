import { ReadingBook } from '@App/modules/book-readings/entities/bookingReading.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Normal Columns
  @Column({ name: 'name' })
  @Index({ unique: true })
  name: string;

  @Column({ name: 'number_of_pages' })
  numberOfPages: number;

  @OneToMany(() => ReadingBook, (readingBook) => readingBook.book)
  readingbooks: ReadingBook[];

  // Timestamp Columns
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date;
}
