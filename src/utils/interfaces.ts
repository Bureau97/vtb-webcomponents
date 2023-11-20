export interface Dictionary<Type> {
  [key: string | number]: Type;
}

export interface VtbFilterConfig {
  segments?:
    | Array<Array<number | string | null>>
    | Array<number | string | null>;
  units?: Array<Array<number | string | null>> | Array<number | string | null>;
  participants?: Array<number | string | null> | Array<number | string | null>;
  days?: Array<number | string>;
  optional?: boolean;
  carrental?: boolean;
  flight?: boolean;
}
