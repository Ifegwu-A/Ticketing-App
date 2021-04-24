import { Publisher, OrderCancelledEvent, Subjects } from '@kmticketes/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
