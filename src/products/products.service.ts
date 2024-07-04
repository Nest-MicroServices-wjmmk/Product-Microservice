import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    const start = Date.now();
    this.$connect();
    const end = Date.now();

    const duration = end -start;
    const reset = '\x1b[33m';
    this.logger.log(`Database Connected ${reset}+${duration}ms`)
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(pagination: PaginationDto) { 
    const { page, limit } = pagination;

    const totalPages = await this.product.count({ where: { available: true} });
    const lastPage = Math.ceil(totalPages/limit);

    return {
      metaData: {
        total: totalPages,
        page: page,
        lastPage: lastPage
      },
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }
      })
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({ where: {id: id} });

    if(!product) {
      throw new NotFoundException(`Product with id: ➡${id}⬅ not found.`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProductDto
    })
  }

  async remove(id: number) {  
    const product = await this.product.update({
      where: { id }, data: {available: false } 
    })

    if(!product) {
      throw new NotFoundException(`Product with id: ➡${id}⬅ not found.`);
    }
    
    return product;
  }
}
