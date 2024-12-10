#!/usr/bin/node


import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { userQueue } from '../worker';


class UsersController {

  /**
   * create a new user and add it to the database
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const userExists = await dbClient.dbClient.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // add the new user
    const hashedPassword = sha1(password);
    const result = await dbClient.dbClient.collection('users').insertOne({ email, password: hashedPassword });
    userQueue.add({ userId: result.insertedId });
    return res.status(201).json({ id: result.insertedId, email });
  }

  /**
   * get the user
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async getMe(req, res) {

    const token = req.header('x-token');

    if (!token) {
      console.log('no token')
      return res.status(401).json({ error: 'Unauthorized' });}
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      console.log('no user id found')
      return res.status(401).json({ error: 'Unauthorized' });}

    const users = await dbClient.dbClient.collection('users');
    const ObjId = new ObjectId(userId);

    const user = await users.findOne({ _id: ObjId });
    if (user) return res.status(200).json({ id: userId, email: user.email });
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default UsersController;