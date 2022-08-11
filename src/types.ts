export type Constructor<T, TArgs extends any[] = any[]> = {
  new (...args: TArgs): T;
};