import { Ticket } from '../../../src/models/ticket';
import { natsWrapper } from '../../../src/nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@kmticketes/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // Create  a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new Concert',
    price: 999,
    userId: 'fdsgsdfhfdh',
  };
  // create a fake msg obj

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  //return all of this stuff
  return { msg, data, ticket, listener };
};

it('finds, updates, and saves a ticket', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);

  expect(updatedTicket!.price).toEqual(data.price);

  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the msg', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("doesn't call ack if the event has a skipped version number", async () => {
  const { msg, data, listener, ticket } = await setup();

  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
