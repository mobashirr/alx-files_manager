#!/usr/bin/node

/**
 * this module is the controller layer which intract with the model layer
 */

const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static getStatus(req, res) {
        res.status(200).send({
            redis: redisClient.isAlive(),
            db: dbClient.isAlive(),
        });
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async getStats(req, res) {
        const users = await dbClient.nbUsers();
        const files = await dbClient.nbFiles();

        res.status(200).send({ users, files });
    }
}

module.exports = AppController;
