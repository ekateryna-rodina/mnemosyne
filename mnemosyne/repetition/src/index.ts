import { DatabaseConnectionError } from "@meproj/common";
import mongoose from "mongoose";
import { app } from "./app";
import { CardUpdatedListener } from "./events/listeners/cardUpdatedListener";
import { natsWrapper } from "./natsWrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  const { MONGO_URI, NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL } = process.env;
  try {
    // connect to Nats client
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);

    console.log("repetition connected to nats");
    natsWrapper.client.on("close", () => {
      console.log("Nats is closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new CardUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(3002, () => {
    console.log("version 100");
    console.log("listening on port 3002");
  });
};

start();
