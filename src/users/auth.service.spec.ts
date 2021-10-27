import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {
    const users: UsersEntity[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as UsersEntity;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signUp('thaymerapv@gmail.com', '123456789');
    expect(user.password).not.toEqual('123456789');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error id user signs up with email that is in use', async () => {
    await service.signUp('thaymerapv@gmail.com', '123456789');
    try {
      await service.signUp('thaymerapv@gmail.com', '123456789');
    } catch (err) {
      expect(err.message).toEqual('Email in use');
    }
  });

  it('throws if signin is called with an unused email ', async () => {
    try {
      await service.signIn('thaymerapv@gmail.com', '123456789');
    } catch (err) {
      expect(err.message).toEqual('user not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('thaymerapv@gmail.com', '123456789');
    try {
      await service.signIn('thaymerapv@gmail.com', 'password');
    } catch (err) {
      expect(err.message).toEqual('bad credentials');
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp('thaymerapv@gmail.com', 'mypwd');
    const user = await service.signIn('thaymerapv@gmail.com', 'mypwd');
    expect(user).toBeDefined();
  });
});
