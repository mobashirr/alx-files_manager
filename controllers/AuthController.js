#!/usr/bin/node

/**
 * this module handle the authintcation process
 */

import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';


class AuthController {

  /**
   * authnitace a user using basic authntication method (basic username:pass) in base64
   * when user is authnicated we will send them back a token that is validated
   * and saved in our redis (session db)
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async getConnect(req, res) 
  {
    // first we need to get the authrization credentials from http headers
    const credentials = req.header('Authorization').split(' ')[1];
    const [email, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.dbClient.collection('users').findOne({ email, password: sha1(password) });
    if (!user || user.password != sha1(password)) {
      // if user not exist or password not match don't authorize
      console.log('notExist')
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // generate random token and save it to session database(redis)
    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 60 * 60 * 24);
    return res.status(200).json({ token });
  }

  /**
   * when disconnect we delete the validated token from our session (redis)
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      // if user is not exist then it can't be deleted
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await redisClient.del(`auth_${token}`);
    return res.status(204).end(); // end will make ;à send empty body, 204 mean no content
  }
}

export default AuthController;
