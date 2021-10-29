import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const emailTest = 'tapv6@gmail.com';
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: emailTest, password: '123456789' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(emailTest);
      });
  });

  it('signup as a new user the ger the currently logger in user', async () => {
    const emailTest = 'tapv6@gmail.com';
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: emailTest, password: '123456789' })
      .expect(201);
    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(emailTest);
  });
});
