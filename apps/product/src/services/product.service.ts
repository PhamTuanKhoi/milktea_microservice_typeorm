import { ProductEntity } from '@app/common';
import { QueryProductDto } from '@app/gobal';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async list(queryProductDto: QueryProductDto): Promise<ProductEntity[]> {
    const { name, limit, page, sortBy, sortType } = queryProductDto;

    const query: FindManyOptions = {};

    if (name)
      query.where = {
        name: ILike(`%${name}%`),
      };

    if (sortBy && sortType) query.order = { [sortBy]: sortType };

    if (page) query.skip = (page - 1) * limit;

    if (limit) query.take = limit;

    return this.productRepository.find(query);
  }
}
