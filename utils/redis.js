#!/usr/bin/node

const radis = require('redis')


class RedisClient {

    constructor() {
        this.client = radis.createClient()
        this.client.on('conect', () => {
            console.log('connected to redis')
            this.client.on('error', () => {
                console.log('error occured')
            })
        })
    }

    // meathod to check connection state
    isAlive() {
        return this.client.isOpen;
    }

    // get 
    async get(key) {
        const value = await this.client.get(key)
        return value
    }

    // set
    async set(key,val, duration) {
        const value = await this.client.set(key,val)
        return value
    }

    // del 
    async del(key) {
        const result = await this.client.del(key)
        return result
    }
}


module.exports = RedisClient