import minOf, { map as minOfMap } from './minOf';

describe('array: minimum of 2 values', () => {
  test('and returning first value', () => {
    const actual = minOf([{ value: 1 }, { value: 2 }], ({ value }) => value);

    expect(actual).toEqual({ value: 1 });
  });

  test('and returning last value', () => {
    const actual = minOf([{ value: 2 }, { value: 1 }], ({ value }) => value);

    expect(actual).toEqual({ value: 1 });
  });
});

describe('array: predicate returning undefined should be ignored', () => {
  test('with first value undefined', () => {
    const actual = minOf([{}, { value: 1 }, { value: 2 }], ({ value }) => value);

    expect(actual).toEqual({ value: 1 });
  });

  test('with middle value undefined', () => {
    const actual = minOf([{ value: 1 }, {}, { value: 2 }], ({ value }) => value);

    expect(actual).toEqual({ value: 1 });
  });

  test('with last value undefined', () => {
    const actual = minOf([{ value: 1 }, { value: 2 }, {}], ({ value }) => value);

    expect(actual).toEqual({ value: 1 });
  });
});

test('array: minimum of 2 undefineds', () => {
  const actual = minOf([undefined, undefined]);

  expect(actual).toBeUndefined();
});

test('array: undefined selector', () => {
  const actual = minOf([1, 2]);

  expect(actual).toBe(1);
});

describe('map: minimum of 2 values', () => {
  test('and returning first value', () => {
    const actual = minOfMap({ one: 1, two: 2 });

    expect(actual).toEqual(['one', 1]);
  });

  test('and returning last value', () => {
    const actual = minOfMap({ two: 2, one: 1 });

    expect(actual).toEqual(['one', 1]);
  });
});

describe('map: predicate returning undefined should be ignored', () => {
  test('with first value undefined', () => {
    const actual = minOfMap({ und: undefined, one: 1, two: 2 });

    expect(actual).toEqual(['one', 1]);
  });

  test('with middle value undefined', () => {
    const actual = minOfMap({ one: 1, und: undefined, two: 2 });

    expect(actual).toEqual(['one', 1]);
  });

  test('with last value undefined', () => {
    const actual = minOfMap({ one: 1, two: 2, und: undefined });

    expect(actual).toEqual(['one', 1]);
  });
});

test('map: minimum of 2 undefineds', () => {
  const actual = minOfMap({ one: undefined, two: undefined });

  expect(actual).toBeUndefined();
});

test('map: undefined selector', () => {
  const actual = minOfMap({ one: 1, two: 2 });

  expect(actual).toEqual(['one', 1]);
});
