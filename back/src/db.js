import { MongoClient } from "mongodb";
let db;

async function  connectToDb(cb){
    const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@cluster0.d5tmjzl.mongodb.net/?retryWrites=true&w=majority`);
    await client.connect();
    db = client.db('blogs');
    cb();
}

export {
    db , 
    connectToDb
};
