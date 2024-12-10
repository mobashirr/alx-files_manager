#!/usr/bin/node

/*
    - this module contain the DBClient class which is our interface to mogodb
*/

import MongoClient  from 'mongodb/lib/mongo_client';

class DBClient {

    constructor(){
        // env var or default values
        const DB_HOST = process.env.DB_HOST || 'localhost'
        const DB_PORT = process.env.DB_PORT || '27017'
        const url = `mongodb://${DB_HOST}:${DB_PORT}`;

        //  Initializes (async) the client object but does not establish a connection to the database
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.DB_DATABASE = process.env.DB_DATABASE ||'files_manager'

        //Establishes the connection to the MongoDB server.
        this.client.connect()
            .then(() => {
                console.log('MongoDB connected successfully');
                this.db = this.client.db(this.DB_DATABASE);
            })
            .catch((error) => {
                console.error('Error connecting to MongoDB:', error);
                this.db = null;
            });
    }

    /**
     * Check if connection to db is valid
     * @return {boolean} true or false
     */
    isAlive () {
        return this.db ? true:false
    }


    /**
     * check the number of users in 'users' collection
     * @returns {Promise<number>}
     */
    async nbUsers() {
        if (this.isAlive()){
            const count = await this.db.collection('users').countDocuments();
            return count
        }
        return 0
    }

    /**
     * Get the number of files in the collection
     * @returns {Promise<number>}
     */
    async nbFiles() {
        if (!this.isAlive()) return 0;
        return this.db.collection('files').countDocuments();
    }


    /**
     * 
     * @param {string} email 
     * @param {string}} pass
     * @returns {number} document id
     */
    async add_user(email, pass) {

        if (email, pass) {
            const document_id = this.db.collection('users').insertOne({email:email, password:pass})
            return document_id
        }
    }

    /**
     * get user with emial from database
     * @param {string} email
     * @returns document which is the user data
     */
    async get_user(email) {
        const query = { email: email }; // Filter
        const document = await this.db.collection('users').findOne(query)
        return document
    }
}


// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient
