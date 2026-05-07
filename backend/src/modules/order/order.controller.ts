import { ok } from '../../common/response';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

export class OrderController {
  constructor(private readonly orderService = new OrderService()) {}

  create(body: CreateOrderDto) {
    return ok(this.orderService.createOrder(body));
  }

  getById(orderId: string) {
    return ok(this.orderService.getOrder(orderId));
  }

  updateStatus(orderId: string, body: UpdateOrderStatusDto) {
    return ok(this.orderService.updateStatus(orderId, body));
  }
}
