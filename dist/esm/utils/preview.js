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
        if (this._token) {
            console.log('recieved token', this._token);
            if (window && window.sessionStorage) {
                sessionStorage.setItem('token', this._token);
            }
        }
        // if (!this._token) {
        //   throw new Error('Missing token');
        // }
        let userId = null;
        if (window && window.sessionStorage) {
            userId = sessionStorage.getItem('userId');
            if (!userId) {
                userId = uuidv4();
                sessionStorage.setItem('userId', userId);
            }
        }
        else {
            userId = uuidv4();
        }
        this._userId = userId;
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
        return new Promise((resolve) => {
            subscription.addListener({
                message: async (msg) => {
                    console.info('received message ', msg);
                    if (msg && msg.message && msg.message.fileName) {
                        console.info(msg.message.fileName);
                        const file_url = encodeURIComponent(`https://vtb-live-mode.s3.eu-west-1.amazonaws.com/${msg.message.fileName}`);
                        const response = await fetch('http://localhost.b97.nl/vtb-preview-proxy/?url=' + file_url);
                        // const result = await response.json();
                        // const file_url = `https://vtb-live-mode.s3.eu-west-1.amazonaws.com/${msg.message.fileName}`;
                        // // console.info('file url', file_url);
                        // const response = await fetch(file_url);
                        // // console.info('response', response);
                        const result = await response.json();
                        // console.info('result', result);
                        /**
                         * result.body.token
                         * result.body.itinerary
                         * result.data
                         */
                        resolve(result.data);
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