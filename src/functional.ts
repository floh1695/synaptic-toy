export const curry2 = <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B): C => f(a, b);

export const mapC = <A, B>(f: (a: A) => B) => (list: A[]) => list.map(f);

export const forEachC = <A>(f: (a: A) => void) => (list: A[]): void => list.forEach(f);

export const tap = <A>(f: (a: A) => void) => (a: A): A => {
  f(a);
  return a;
};