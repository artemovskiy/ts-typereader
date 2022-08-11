import { Constructor } from './types';
import { ArrayType } from './array';
import { LiteralType, LiteralConstructor } from './literal';

export const isLiteralConstructor = (constructor: any): constructor is LiteralConstructor =>
  ([String, Number, Boolean]).includes(constructor);

export const literalType = (constructor: LiteralConstructor): LiteralType =>
  new LiteralType(constructor);

export const arrayOf = (constructor: Constructor<any>): ArrayType => {
  if (!isLiteralConstructor(constructor)) {
    throw new Error('arrayOf classes is not supported');
  }
  return new ArrayType(literalType(constructor));
};
