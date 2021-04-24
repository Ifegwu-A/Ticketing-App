import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from '@kmticketes/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  // Create an instanse of a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create + save a ticket

  const orderId = mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'dfdgd',
  });

  ticket.set({ orderId });

  await ticket.save();

  // Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, orderId, ticket, listener };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { msg, data, orderId, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();

  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
