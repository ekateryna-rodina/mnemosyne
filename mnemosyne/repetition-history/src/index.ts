import { DatabaseConnectionError } from "@meproj/common";
import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  const { MONGO_URI } = process.env;
  try {
    await mongoose.connect(MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(3007, () => {
    console.log("listening on port 3007");
  });
};

start();
