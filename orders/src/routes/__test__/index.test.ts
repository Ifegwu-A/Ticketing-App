import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it('fetches orders for a particular user', async () => {
  //Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();
  // Create one order as USER #1
  const userOne = global.signin();
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create 2 orders as USER #2
  const userTwo = global.signin();

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);
  //Make request to get orders for user number 2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  //Make sure we only got orders for user number 2

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
