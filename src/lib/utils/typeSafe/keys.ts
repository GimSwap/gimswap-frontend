export const ObjectKeys = <T extends Record<string, unknown>>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};
