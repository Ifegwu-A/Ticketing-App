import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT payload {id, email}
  const payload = {
    id: '1hk4568jkl',
    email: 'test@test.com',
  };
  // Create a JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build Session Object { jwt: my JWT}
  const session = { jwt: token };
  //Turn that into sessoin
  const sessionJson = JSON.stringify(session);
  // encode it as base64
  const base64 = Buffer.from(sessionJson).toString('base64');
  // return a string that is a cookie
  return [`express:sess=${base64}`];
};
