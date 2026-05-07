import { OrderStatus } from '../../../common/enums';

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
