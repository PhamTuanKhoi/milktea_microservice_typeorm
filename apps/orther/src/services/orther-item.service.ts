import { OrtherItemEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrtherItemService {
  constructor(
    @InjectRepository(OrtherItemEntity)
    private readonly ortherItemRepository: Repository<OrtherItemEntity>,
  ) {}
  async list(pay) {
    const data = await this.ortherItemRepository.find();

    return data;
  }
}
