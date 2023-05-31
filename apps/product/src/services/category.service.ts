import { CategoryEntity } from '@app/common';
import { CreateCategoryDto } from '@app/gobal';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async list() {
    return this.categoryRepository.find();
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
