import PubNub from 'pubnub';
import { v4 as uuidv4 } from 'uuid';

import { VtbTravelPlanData } from '../models';

export class VtbClientOptions {
  apiKey: string = 'TyMmPw.FvRODQ:NDve34aOuSR1uYPP';
  origin: string = 'pubnub.ably.io';

  key: string = '';
  token: string | null = '';

  parseUrl(_url: string) {
    const url = new URL(_url);
    const key = url.searchParams.get('key');

    if (!key) {
      throw new Error('Missing key!');
    }

    this.key = key;
    this.token = url.searchParams.get('token');
  }
}

interface PubNubMessage {
  message: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}


// a map that translates this property names
// to the property names used in the backend
const property_mapping = {
  description: 'additionalText',
  additional_description: 'subAdditionalText',
  subtitle: 'subTitle',
}


export class VtbBackendClient {
  public options: VtbClientOptions;
  private pubnub: PubNub | undefined;
  private uuid;

  constructor(options: VtbClientOptions) {
    this.options = options;
    this.uuid = uuidv4(); // generate uuid for this client
    // this.initialize(this.options.apiKey);
  }

  public initialize() {
    const key = this.options.key;

    if (!this.pubnub) {
      this.pubnub = new PubNub({
        ssl: true,
        authKey: key,
        uuid: this.uuid,
        origin: this.options.origin || 'pubnub.ably.io',
        subscribeKey: this.options.apiKey,
        publishKey: this.options.apiKey
      });
    }
  }

  public async requestTravelplan(): Promise<VtbTravelPlanData> {
    if (!this.pubnub) {
      throw new Error('PubNub is not initialized');
    }

    const pubnub = this.pubnub;

    // subsctribe to channel
    const channel = pubnub.channel(this.options.key);
    const subscription = channel.subscription({});

    return new Promise((resolve, error) => {
      subscription.addListener({
        message: async (msg: PubNubMessage) => {
          console.info('received message ', msg);

          if (msg && msg.message && msg.message.fileName) {
            console.info(msg.message.fileName);

            const file_url = encodeURIComponent(
              `https://vtb-live-mode.s3.eu-west-1.amazonaws.com/${msg.message.fileName}`
            );

            const proxy_url = `https://www.bureau97.nl/vtb-preview-proxy?url=${file_url}`;

            const response = await fetch(proxy_url);

            try {
              const result = await response.json();
              resolve(result.data);
            } catch (e) {
              console.warn(e);
              error(e);
            }

            /**
             * result.body.token
             * result.body.itinerary
             * result.data
             */

            // resolve(result.data);

            subscription.unsubscribe();
          }
        }
      });

      subscription.subscribe();

      pubnub.publish({
        message: { livePreviewReady: true },
        channel: this.options.key
      });
    });
  }

  public async saveTextChange(
    objectId: string,
    propertyName: string,
    content: string
  ) {

    // @ts-ignore
    const backendPropertyName = property_mapping[propertyName] || propertyName;

    const message = {
      uuid: this.uuid,
      propertyName: backendPropertyName,
      newValue: content,
      vtbObjectId: objectId
    };

    console.log('[vtbBackendClient] saveTextChange', {
      propertyName: propertyName,
      backendPropertyName: backendPropertyName,
      message: message
    });

    if (!this.pubnub) {
      console.error('PubNub is not initialized');
      return;
    }

    this.pubnub.publish({
      message: message,
      channel: this.options.key
    });
  }
}
