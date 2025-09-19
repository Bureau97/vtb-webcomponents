import { VtbTravelPlanData } from '../models';
export declare class VtbClientOptions {
    apiKey: string;
    origin: string;
}
export declare class VtbClient {
    options: VtbClientOptions;
    private pubnub;
    private uuid;
    private key;
    constructor(options: VtbClientOptions);
    initialize(key: string): void;
    requestTravelplan(): Promise<VtbTravelPlanData>;
    saveTextChange(objectId: string, propertyName: string, content: string): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map