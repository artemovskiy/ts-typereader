import { Type, TypeKind } from '../type';
import { Constructor } from '../types';
import { BaseType } from '../base-type';
import { ClassProperty } from './types';

export class ClassType extends BaseType implements Type {
  getKind(): TypeKind {
    return TypeKind.Class;
  }

  constructor(
    private readonly properties: ClassProperty[],
    private readonly reference: Constructor<unknown>,
  ) {
    super();
  }

  getProperties(): ClassProperty[] {
    return this.properties;
  }

  getProperty(name: string): ClassProperty {
    const found = this.properties.find((prop) => prop.name === name);
    if (!found) {
      throw new TypeError(`Property: '${name}' not found on the class`);
    }
    return found;
  }

  getConstructorReference(): Constructor<unknown> {
    return this.reference;
  }
}
