#!/usr/bin/node

const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('connect', () => {
      console.log('connected to redis');
    });

    this.client.on('error', (err) => {
      console.error('Error occurred:', err);
    });

    // Connect the client
    (async () => {
      await this.client.connect();
    })();
  }

  // Method to check connection state
  isAlive() {
    return this.client.isOpen;
  }

  // Get a key
  async get(key) {
    const value = await this.client.get(key);
    return value;
  }

  // Set a key with expiration
  async set(key, val, duration) {
    const value = await this.client.set(key, val, { EX: duration });
    return value;
  }

  // Delete a key
  async del(key) {
    const result = await this.client.del(key);
    return result;
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;