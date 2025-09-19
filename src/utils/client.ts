import PubNub from "pubnub";
import { v4 as uuidv4 } from "uuid";


export class VtbClientOptions {
  apiKey = "TyMmPw.FvRODQ:NDve34aOuSR1uYPP";
  origin = "pubnub.ably.io";
}


export class VtbClient {
  public options: VtbClientOptions
  private pubnub: PubNub | undefined
  private uuid
  private key = ""

  constructor(options: VtbClientOptions) {
    this.options = options;
    this.uuid = uuidv4(); // generate uuid for this client
    // this.initialize(this.options.apiKey);
  }

  public initialize(key: string) {
    this.key = key;

    if (!this.pubnub) {
      this.pubnub = new PubNub({
        ssl: true,
        authKey: key,
        uuid: this.uuid,
        origin: this.options.origin || "pubnub.ably.io",
        subscribeKey: this.options.apiKey,
        publishKey: this.options.apiKey,
      });
    }
  }

  public saveTextChange(objectId: string, propertyName: string, content: string) {
    console.log({
      uuid: this.uuid,
      propertyName: propertyName,
      newValue: content,
      vtbObjectId: objectId,
    });

    if (!this.pubnub) {
      console.error("PubNub is not initialized");
      return;
    }

    this.pubnub.publish({
      message: {
        uuid: this.uuid,
        propertyName: propertyName,
        newValue: content,
        vtbObjectId: objectId,
      },
      channel: this.key,
    });
  }
}
