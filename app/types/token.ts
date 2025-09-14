export enum TokenTypeEnum {
  BEARER = 'Bearer',
}

export type Token = {
  type: TokenTypeEnum;
  token: string;
  expiresAt: Date;
};

export interface TokenProvider {
  createToken(user: any, expiresIn?: string): Promise<Token>;
}
