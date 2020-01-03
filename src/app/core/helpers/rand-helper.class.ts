const MIN_PROBABILITY = 0;

const MAX_PROBABILITY = 100;

export class RandHelper {
  private constructor() {}

  static getTrueOrFalse(probability: number): boolean {
    if (probability < MIN_PROBABILITY || probability > MAX_PROBABILITY) {
      throw new Error(`Probability cannot be less than ${MIN_PROBABILITY} and more than ${MAX_PROBABILITY}.`);
    }

    if (probability === MIN_PROBABILITY) {
      return false;
    }

    if (probability === MAX_PROBABILITY) {
      return true;
    }

    const array: boolean[] = [];

    let i = probability;
    while (i > 0) {
      array.push(true);
      i--;
    }

    i = MAX_PROBABILITY - probability;
    while (i > 0) {
      array.push(false);
      i--;
    }

    const shuffledArray = RandHelper.arrayShuffle(array);

    const middleIndex = Math.floor(shuffledArray.length / 2);
    return shuffledArray[middleIndex];
  }

  static arrayShuffle<T>(array: T[]): T[] {
    if (!array) {
      throw new Error('Array is not specified.');
    }

    let tempValue: T;
    let randomIndex: number;
    let currentIndex = array.length;

    array = [...array];

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      tempValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = tempValue;
    }

    return array;
  }
}
