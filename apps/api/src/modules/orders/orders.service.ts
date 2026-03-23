import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async findAll(tenantId: string) {
    return this.prisma.order.findMany({
      where: { tenantId },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, tenantId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(dto: CreateOrderDto, userId: string, tenantId: string) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, tenantId },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalPrice = 0;
    const orderItems = dto.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      const price = product.price * item.quantity;
      totalPrice += price;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        tenantId,
        customerId: userId,
        status: OrderStatus.PENDING,
        totalPrice,
        items: { create: orderItems },
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });

    await this.notifications.notifyOrderCreated(order.id, order.customer.name);

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto, tenantId: string) {
    await this.findById(id, tenantId);
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });
  }
}
