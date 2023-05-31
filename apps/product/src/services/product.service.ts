import { ProductEntity } from '@app/common';
import { CreateProductDto, QueryProductDto } from '@app/gobal';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CategoryService } from './category.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
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

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    try {
      const { category, userId } = createProductDto;

      const category_exist = await this.categoryService.isModelExist(category);

      const created = await this.productRepository.save({
        ...createProductDto,
        category: category_exist,
        creator: userId,
      });

      this.logger.log(`created a product by id#${created?.id}`);
      return created;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new BadRequestException();
    }
  }
}
