import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.MONGO_URI;

console.log(connectionString);

const client = new MongoClient(connectionString);

let conn;

try {
  conn = await client.connect();
  console.log("MongoDB connection established successfully");
}catch (error) {
    console.error(error);
    }

    let db = client.db("Cluster0");

    export default db;