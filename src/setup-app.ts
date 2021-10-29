import { ValidationPipe } from '@nestjs/common';
// import cookieSession from 'cookie-session';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors();
  app.use(
    cookieSession({
      keys: ['assssdddddd'],
    }),
  );
};
