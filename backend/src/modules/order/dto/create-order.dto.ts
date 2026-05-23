export interface CreateOrderItemDto {
  dishId: string;
  quantity: number;
}

export interface CreateOrderDto {
  storeId: string;
  items: CreateOrderItemDto[];
  remark?: string;
}
