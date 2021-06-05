export const curry2 = <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B): C => f(a, b);

export const concat = <A>(xs: A[], ys: A[]) => xs.concat(ys);

export const id = <A>(x: A): A => x;

export const mapC = <A, B>(f: (a: A) => B) => (list: A[]) => list.map(f);

export const flatMap = <A, B>(f: (a: A) => B[], list: A[]): B[] => list.map(f).reduce(concat, []);

export const forEachC = <A>(f: (a: A) => void) => (list: A[]): void => list.forEach(f);

export const tap = <A>(f: (a: A) => void) => (a: A): A => {
  f(a);
  return a;
};