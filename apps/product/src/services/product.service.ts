import { ProductEntity } from '@app/common';
import {
  CreateProductDto,
  ListEntiyReponse,
  QueryProductDto,
  UpdateProductDto,
} from '@app/gobal';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
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

  async list(
    queryProductDto: QueryProductDto,
  ): Promise<ListEntiyReponse<ProductEntity>> {
    const { name, limit, page, sortBy, sortType, categoryId } = queryProductDto;

    const query: FindManyOptions = {};

    if (name)
      query.where = {
        name: ILike(`%${name}%`),
      };

    if (sortBy && sortType) query.order = { [sortBy]: sortType };

    if (page) query.skip = (page - 1) * limit;

    if (limit) query.take = limit;

    query.relations = { category: true };

    query.select = {
      category: {
        id: true,
        name: true,
      },
    };

    if (categoryId) {
      query.where = {
        category: {
          id: categoryId,
        },
      };
    }

    const data = await this.productRepository.find(query);

    return {
      list: data,
      count: data.length,
      limit: +limit || 0,
      page: +page || 0,
    };
  }

  async findById(id: number): Promise<ProductEntity> {
    return this.productRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<ProductEntity> {
    return this.productRepository.findOne({ where: { name } });
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

  async update(updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const { id, categoryId } = updateProductDto;
    try {
      // unique name product
      const exist_name = await this.findByName(updateProductDto.name);

      if (exist_name)
        throw new HttpException(`name product is exist!!`, HttpStatus.CONFLICT);
      // get and validate category by categoryId
      const category = await this.categoryService.isModelExist(categoryId);

      const product = new ProductEntity();

      product.name = updateProductDto.name;
      product.image = updateProductDto.image;
      product.price = updateProductDto.price;
      product.content = updateProductDto.content;
      product.creator = updateProductDto.userId;
      product.category = category;

      await this.productRepository.update(id, product);
      this.logger.log(`updated a product by id#${id}`);

      return this.findById(id);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new BadRequestException();
    }
  }

  async isExistModel(id: number): Promise<ProductEntity> {
    try {
      const exist = await this.findById(id);

      if (!exist || exist === null)
        throw new HttpException(
          `product not found by id#${id}`,
          HttpStatus.NOT_FOUND,
        );

      return exist;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new BadRequestException();
    }
  }
}
