import nats from "node-nats-streaming";
import { CardCreatedPublisher } from "./events/cardCreatedPublisher";
console.clear();
const stan = nats.connect("mnemosyne", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  console.log("Publisher connected to Nats");
  const data = {
    id: "123",
    phrase: "hello",
  };

  const publisher = new CardCreatedPublisher(stan);
  try {
    await publisher.publish(data);
  } catch (error) {
    console.log(error);
  }
});
