import { Publisher, OrderCreatedEvent, Subjects } from '@kmticketes/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
