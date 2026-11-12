export const databaseConfig = () => ({
  environment: process.env.NODE_ENV || 'production',
  database: {
    type: 'postgres',
    name: process.env.DB_NAME || ' blog_db',
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    synchronize: process.env.DB_SYNC === 'true', //true value should only used in dev env
    autoLoadEntities: process.env.DB_AUTOLOAD === 'true', //true value should only used in dev env
  },
});
