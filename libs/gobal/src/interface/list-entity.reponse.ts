import { DeepPartial } from 'typeorm';

export interface ListEntiyReponse<T> {
  list: DeepPartial<T>[];
  count: number;
  limit: number;
  page: number;
}
