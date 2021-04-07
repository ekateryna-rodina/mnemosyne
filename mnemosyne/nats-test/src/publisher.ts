import nats from "node-nats-streaming";
console.clear();
const stan = nats.connect("mnemosyne", "abc", { url: "http://localhost:4222" });

stan.on("connect", () => {
  console.log("Publisher connected to Nats");
  const data = JSON.stringify({
    id: "123",
    phrase: "hello",
  });

  stan.publish("card:created", data, () => {
    console.log("evvent published");
  });
});
