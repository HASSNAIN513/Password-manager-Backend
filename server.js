import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';


dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = "Passwordmanager";

let db;
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

// ✅ Routes
app.get("/", (req, res) => {
  res.send("✅ Password Manager API is running!");
});

app.get("/passwords", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("password");
  const data = await collection.find({}).toArray();
  res.json(data);
});

app.post("/passwords", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("password");
  await collection.insertOne(req.body);
  res.json({ success: true, data: req.body });
});

app.delete("/passwords", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("password");
  await collection.deleteOne(req.body);
  res.json({ success: true });
});

// ✅ Local server (needed only for running locally)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});