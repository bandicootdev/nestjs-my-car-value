import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UsersEntity } from './users.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'thaymerapv@gmail.com',
          password: '123456789',
        } as UsersEntity);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: '123456789',
          } as UsersEntity,
        ]);
      },
      update: (id: number, data: UpdateUserDto) => {
        const { email } = data;
        return Promise.resolve({
          id,
          email,
          password: '123456789',
        } as UsersEntity);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'thaymerapv@gmail.com',
          password: '123456789',
        } as UsersEntity);
      },
    };

    fakeAuthService = {
      // signUp: (email: string, password: string) => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as UsersEntity);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email ', async () => {
    const users = await fakeUsersService.find('thaymerapv@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('thaymerapv@gmail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser('3');
    } catch (err) {
      expect(err.message).toEqual('user not found');
    }
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      {
        email: 'thaymerapv@gmail.com',
        password: '123456789',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('update email user', async () => {
    const user = await controller.updateUser('1', {
      email: 'thaymerportillo@gmail.com',
      password: '123456789',
    });
    expect(user).toBeDefined();
    expect(user.email).toEqual('thaymerportillo@gmail.com');
  });

  it('remove user', async () => {
    const user = await controller.deleteUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  // it('throws error in method update not found user', async () => {
  //   fakeUsersService.update = () => null;
  //   try {
  //     await controller.updateUser('1', {
  //       email: 'thaymerportillo@gmail.com',
  //       password: '123456789',
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });
  //
  // it('throws error in method delete not found user', async () => {
  //   fakeUsersService.update = () => null;
  //   try {
  //     await controller.deleteUser('1');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });
});
