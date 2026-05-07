import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

export class OrderController {
  constructor(private readonly orderService = new OrderService()) {}

  create(body: CreateOrderDto) {
    return {
      code: 0,
      message: 'ok',
      data: this.orderService.createOrder(body)
    };
  }
}
