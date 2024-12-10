#!/usr/bin/node

/*
  - In this module, we create the class that has the Redis client to connect to Redis.
  - When importing this module, you will get an instance of the RedisClient class.
*/

import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create Redis client
    this.client = createClient({
      url: 'redis://localhost:6379', // default Redis URL
    });
    this.alive = false

    // Handle Redis client errors
    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    this.client.on('connect', () => {
      this.alive = true
      console.log('connected to redis finally')
    })

    this.client.on('end', () => {
      this.alive = false
      console.log('redis disconnected')
    })
    // // // Redis connection automatically happens when the client is created
    // this.client.connect()
    //   .then(() => console.log('Redis client connected'))
    //   .catch(err => console.error('Redis connection error:', err));
  }

  /**
   * Checks if the Redis client connection is alive
   * @returns {boolean} - True if connected, false otherwise
   */
  isAlive() {
    // Check if the connection is open
    return this.alive;
  }
  

  /**
   * Gets the value associated with a key
   * @param {string} key - The key to retrieve the value for
   * @returns {Promise<string|null>} - The value or null if the key doesn't exist
   */
  async get(key) {
    try {
      const value = await this.client.get(key); // Get value from Redis
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
   * @param {number} duration - Expiration time in seconds (optional)
   */
  async set(key, value, duration) {
    try {
      if (duration) {
        // Set key with expiration time (modern syntax with no objects)
        await this.client.set(key, value, 'EX', duration);
      } else {
        // Set key without expiration
        await this.client.set(key, value);
      }
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
      await this.client.del(key); // Delete the key
    } catch (err) {
      console.error(`Error deleting key "${key}":`, err);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient
