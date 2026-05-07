import { OrderStatus } from '../../common/enums';

export interface OrderItem {
  dishId: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  storeId: string;
  items: OrderItem[];
  remark: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export class OrderRepository {
  private readonly store = new Map<string, Order>();

  save(order: Order): Order {
    this.store.set(order.orderId, order);
    return order;
  }

  findById(orderId: string): Order | null {
    return this.store.get(orderId) || null;
  }

  findAll(): Order[] {
    return Array.from(this.store.values());
  }
}
