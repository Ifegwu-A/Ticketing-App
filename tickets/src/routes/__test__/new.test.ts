import supertest from 'supertest';
import request from 'supertest';
import { app } from '../../app';

it('Has a route handler listining to: /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('Can only be accesed if user if signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401);
});

it('Returns an Error if invalid title is provided', async () => {});

it('returns an Error if invalid price is provided', async () => {});

it('creates a ticket with valid inputs', async () => {});
