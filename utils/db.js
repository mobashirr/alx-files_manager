
/**
 * this module define our mongo client
 */

import { MongoClient, ObjectId } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        this.dbClient = false;
      } else {
        // connect to the database
        this.dbClient = client.db(database);
      }
    });
  }

  isAlive() {
    return !!this.dbClient;
  }

  async nbUsers() {
    return this.dbClient.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.dbClient.collection('files').countDocuments();
  }

  async getUserById(userid) {
    return this.dbClient.collection('users').findOne({ _id: ObjectId(userid) });
  }

  async insertDocument(document) {
      const result = await this.dbClient.collection('files').insertOne(document);
      console.log("Document inserted with _id:", result.insertedId);
      return result;
  }

  async find_document(query) {
    const result = await this.dbClient.collection('files').findOne(query)
    return result
  }
}

export default new DBClient();