import { DatabaseConnectionError } from "@krproj/common";
import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  try {
    await mongoose.connect("mongodb://cards-mongo-srv:27017/mne-cards", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(3006, () => {
    console.log("version 100");
    console.log("listening on port 3006");
  });
};

start();
