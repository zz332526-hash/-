import { OrderStatus } from './common/enums';
import { OrderController } from './modules/order/order.controller';

const controller = new OrderController();

const created = controller.create({
  storeId: 's_001',
  items: [{ dishId: 'd_001', quantity: 2 }],
  remark: '少辣'
});

const orderId = created.data.orderId;
controller.updateStatus(orderId, { status: OrderStatus.PAID });
const detail = controller.getById(orderId);

console.log(JSON.stringify(detail, null, 2));
