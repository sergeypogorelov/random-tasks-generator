export class Utils {
  private constructor() {}

  static jsonCopy<T>(source: T): T {
    if (!source) {
      throw new Error('Source is not specified.');
    }

    return JSON.parse(JSON.stringify(source));
  }
}
