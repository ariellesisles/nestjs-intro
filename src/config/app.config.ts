import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  version: Number.parseFloat(process.env.APP_VERSION ?? '1.0') || 1.0,
}));
