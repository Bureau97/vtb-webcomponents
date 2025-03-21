import PubNub from 'pubnub';
import {v4 as uuidv4} from 'uuid';
import {VtbTravelPlanData} from '../models';

const apiKey = 'TyMmPw.FvRODQ:NDve34aOuSR1uYPP';

interface PubNubMessage {
  message: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export class PreviewDataLoader {
  private _key: string;
  private _token: string | undefined;
  private _pubnub?: PubNub;
  private _userId: string;

  constructor(key: string, token?: string) {
    this._key = key;
    this._token = token;

    if (!this._key) {
      throw new Error('Missing key');
    }

    if (this._token) {
      console.log('recieved token', this._token);
      // sessionStorage.setItem('token', this._token);
    }

    // if (!this._token) {
    //   throw new Error('Missing token');
    // }

    let userId = null;

    try {
      userId = sessionStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4();
        sessionStorage.setItem('userId', userId);
      }
    } catch (e) {
      console.error(e);
      userId = uuidv4(); // fallback when sessionStorage is not available
    }

    this._userId = userId;
  }

  private initialize_pubnub() {
    if (!this._pubnub) {
      this._pubnub = new PubNub({
        ssl: true,
        authKey: this._key,
        userId: this._userId,
        origin: 'pubnub.ably.io',
        subscribeKey: apiKey,
        publishKey: apiKey,
        logVerbosity: false
      });
    }

    return this._pubnub;
  }

  public async requestTravelplan(): Promise<VtbTravelPlanData> {
    const pubnub = this.initialize_pubnub();

    const channel = pubnub.channel(this._key);
    const subscription = channel.subscription({});

    return new Promise((resolve) => {
      subscription.addListener({
        message: async (msg: PubNubMessage) => {
          console.info('received message ', msg);

          if (msg && msg.message && msg.message.fileName) {
            console.info(msg.message.fileName);

            // const file_url = encodeURIComponent(
            //   `https://vtb-live-mode.s3.eu-west-1.amazonaws.com/${msg.message.fileName}`
            // );
            // const response = await fetch(
            //   'http://localhost.b97.nl/vtb-preview-proxy/?url=' + file_url
            // );
            // const result = await response.json();

            const file_url = `https://vtb-live-mode.s3.eu-west-1.amazonaws.com/${msg.message.fileName}`;
            console.info('file url', file_url);
            const response = await fetch(file_url);
            console.info('response', response);
            const result = await response.json();
            console.info('result', result);

            resolve(result.data);

            subscription.unsubscribe();
          }
        }
      });

      subscription.subscribe();

      pubnub.publish({
        message: {livePreviewReady: true},
        channel: this._key
      });
    });
  }
}
