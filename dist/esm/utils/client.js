import PubNub from 'pubnub';
import { v4 as uuidv4 } from 'uuid';
export class VtbClientOptions {
    constructor() {
        this.apiKey = 'TyMmPw.FvRODQ:NDve34aOuSR1uYPP';
        this.origin = 'pubnub.ably.io';
    }
}
export class VtbClient {
    constructor(options) {
        this.key = '';
        this.options = options;
        this.uuid = uuidv4(); // generate uuid for this client
        // this.initialize(this.options.apiKey);
    }
    initialize(key) {
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
    async requestTravelplan() {
        if (!this.pubnub) {
            throw new Error('PubNub is not initialized');
        }
        const pubnub = this.pubnub;
        // subsctribe to channel
        const channel = pubnub.channel(this.key);
        const subscription = channel.subscription({});
        return new Promise((resolve, error) => {
            subscription.addListener({
                message: async (msg) => {
                    console.info('received message ', msg);
                    if (msg && msg.message && msg.message.fileName) {
                        console.info(msg.message.fileName);
                        const file_url = encodeURIComponent(`https://vtb-live-mode.s3.eu-west-1.amazonaws.com/${msg.message.fileName}`);
                        const proxy_url = `https://www.bureau97.nl/vtb-preview-proxy?url=${file_url}`;
                        const response = await fetch(proxy_url);
                        try {
                            const result = await response.json();
                            resolve(result.data);
                        }
                        catch (e) {
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
                channel: this.key
            });
        });
    }
    async saveTextChange(objectId, propertyName, content) {
        console.log({
            uuid: this.uuid,
            propertyName: propertyName,
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
                propertyName: propertyName,
                newValue: content,
                vtbObjectId: objectId
            },
            channel: this.key
        });
    }
}
//# sourceMappingURL=client.js.map