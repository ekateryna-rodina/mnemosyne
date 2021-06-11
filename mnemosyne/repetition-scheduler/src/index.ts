import { DatabaseConnectionError } from "@meproj/common";
import mongoose from "mongoose";
import { app } from "./app";
import { EndRepetitionListener } from "./events/listeners/endRepetitionListener";
import { StartRepetitionListener } from "./events/listeners/startRepetitionListener";
import { UpdateRepetitionListener } from "./events/listeners/updateRepetitionListener";
import { jobInterval } from "./jobConfig";
import { JobScheduler } from "./jobScheduler";
// import { cronClient } from "./jobScheduler";
import { natsWrapper } from "./natsWrapper";
import { StatusUpdater } from "./statusUpdater";

const start = async () => {
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

    console.log("repetition scheduler connected to nats");
    natsWrapper.client.on("close", () => {
      console.log("Nats is closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new StartRepetitionListener(natsWrapper.client).listen();
    new EndRepetitionListener(natsWrapper.client).listen();
    new UpdateRepetitionListener(natsWrapper.client).listen();

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    throw new DatabaseConnectionError();
  }
  // run the master job
  JobScheduler.scheduleJob(jobInterval, () => StatusUpdater.checkAndUpdate());
  app.listen(3009, () => {
    console.log("version 100");
    console.log("listening on port 3009");
  });
};

start();
