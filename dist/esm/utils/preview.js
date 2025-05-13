import PubNub from 'pubnub';
import { v4 as uuidv4 } from 'uuid';
const apiKey = 'TyMmPw.FvRODQ:NDve34aOuSR1uYPP';
export class PreviewDataLoader {
    constructor(key, token) {
        this._key = key;
        this._token = token;
        if (!this._key) {
            throw new Error('Missing key');
        }
        // just for TS check
        if (this._token) {
            console.info('We have a token..');
        }
        this._userId = uuidv4();
    }
    initialize_pubnub() {
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
    async requestTravelplan() {
        const pubnub = this.initialize_pubnub();
        const channel = pubnub.channel(this._key);
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
                channel: this._key
            });
        });
    }
}
//# sourceMappingURL=preview.js.map