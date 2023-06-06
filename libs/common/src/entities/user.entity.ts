import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => CartEntity, (cart) => cart.orderer)
  carts: CartEntity[];
}
