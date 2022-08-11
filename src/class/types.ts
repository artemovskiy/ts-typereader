import { Type } from '../type';

export interface PropertyParams {
  type: Type
  optional: boolean
}

export interface ClassProperty {
  readonly name: string | symbol;
  readonly type: Type;
  readonly optional: boolean;
}

export type AnyInstance = Record<string | symbol, any>;
