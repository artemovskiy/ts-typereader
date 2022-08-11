import {
  ClassType, PropertyParams, ClassProperty,
} from './class';
import { MetadataStorage } from './metadata-storage';
import { Type } from './type';
import { Constructor } from './types';
import { LiteralType } from './literal';

export class TypeExplorer {
  constructor(
    private readonly metadataStorage: MetadataStorage,
  ) {
  }

  getClassType(constructor: Constructor<unknown>): ClassType {
    const classMeta = this.metadataStorage.getClassMetadata(constructor.prototype);
    return new ClassType(
      Object.entries(classMeta.getProperties())
        .map(([key, params]) => this.getClassProperty(constructor.prototype, key, params as PropertyParams)),
      constructor,
    );
  }

  private getClassProperty(prototype: unknown, name: string | symbol, params: PropertyParams): ClassProperty {
    const type = this.getClassPropertyType(prototype, name, params);

    return {
      name,
      type,
      optional: params.optional ?? false,
    };
  }

  getType(constructor: Constructor<any>): Type {
    if ((constructor as unknown as StringConstructor) === String) {
      return new LiteralType(String);
    }
    if ((constructor as unknown as NumberConstructor) === Number) {
      return new LiteralType(Number);
    }
    if ((constructor as unknown as BooleanConstructor) === Boolean) {
      return new LiteralType(Boolean);
    }
    if ((constructor as unknown as ArrayConstructor) === Array) {
      throw new Error('You should explicitly define item type for arrays');
    }
    return this.getClassType(constructor);
  }

  private getClassPropertyType(
    prototype: unknown,
    name: string | symbol,
    params: PropertyParams,
  ): Type {
    if (params.type) {
      return params.type;
    }
    const constructor: Constructor<any> = Reflect.getMetadata('design:type', prototype, name);
    return this.getType(constructor);
  }
}
