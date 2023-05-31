import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('detail')
export class ProductDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topping: string;
}
