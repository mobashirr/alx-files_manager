#!/usr/bin/node

/**
 * filecontroller module
 */

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';


class FilesController {
  static async postUpload(req, res) {
    console.log('try to post new file')
    const token = req.headers['x-token'];
    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId !== 0) {
      const parent = await dbClient.findDocument('files', { _id: parentId });
      if (!parent) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parent.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const fileData = {
      userId: user._id,
      name,
      type,
      isPublic,
      parentId,
    };

    if (type === 'file' || type === 'image') {
      const uuid = uuidv4();
      const localPath = path.join(folderPath, uuid);

      try {
        // Decode and write the file content
        fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(localPath, Buffer.from(data, 'base64'));
        fileData.localPath = localPath;
      } catch (error) {
        return res.status(500).json({ error: 'Could not save the file' });
      }
    }

    const result = await dbClient.insertDocument(fileData);
    return res.status(201).json({
      id: result.insertedId,
      userId: fileData.userId,
      name: fileData.name,
      type: fileData.type,
      isPublic: fileData.isPublic,
      parentId: fileData.parentId,
    });
  }

    // GET /files/:id
    static async getShow(req, res) {
      const token = req.headers['x-token'];
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
      const fileId = req.params.id;
  
      try {
        const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(fileId), userId });
        if (!file) return res.status(404).json({ error: 'Not found' });
  
        const { _id, ...fileData } = file; // Return with "id" instead of "_id"
        res.status(200).json({ id: _id, ...fileData });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
      }
    }
  
    // GET /files
    static async getIndex(req, res) {
      const token = req.headers['x-token'];
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
      const parentId = req.query.parentId || '0'; // Default to root if parentId is not provided
      const page = parseInt(req.query.page, 10) || 0; // Default to page 0
      const pageSize = 20;
  
      try {
        const query = { userId, parentId };
        const files = await dbClient.dbClient
        .collection('files')
        .find(query)
        .skip(page * pageSize)
        .limit(pageSize)
        .toArray();
  
        const result = files.map(({ _id, ...fileData }) => ({ id: _id, ...fileData })); // Transform "_id" to "id"
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
      }
    }

   static async putPublish(req,res) {
    res.status(404).json('not implemented yet')
   }
   static async putUnpublish(req,res) {
    res.status(404).json('not implemented yet')
   }
   static async getFile(req,res) {
    res.status(404).json('not implemented yet')
   }
}

export default FilesController;
