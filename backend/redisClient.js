// backend/redisClient.js
const { default: chalk } = require('chalk');
const { createClient } = require('redis');
require('dotenv').config();

const log = console.log;
const client = createClient({
  url: `rediss://default:${process.env.REDIS_REST_TOKEN}@present-python-34647.upstash.io:6379`
});

client.on("error", function (err) {
  throw err;
});

async function initRedis() {
  try {
    await client.connect();
    await client.set('foo', 'bar');
    const data = await client.get('foo');
    log(chalk.blue('Redis client connected'));
  } catch (error) {
    log(chalk.red('Error connecting to Redis:', error));
  }
}

initRedis();

module.exports = client

