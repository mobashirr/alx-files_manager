
// task 0

// import redisClient from './utils/db';
// import dbClient from './utils/db'

// (async () => {  
//     // console.log(dbClient.nbFiles())
//     console.log(dbClient.nbUsers())
// })();


// task 1
// import dbClient from './utils/db';

// const waitConnection = () => {
//     return new Promise((resolve, reject) => {
//         let i = 0;
//         const repeatFct = async () => {
//             await setTimeout(() => {
//                 i += 1;
//                 if (i >= 10) {
//                     reject('no res')
//                 }
//                 else if(!dbClient.isAlive()) {
//                     repeatFct()
//                 }
//                 else {
//                     resolve('connected')
//                 }
//             }, 1000);
//         };
//         repeatFct();
//     })
// };

// (async () => {
//     console.log(dbClient.isAlive());
//     await waitConnection();
//     console.log(dbClient.isAlive());
//     console.log(await dbClient.nbUsers());
//     console.log(await dbClient.nbFiles());
// })();


//  curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "ahmed", "password": "ahmed" }' ; echo ""
// user   ahmed5 ahmed
// auth in base64
// YWhtZWQ1OmFobWVk

// make authintaction to get token 
// curl 0.0.0.0:5000/connect -H "Authorization: Basic YWhtZWQ1OmFobWVk" ; echo ""
// something like this : {"token":"3f5f9297-a507-4ef5-b194-19767335d06c"}

// use token from above step to get the users/me endpoint
// curl 0.0.0.0:5000/users/me -H "X-Token: 3f5f9297-a507-4ef5-b194-19767335d06c" ; echo ""



// clear the data base const { MongoClient } = require('mongodb');

// const { MongoClient } = require('mongodb');
// const redis = require('redis');

// async function clearAll() {
//   const mongoUri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
//   const redisClient = redis.createClient();

//   // MongoDB
//   try {
//     const mongoClient = new MongoClient(mongoUri);
//     await mongoClient.connect();
//     const db = mongoClient.db('yourDatabaseName'); // Replace with your database name
//     const collection = db.collection('yourCollectionName'); // Replace with your collection name

//     const mongoResult = await collection.deleteMany({});
//     console.log(`Deleted ${mongoResult.deletedCount} documents from MongoDB collection.`);
//     await mongoClient.close();
//   } catch (error) {
//     console.error('Error clearing MongoDB collection:', error);
//   }

//   // Redis
//   try {
//     redisClient.on('error', (err) => console.error('Redis Client Error', err));
//     await redisClient.connect();
//     await redisClient.flushAll(); // Flush all Redis keys
//     console.log('All keys cleared from Redis.');
//     await redisClient.quit();
//   } catch (error) {
//     console.error('Error clearing Redis:', error);
//   }
// }

// clearAll();


// upload image 

