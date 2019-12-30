import { ValueAndLabel } from '../interfaces/common/value-and-label.interface';

export class Utils {
  private constructor() {}

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
