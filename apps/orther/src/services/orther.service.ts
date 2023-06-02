import { CreateOrtherDto, PRODUCT_SERVICE } from '@app/gobal';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrtherService {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productProxy: ClientProxy,
  ) {}
  async create({ orthersStringify, userId }: CreateOrtherDto) {
    const list_other = JSON.parse(orthersStringify);

    const list_ob$ = list_other.map((i) =>
      this.productProxy.send({ cmd: 'get-product-by-id' }, i.productId),
    );

    const promises_firstValueFrom = list_ob$.map((i) => firstValueFrom(i));

    console.log(promises_firstValueFrom);

    const data = await Promise.all(promises_firstValueFrom);

    console.log(data);

    return 'Hello World!';
  }
}
