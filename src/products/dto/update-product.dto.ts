import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    
    @IsNumber()
    @IsPositive()
    @IsInt()
    @Type( () => Number )
    public id: number;
    
}
