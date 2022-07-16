export namespace SendInfoLoggerProviderDTO {
  export type Parameters = {
    message: string | unknown;
  };
  export type Result = void;
}

export interface ISendInfoLoggerProvider {
  info(parameters: SendInfoLoggerProviderDTO.Parameters): SendInfoLoggerProviderDTO.Result;
}
