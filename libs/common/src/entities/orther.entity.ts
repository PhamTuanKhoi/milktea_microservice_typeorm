import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrtherItemEntity } from './orther-item.entity';

@Entity('orther')
export class OrtherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalPrice: number;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => OrtherItemEntity, (item) => item.orther)
  ortherItems: OrtherItemEntity[];

  @Column()
  ortherer: number;
}
