export interface Dictionary<Type> {
    [key: string | number]: Type;
}
export interface VtbFilterConfig {
    group_ids?: Array<number | string | null>;
    group_type_ids?: Array<Array<number | string | null>> | Array<number | string | null>;
    element_ids?: Array<number | string | null>;
    element_unit_ids?: Array<Array<number | string | null>> | Array<number | string | null>;
    participant_ids?: Array<number | string | null> | Array<number | string | null>;
    days?: Array<number | string>;
    optional?: boolean;
    carrental?: boolean;
    flight?: boolean;
}
//# sourceMappingURL=interfaces.d.ts.map