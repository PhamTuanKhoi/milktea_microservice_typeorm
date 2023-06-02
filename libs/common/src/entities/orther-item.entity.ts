import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrtherEntity } from './orther.entity';

@Entity('ortherItem')
export class OrtherItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => OrtherEntity, (orther) => orther.ortherItems)
  orther: OrtherEntity;
}
