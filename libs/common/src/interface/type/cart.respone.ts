export interface CartResponse {
  id: number;
  productId: number;
  quantity: number;
  orderer?: {
    id: number;
    name: string;
    email: string;
    avatar: string;
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
