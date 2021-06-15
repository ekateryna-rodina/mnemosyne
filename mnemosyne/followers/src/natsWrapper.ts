import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _natsClient?: Stan;
  get client() {
    if (!this._natsClient) {
      throw new Error("Nats is connecting");
    }
    return this._natsClient;
  }
  connect(clusterId: string, clientId: string, url: string) {
    this._natsClient = nats.connect(clusterId, clientId, {
      url: url,
    });
    console.log("trying to connect to nats");
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("connected to Nats");
        resolve();
      });
      this.client.on("error", (err) => {
        console.log("cannot connect to NATS");
        console.log(err);
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
