export type DeepPartial<O> = O extends string | Function | number | boolean
  ? O
  : {
      [K in keyof O]?: DeepPartial<O[K]>;
    };
