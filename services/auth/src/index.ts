import mongoose from "mongoose";
import { app } from "./app";
import { DatabaseConnectionError } from "./errors/databaseConnectionError";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/mne-auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(3005, () => {
    console.log("version 21");
    console.log("listening on port 3005");
  });
};

start();
