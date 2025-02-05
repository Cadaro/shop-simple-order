export enum TokenTypeEnum {
  BEARER = 'Bearer',
}

export interface IToken {
  type: TokenTypeEnum;
  token: string;
  expiresAt: Date;
}
