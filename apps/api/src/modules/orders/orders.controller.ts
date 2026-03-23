import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll(@CurrentTenant() tenantId: string) {
    if (!tenantId) throw new BadRequestException('Tenant required');
    return this.ordersService.findAll(tenantId);
  }

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @Request() req: any,
    @CurrentTenant() tenantId: string,
  ) {
    if (!tenantId) throw new BadRequestException('Tenant required');
    return this.ordersService.create(dto, req.user.sub, tenantId);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentTenant() tenantId: string,
  ) {
    if (!tenantId) throw new BadRequestException('Tenant required');
    return this.ordersService.updateStatus(id, dto, tenantId);
  }
}
