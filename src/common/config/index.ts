import * as dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV !== 'production') {
  const envFound = dotenv.config();
  if (envFound.error) throw new Error("Couldn't find .env file");
}

const databaseHost =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_HOST
    : 'localhost';
const redisHost =
  process.env.NODE_ENV === 'production' ? process.env.REDIS_HOST : 'localhost';

export default {
  port: parseInt(process.env.PORT as string, 10),
  reqAddress: process.env.REQ_ADDRESS,
  database: {
    dbname: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: databaseHost,
  },
  redis: {
    port: 6379,
    host: redisHost,
  },
  cloudinaryApi: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
  jwtAccessKey: process.env.JWT_ACCESS_SECRET,
  jwtRefreshKey: process.env.JWT_REFRESH_SECRET,
  api: {
    prefix: '/api',
  },
  emailAuth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
