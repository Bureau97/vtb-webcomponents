import PubNub from 'pubnub';
import {v4 as uuidv4} from 'uuid';

import {VtbTravelPlanData} from '../models';

export class VtbClientOptions {
  apiKey = 'TyMmPw.FvRODQ:NDve34aOuSR1uYPP';
  origin = 'pubnub.ably.io';
}

interface PubNubMessage {
  message: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}


// a map that translates this property names
// to the property names used in the backend
const property_mapping = {
  description: 'description',
  additional_description: 'additionalDescription',
}


export class VtbClient {
  public options: VtbClientOptions;
  private pubnub: PubNub | undefined;
  private uuid;
  private key = '';

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
    const channel = pubnub.channel(this.key);
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
        message: {livePreviewReady: true},
        channel: this.key
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

    console.log({
      uuid: this.uuid,
      propertyName: propertyName,
      backendPropertyName: backendPropertyName,
      newValue: content,
      vtbObjectId: objectId
    });

    if (!this.pubnub) {
      console.error('PubNub is not initialized');
      return;
    }

    this.pubnub.publish({
      message: {
        uuid: this.uuid,
        propertyName: backendPropertyName,
        newValue: content,
        vtbObjectId: objectId
      },
      channel: this.key
    });
  }
}
