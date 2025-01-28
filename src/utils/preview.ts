// @ts-nocheck

import PubNub from 'pubnub';
import { v4 as uuidv4 } from 'uuid';

const apiKey = 'TyMmPw.FvRODQ:NDve34aOuSR1uYPP';
let isLivePreview = false;
// let siteConfigCache = false;

export class PreviewDataLoader {
  travelplan = false;
  pubnub ?: PubNub;

  token?: string | null;

  async init(url: URL) {
    const key = url.searchParams.get('key');

    if (url.searchParams.get('token')) {
      this.token = url.searchParams.get('token');
    }

    return new Promise((resolve, reject) => {
      if (key) {
        console.log('LIVE PREVIEW');

        isLivePreview = true;

        this.pubnub = new PubNub({
          ssl: true,
          // no_wait_for_pending: true,
          authKey: key,
          uuid: uuidv4(),
          origin: 'pubnub.ably.io',
          subscribeKey: apiKey,
          publishKey: apiKey
        });

        console.log('subscribe!');
        this.pubnub.subscribe({
          channels: [key],
          // triggerEvents: ['message'],
          withPresence: true
        });

        console.log('requestData here!');
        this.pubnub.addListener({
          message: async (msg) => {
            console.log('got a message!');
            console.log(msg);
            if (msg.message && msg.message && msg.message.fileName) {

              const response = await fetch(`https://vtb-live-mode.s3.eu-west-1.amazonaws.com/${msg.message.fileName}`);
              const result = await response.json();
              this.travelplan = result.data;

              this.pubnub?.unsubscribe({
                channels: [key]
              });

              resolve(true);
            }
          }
        });

        console.log('requestData here!');
        this.pubnub.publish({
          message: { livePreviewReady: true },
          channel: key
        });
      }
    });
  }
}

  // async siteConfig() {
  //   return new Promise(async (resolve) => {

  //     // if(siteConfigCache) {
  //     //   console.log('siteConfigCache');
  //     //     resolve(siteConfigCache);
  //     //     return;
  //     // }

  //     if (isLivePreview) {
  //       let transformer = new SiteConfigTransformer(this.token);
  //       siteConfigCache = await transformer.transform(this.travelplan);
  //       resolve(siteConfigCache);
  //       return;
  //     }

  //     resolve(siteConfig);
  //   })
  // }

//   get(type) {
//     switch (type) {
//       case 'accommodations':
//         if (isLivePreview) {
//           let transformer = new AccommodationsTransformer();
//           return transformer.transform(this.travelplan);
//         }
//         return accommodations;
//       case 'header':
//         if (isLivePreview) {
//           let transformer = new HeaderTransformer();
//           return transformer.transform(this.travelplan);
//         }
//         return header;
//       case 'itinerary':
//         if (isLivePreview) {
//           let transformer = new ItineraryTransformer();
//           return transformer.transform(this.travelplan);
//         }
//         return itinerary;
//       case 'flight':
//         if (isLivePreview) {
//           let transformer = new FlightTransformer();
//           return transformer.transform(this.travelplan);
//         }
//         return flight;
//       case 'map':
//         if (isLivePreview) {
//           let transformer = new MapTransformer();
//           return transformer.transform(this.travelplan);
//         }
//         return map;
//       case 'optionals':
//         if (isLivePreview) {
//           let transformer = new OptionalsTransformer();
//           return transformer.transform(this.travelplan);
//         }
//         return optionals;
//       case 'participants':
//         if (isLivePreview) {
//           let transformer = new ParticipantsTransformer();
//           return transformer.transform(this.travelplan);
//         }
//         return participants;
//       case 'prices':
//         if (isLivePreview) {
//           let transformer = new PricesTransformer();
//           return transformer.transform(this.travelplan);
//         }
//         return prices;
//       case 'program':
//         if (isLivePreview) {
//           let transformer = new ProgramTransformer();
//           return transformer.transform(this.travelplan);
//         }
//         return program;
//     }
//   }
// }



// import PubNub from 'pubnub';
// import { v4 as uuidv4 } from 'uuid';


// const apiKey = 'TyMmPw.FvRODQ:NDve34aOuSR1uYPP';


// export class PreviewDataLoader {
//   private _key: string;
//   private _token: string;
//   private _pubnub?: PubNub;
//   private _userId: string;

//   constructor(key: string, token: string) {
//     this._key = key;
//     this._token = token;

//     if (!this._key || !this._token) {
//       throw new Error('Missing key or token');
//     }

//     let userId = sessionStorage.getItem('userId');
//     if (!userId) {
//       userId = uuidv4();
//       sessionStorage.setItem('userId', userId);
//     }

//     this._userId = userId;
//   }

//   private initialize_pubnub() {
//     if (!this._pubnub) {
//       this._pubnub = new PubNub({
//         ssl: true,
//         authKey: this._token,
//         userId: this._userId,
//         origin: 'pubnub.ably.io',
//         subscribeKey: apiKey,
//         publishKey: apiKey,
//         logVerbosity: true,
//       });

//       this._pubnub.addListener({
//         message: function (m) {
//           // handle message
//           // var channelName = m.channel; // The channel to which the message was published
//           // var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
//           // var pubTT = m.timetoken; // Publish timetoken
//           // var msg = m.message; // The Payload
//           // var publisher = m.publisher; //The Publisher
//           console.info('message', m);
//         },
//         presence: function (p) {
//           // handle presence
//           // var action = p.action; // Can be join, leave, state-change, or timeout
//           // var channelName = p.channel; // The channel to which the message was published
//           // var occupancy = p.occupancy; // Number of users subscribed to the channel
//           // var state = p.state; // User State
//           // var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
//           // var publishTime = p.timestamp; // Publish timetoken
//           // var timetoken = p.timetoken;  // Current timetoken
//           // var uuid = p.uuid; // UUIDs of users who are subscribed to the channel
//           console.info('presence', p);
//         },
//         signal: function (s) {
//           // handle signal
//           // var channelName = s.channel; // The channel to which the signal was published
//           // var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
//           // var pubTT = s.timetoken; // Publish timetoken
//           // var msg = s.message; // The Payload
//           // var publisher = s.publisher; //The Publisher
//           console.info('signal', s);
//         },
//         objects: (objectEvent) => {
//           // var channel = objectEvent.channel; // The channel
//           // var channelGroup = objectEvent.subscription; // The channel group
//           // var timetoken = objectEvent.timetoken; // The event timetoken
//           // var publisher = objectEvent.publisher; // The User ID that triggered this event
//           // var event = objectEvent.event; // The event name that occurred
//           // var type = objectEvent.type; // The event type that occurred
//           // var data = objectEvent.data; // The event data that occurred
//           console.info('objects', objectEvent);
//         },
//         messageAction: function (ma) {
//           // handle message reaction
//           // var channelName = ma.channel; // The channel to which the message was published
//           // var publisher = ma.publisher; //The Publisher
//           // var event = ma.message.event; // message reaction added or removed
//           // var type = ma.message.data.type; // message reaction type
//           // var value = ma.message.data.value; // message reaction value
//           // var messageTimetoken = ma.message.data.messageTimetoken; // The timetoken of the original message
//           // var actionTimetoken = ma.message.data.actionTimetoken; // The timetoken of the message reaction
//           console.info('messageAction', ma);
//         },
//         file: function (event) {
//           // const channelName = event.channel; // Channel to which the file belongs
//           // const channelGroup = event.subscription; // Channel group or wildcard subscription match (if exists)
//           // const publisher = event.publisher; // File publisher
//           // const timetoken = event.timetoken; // Event timetoken
//           // const message = event.message; // Optional message attached to the file
//           // const fileId = event.file.id; // File unique id
//           // const fileName = event.file.name;// File name
//           // const fileUrl = event.file.url; // File direct URL
//           console.info('file', event);
//         },
//         status: function (s) {
//           // var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
//           // var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
//           // var category = s.category; //Returns PNConnectedCategory
//           // var operation = s.operation; //Returns PNSubscribeOperation
//           // var lastTimetoken = s.lastTimetoken; //The last timetoken used in the subscribe request, of type long.
//           // var currentTimetoken = s.currentTimetoken; //The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
//           // var subscribedChannels = s.subscribedChannels; //All the current subscribed channels, of type array.
//           console.info('status', s);
//         },
//       });
//     }

//     return this._pubnub;
//   }

//   public connect() {
//     console.info('connecting...');

//     const pubnub = this.initialize_pubnub();

//     const channel = pubnub.channel(this._key);
//     const subscription = channel.subscription({});

//     subscription.addListener({
//       status: function (statusEvent) {
//         console.info('status', statusEvent);
//       },
//       message: (m) => {
//         console.info('Received message', m);
//       },
//       // Presence
//       presence: (p) => {
//         console.log('Presence event', p);
//       },
//     });

//     subscription.subscribe();

//     // return new Promise((resolve) => {


//     //   this._pubnub.subscribe({
//     //     channels: [this._key],
//     //     // triggerEvents: ['message'],
//     //     withPresence: true,
//     //   });

//     //   this._pubnub.addListener({
//     //     message: async (msg) => {
//     //       console.log('got a message!');

//     //       this._onMessage(msg);

//     //       resolve(true);

//     //       // if (msg.message && msg.message && msg.message.fileName) {
//     //       //   const response = await fetch(`https://vtb-live-mode.s3.eu-west-1.amazonaws.com/${msg.message.fileName}`);
//     //       //   const result = await response.json();
//     //       //   this.travelplan = result.data;

//     //       //   this.pubnub.unsubscribe({
//     //       //     channels: [key]
//     //       //   });

//     //       //   resolve(true);
//     //       // }
//     //     }
//     //   });
//     // });
//   }

//   public async loadTravelplan(): Promise<any> {

//     const pubnub = this.initialize_pubnub();

//     return pubnub.publish({
//       message: { livePreviewReady: true },
//       channel: this._key
//     });
//   }

//   // private _onMessage(msg: any) {
//   //   console.log('_onMessage:got a message!');
//   //   console.info(msg);
//   //   console.info(msg.message);
//   //   if (msg.message && msg.message.fileName) {
//   //     console.info(msg.message.fileName);
//   //   }
//   //   //   const response = await fetch(`https://vtb-live-mode.s3.eu-west-1.amazonaws.com/${msg.message.fileName}`);
//   //   //   const result = await response.json();
//   //   //   this.travelplan = result.data;

//   //   //   this.pubnub.unsubscribe({
//   //   //     channels: [key]
//   //   //   });

//   //   //   resolve(true);
//   //   // }
//   // }

// }
