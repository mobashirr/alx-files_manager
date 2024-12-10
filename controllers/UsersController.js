#!/usr/bin/node

import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import crypto from 'crypto'


class UsersController {

    static async postNew(req, res) {

        const data = req.body

        if (!data['email']) {
            // missing email
            res.status(400).json({error: 'Missing email'})
        }
        else if(!data['password']) {
            // missing password
            res.status(400).json({error: 'Missing password'})
        }
        else {

        // check if user already exist
        const user_exist = await dbClient.get_user(data['email'])

        if (!user_exist)
        {
            // add the user to the database
            console.log('try to add new user:')
            const hash = crypto.createHash('sha1');
            const hashed_pass = hash.update(data['password']).digest('base64')
            const given_id = dbClient.add_user(data['email'], hashed_pass)
            console.log('new user added')
            const res_messege = `added user with ${data["email"]} and given id is ${given_id}.`
            res.status(200).json({
                id:res_messege,
                email:data['email']})
        }
        else {
        res.status(400).json('Already exist')
        }
        }
    }
}

module.exports = UsersController