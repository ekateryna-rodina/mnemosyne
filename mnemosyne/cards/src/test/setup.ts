import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { UserNumber, users } from "../data/mockData";

declare global {
  namespace NodeJS {
    interface Global {
      signin(user: UserNumber): string[];
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "secret";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  mongoose.connection.close();
});

global.signin = (user: UserNumber) => {
  // create payload
  // sign in as different users
  const payload = users[user];
  // create the token
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build a session
  const session = { jwt: token };

  // convert to JSON
  const sessionJSON = JSON.stringify(session);

  // convert to base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return as cookie
  return [`express:sess=${base64}`];
};
