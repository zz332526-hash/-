import { OrderStatus } from '../../common/enums';
import { CreateOrderDto } from './dto/create-order.dto';

export class OrderService {
  createOrder(payload: CreateOrderDto) {
    const now = new Date().toISOString();

    return {
      orderId: `ord_${Date.now()}`,
      storeId: payload.storeId,
      items: payload.items,
      remark: payload.remark || '',
      status: OrderStatus.PENDING_PAYMENT,
      createdAt: now,
      updatedAt: now
    };
  }
}
