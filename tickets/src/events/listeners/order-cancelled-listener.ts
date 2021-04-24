import { Listener, OrderCancelledEvent, Subjects } from '@kmticketes/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is cancelling
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket Not Found, Sorry');
    }
    // Mark the ticket as beeing cancelled
    ticket.set({ orderId: undefined });

    //save the ticket
    await ticket.save();

    // publish an event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}
