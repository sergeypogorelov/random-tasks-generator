import { ValueAndLabel } from '../interfaces/common/value-and-label.interface';

export class Utils {
  private constructor() {}

  static arrayFlat<T>(array: T[][]): T[] {
    return Array.prototype.concat.apply([], array);
  }

  static arrayDistinct<T>(array: T[], idGetter?: (item: T) => any): T[] {
    if (!idGetter) {
      idGetter = i => i;
    }

    return array.filter((item, index) => {
      return array.map(mapItem => idGetter(mapItem)).indexOf(idGetter(item)) === index;
    });
  }

  static jsonCopy<T>(source: T): T {
    if (!source) {
      throw new Error('Source is not specified.');
    }

    return JSON.parse(JSON.stringify(source));
  }

  static enumAsValueAndLabel(enumType: any): ValueAndLabel[] {
    if (!enumType) {
      throw new Error('Enum type is not specified.');
    }

    const result: ValueAndLabel[] = [];

    for (const propName in enumType) {
      if (enumType.hasOwnProperty(propName)) {
        result.push({
          value: `${enumType[propName]}`,
          label: `${propName}`
        });
      }
    }

    return result;
  }
}
