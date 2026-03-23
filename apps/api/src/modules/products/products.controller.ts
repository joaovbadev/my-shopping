import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@CurrentTenant() tenantId: string) {
    if (!tenantId) throw new BadRequestException('Tenant required');
    return this.productsService.findAll(tenantId);
  }

  @Get(':id')
  findById(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    if (!tenantId) throw new BadRequestException('Tenant required');
    return this.productsService.findById(id, tenantId);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  create(@Body() dto: CreateProductDto, @CurrentTenant() tenantId: string) {
    if (!tenantId) throw new BadRequestException('Tenant required');
    return this.productsService.create(dto, tenantId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentTenant() tenantId: string,
  ) {
    if (!tenantId) throw new BadRequestException('Tenant required');
    return this.productsService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    if (!tenantId) throw new BadRequestException('Tenant required');
    return this.productsService.delete(id, tenantId);
  }
}
