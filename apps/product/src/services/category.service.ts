import { CategoryEntity } from '@app/common';
import { CreateCategoryDto, QueryCategoryDto } from '@app/gobal';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async list(queryCategoryDto: QueryCategoryDto) {
    const { name, limit, page, sortBy, sortType } = queryCategoryDto;

    const query: FindManyOptions = {};

    if (name)
      query.where = {
        name: ILike(`%${name}%`),
      };

    if (sortBy && sortType) query.order = { [sortBy]: sortType };

    if (page) query.skip = (page - 1) * limit;

    if (limit) query.take = limit;

    return this.categoryRepository.find(query);
  }

  async findByName(name: string): Promise<CategoryEntity> {
    return this.categoryRepository.findOne({ where: { name } });
  }

  async create({ name, userId }: CreateCategoryDto) {
    try {
      const category_exist = await this.findByName(name);

      if (category_exist)
        throw new HttpException(
          `category name does exits!!`,
          HttpStatus.CONFLICT,
        );

      const created = await this.categoryRepository.save({
        name,
        creator: userId,
      });

      this.logger.log(`created a new category by id#${created?.id}`);
      return created;
    } catch (error) {
      this.logger.error(error?.messsage, error?.stack);
      throw new BadRequestException();
    }
  }
}
