import config from './index';

const redis = require('redis');

const client = redis.createClient({ legacyMode: true, socket: config.redis });
client.on('connect', () => {
  console.info('Redis connected!');
});
client.on('error', (err: Error) => {
  console.error('Redis Client Error gg', err);
});
client.connect().then();
export default client;
