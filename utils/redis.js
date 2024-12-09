#!/usr/bin/node

/*
  - in this module we create the class which has the redis client to connect to redis
  - when importing this module you will get an instance of RedisClient class
*/

import redis from 'redis';

class RedisClient {

  constructor() {

    this.client = redis.createClient(
      {url: 'redis://localhost:6379'} // default
    ); // create redis client

    // Handle errors
    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    // Connect the client (promisify for better async/await handling)
    (async () => {
      try {
        await this.client.connect();
        console.log('Redis client connected');
      } catch (err) {
        console.error('Redis connection error:', err);
      }
    })();
  }

  /**
   * Checks if the Redis client connection is alive
   * @returns {boolean} - True if connected, false otherwise
   */
  isAlive() {
    return this.client.isOpen;
  }

  /**
   * Gets the value associated with a key
   * @param {string} key - The key to retrieve the value for
   * @returns {Promise<string|null>} - The value or null if the key doesn't exist
   */
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error(`Error getting key "${key}":`, err);
      return null;
    }
  }

  /**
   * Sets a key-value pair with an expiration time
   * @param {string} key - The key to set
   * @param {string|number} value - The value to associate with the key
   * @param {number} duration - Expiration time in seconds
   */
  async set(key, value, duration) {
    try {
      await this.client.set(key, value, {
        EX: duration,
      });
    } catch (err) {
      console.error(`Error setting key "${key}":`, err);
    }
  }

  /**
   * Deletes a key from Redis
   * @param {string} key - The key to delete
   */
  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error(`Error deleting key "${key}":`, err);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
