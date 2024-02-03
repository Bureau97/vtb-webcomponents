const PubNub = require('pubnub');

export class VtbMessenger {

  private pubnub?: typeof PubNub;
  // private _channel?: string;
  // private _uuid?: string;
  // private _token?: string;
  // private _secret?: string;
  // private _publish_key?: string;
  // private _subscribe_key?: string;
  // private _ssl?: boolean;
  // private _origin?: string;

  setup(): void
  {
    this.pubnub = new PubNub({});
  }

  send(data: any): void
  {
    this.pubnub.publish({
      channel: 'vtb',
      message: data
    });
  }

  // public setup(
  //   channel: string,
  //   uuid: string,
  //   token?: string,
  //   secret?: string,
  //   publish_key?: string,
  //   subscribe_key?: string,
  //   ssl?: boolean,
  //   origin?: string
  // ) {
  //   this._channel = channel;
  //   this._uuid = uuid;
  //   this._token = token;
  //   this._secret = secret;
  //   this._publish_key = publish_key;
  //   this._subscribe_key = subscribe_key;
  //   this._ssl = ssl;
  //   this._origin = origin;
  //   this.pubnub = new PubNub({
  //     publishKey: this._publish_key,
  //     subscribeKey: this._subscribe_key,
  //     secretKey: this._secret,
  //     ssl: this._ssl,
  //     origin: this._origin
  //   });
  // }

}
