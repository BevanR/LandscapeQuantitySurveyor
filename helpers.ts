import { TimberLengths } from './calculators.ts'

export function roundAndFilterTimberLengths(values: number[]): {
  lengths: number[]
  total: number
  count: number
} {
  const rounded = values.map(round).filter(x => x > 0)
  return {
    lengths: rounded,
    total: round(sum(rounded)),
    count: rounded.length,
  }
}

export function mergeLengths(lengths: TimberLengths[]) {
 return mergeArrays(lengths.map(p => p.lengths)).sort().reverse()
}

export function round(x: number): number {
  const precision = 100
  return Math.round(x * precision) / precision
}

export function sum(values: number[]): number {
  return values.reduce((total, x) => total + x, 0)
}

export function roundAndSumTotals(timberLengths: TimberLengths[]) {
  return round(sum(timberLengths.map(tl => tl.total)))
}

export function mergeArrays<T>(items: T[][]): T[] {
  return items.reduce(merge, [])
}

function merge<T>(a: T[], b: T[]): T[] {
  return a.concat(b)
}