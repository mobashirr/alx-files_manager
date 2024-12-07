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
    async isAlive() {
        const check = await this.client.ping()
        return response === 'PONG';
    }
}


module.exports = RedisClient