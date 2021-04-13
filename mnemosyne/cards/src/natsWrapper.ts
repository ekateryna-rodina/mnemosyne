import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _natsClient?: Stan;
  get natsClient() {
    if (!this._natsClient) {
      throw new Error("Nats is connecting");
    }
    return this._natsClient;
  }
  connect(clusterId: string, clientId: string, url: string) {
    console.log("kjidfsosd");
    console.log(clusterId);
    console.log(clientId);
    console.log(url);
    this._natsClient = nats.connect(clusterId, clientId, {
      url: url,
    });
    return new Promise<void>((resolve, reject) => {
      this.natsClient.on("connect", () => {
        console.log("connected to Nats");
        resolve();
      });
      this.natsClient.on("error", (err) => {
        console.log("cannot connect to NARS");
        console.log(err);
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
