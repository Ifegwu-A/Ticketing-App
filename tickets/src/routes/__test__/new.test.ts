import supertest from 'supertest';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('Has a route handler listining to: /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('Can only be accesed if user if signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('Returns an Error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an Error if invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'valid',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const title = 'treutitle';
  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title,
    price: '120',
  });

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(120);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'valid',
      price: 10,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
