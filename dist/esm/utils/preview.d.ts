import { VtbTravelPlanData } from '../models';
export declare class PreviewDataLoader {
    private _key;
    private _token;
    private _pubnub?;
    private _userId;
    constructor(key: string, token?: string);
    private initialize_pubnub;
    requestTravelplan(): Promise<VtbTravelPlanData>;
}
//# sourceMappingURL=preview.d.ts.map