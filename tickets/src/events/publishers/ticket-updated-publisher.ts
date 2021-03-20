import { Publisher, Subjects, TicketUpdatedEvent } from '@kmticketes/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
