import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  content: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  creator: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;
}
