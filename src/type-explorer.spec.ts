import { TypeExplorer } from './type-explorer';
import { MetadataStorage } from './metadata-storage';
import {
  ClassType, Property,
} from './class';
import 'reflect-metadata';
import { TypeKind } from './type';
import { arrayOf } from './helpers';

class State {
  @Property()
  name: string;

  @Property()
  code: string;
}

class Address {
  @Property()
  state: State;

  @Property()
  city: string;

  @Property()
  street: string;

  @Property()
  house: number;

  @Property({ optional: true })
  apartment: number;
}

class User {
  @Property()
  name: string;

  @Property()
  address: Address;

  @Property({ type: arrayOf(String), optional: false })
  phoneNumbers: string[];
}

class Merchant {
  @Property()
  id: number;

  @Property()
  address: Address;
}

describe('TypeExplorer', () => {
  let explorer: TypeExplorer;
  let userType: ClassType;
  let merchantType: ClassType;

  beforeEach(() => {
    explorer = new TypeExplorer(
      MetadataStorage.instance(),
    );
    userType = explorer.getClassType(User);
    merchantType = explorer.getClassType(Merchant);
  });

  test('should list all the properties', () => {
    expect(userType.getProperties().map((p) =>
      [p.name, p.type.getKind(), p.optional])).toEqual([
      ['name', TypeKind.LiteralType, false],
      ['address', TypeKind.Class, false],
      ['phoneNumbers', TypeKind.Array, false],
    ]);

    expect(userType.getProperty('name').type.as(TypeKind.LiteralType).getConstructorReference()).toBe(String);
    expect(userType.getProperty('address').type.as(TypeKind.Class).getConstructorReference()).toBe(Address);
  });

  test('should have the same constructor reference of every class reference', () => {
    const userAddressType: ClassType = userType.getProperty('address').type.as(TypeKind.Class);
    const merchantAddressType: ClassType = merchantType.getProperty('address').type.as(TypeKind.Class);

    expect(userAddressType.getConstructorReference()).toBe(merchantAddressType.getConstructorReference());
  });

  test('should correctly explore string[] property', () => {
    const phoneNumbersType = userType.getProperty('phoneNumbers').type;
    expect(phoneNumbersType.getKind()).toBe(TypeKind.Array);
    const elementType = phoneNumbersType.as(TypeKind.Array).getElementType();
    expect(elementType.getKind()).toBe(TypeKind.LiteralType);
    expect(elementType.as(TypeKind.LiteralType).getConstructorReference()).toBe(String);
  });
});
