import { natsWrapper } from "../../../natsWrapper";
import { CardUpdatedListener } from "../cardUpdatedListener";

const setup = () => {
  // creates listener
  const listener = new CardUpdatedListener(natsWrapper.client);
  // fake event
  // fake message
};
it("updates a card", async () => {
  // call onMessage
  // test if card was updated
});
it("acknowleges the nats client", async () => {
  // call onMessage
  // test if ack was called
});
