import { OrtherEntity } from '@app/common/entities/orther.entity';

export interface OrtherItemResponse {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  orther?: OrtherEntity;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    carts?: {};
  };
  product?: {
    id: number;
    name: string;
    content: string;
    price: number;
    image: string;
    creator: number;
  };
}
