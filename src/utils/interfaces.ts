export interface Dictionary<Type> {
  [key: string | number]: Type;
}

export interface VtbFilterConfig {
  segments?: Array<Array<number | string>>;
  units?: Array<Array<number | string>>;
  participants?: Array<number | string>;
  days?: Array<number | string>;
  optional?: boolean;
}
