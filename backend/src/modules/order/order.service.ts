import { OrderStatus } from '../../common/enums';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderRepository } from './order.repository';

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELED],
  [OrderStatus.PAID]: [OrderStatus.ACCEPTED],
  [OrderStatus.ACCEPTED]: [OrderStatus.PREPARING],
  [OrderStatus.PREPARING]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELED]: []
};

export class OrderService {
  constructor(private readonly repo = new OrderRepository()) {}

  createOrder(payload: CreateOrderDto): Order {
    if (!payload.storeId || payload.items.length === 0) {
      throw new Error('storeId 和 items 必填');
    }

    const now = new Date().toISOString();
    const order: Order = {
      orderId: `ord_${Date.now()}`,
      storeId: payload.storeId,
      items: payload.items,
      remark: payload.remark || '',
      status: OrderStatus.PENDING_PAYMENT,
      createdAt: now,
      updatedAt: now
    };

    return this.repo.save(order);
  }

  getOrder(orderId: string): Order {
    const order = this.repo.findById(orderId);
    if (!order) {
      throw new Error('订单不存在');
    }
    return order;
  }

  updateStatus(orderId: string, payload: UpdateOrderStatusDto): Order {
    const order = this.getOrder(orderId);
    const allowed = validTransitions[order.status];
    if (!allowed.includes(payload.status)) {
      throw new Error(`非法状态流转: ${order.status} -> ${payload.status}`);
    }

    const updated: Order = {
      ...order,
      status: payload.status,
      updatedAt: new Date().toISOString()
    };

    return this.repo.save(updated);
  }
}
