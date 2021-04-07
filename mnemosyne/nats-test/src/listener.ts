import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { CardCreatedListener } from "./events/cardCreatedListener";
console.clear();
const stan = nats.connect("mnemosyne", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener is connected");

  stan.on("close", () => {
    console.log("Connection to NATS is closed");
    process.exit();
  });

  new CardCreatedListener(stan).listen();
});

process.on("SIGINT", () => {
  stan.close();
});
process.on("SIGTERM", () => {
  stan.close();
});
