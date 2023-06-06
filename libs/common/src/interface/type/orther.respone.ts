import { OrtherItemEntity } from '@app/common/entities/orther-item.entity';

export interface OrtherResponse {
  id: number;
  totalPrice: number;
  status: boolean;
  ortherItems: OrtherItemEntity[];
  ortherer: number;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    carts?: {};
  };
}
