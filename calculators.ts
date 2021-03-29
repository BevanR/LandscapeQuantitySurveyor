import { mergeArrays, round, roundAndFilterTimberLengths, roundAndSumTotals, sum } from './helpers.ts'

export interface TimberLengths {
  lengths: number[]
  total: number
  count: number
}

export interface WallPostsCalculation extends TimberLengths {
  interval: number
}

export function calculateWallQuantities(
  measures: number[],
  postLengths: number[],
  plankLengths: number[],
  maxPostInterval?: number,
  plankWidth?: number,
) {
  const result = calculateWalls(measures, maxPostInterval, plankWidth)
  const posts = calculateTimberQuantitiesAndWaste(result.posts, postLengths)
  const planks = calculateTimberQuantitiesAndWaste(result.planks, plankLengths)
  return { posts, planks }
}

function calculateTimberQuantitiesAndWaste(required: TimberLengths[], availableLengths: number[]) {
  const quantities = calculateTimberQuantities(required, availableLengths)
  const total = sum(Object.entries(quantities).map(([a, b]) => Number(a) * b))
  const waste = round(total - roundAndSumTotals(required))
  return { quantities, waste, total }
}

function calculateTimberQuantities(required: TimberLengths[], availableLengths: number[]): { [length: string]: number } {
  const req = mergeArrays(required.map(p => p.lengths)).sort().reverse()
  const available = availableLengths.sort()
  const largest = available[available.length - 1]

  if (req[0] > largest) {
    throw new Error('Nothing is available for longest required length')
  }

  const result: { [length: number]: number } = {}
  for (const length of available) {
    result[length] = 0
  }

  while (req.length) {
    const item = req.shift() as number
    const lengths = [item, ...findComplements(req, largest - item)]
    const used = round(sum(lengths))
    const timberLength = available.find(item => item >= used) as number
    const offcut = round(timberLength - used)
    console.log({ timberLength, used, offcut, lengths })
    result[timberLength]++
  }

  return result
}

function findComplements(req: number[], max: number): number[] {
  const result = []

  while (true) {
    const complement = findComplement(req, max - sum(result))
    if (complement > 0) {
      result.push(complement)
    } else {
      return result
    }
  }
}

function findComplement(req: number[], max: number): number {
  const index = req.findIndex(item => item <= max)
  if (index >= 0) {
    const result = req[index]
    req.splice(index, 1)
    return result
  } else {
    return 0
  }
}

export function calculateWalls(measures: number[], maxPostInterval?: number, plankWidth?: number) {
  if (measures.length % 2 === 0) {
    throw new Error('An odd number of inputs are required.')
  }

  const posts = []
  const planks = []

  for (let index = 1; index < measures.length; index += 2) {
    const length = measures[index]
    const a = measures[index - 1]
    const b = measures[index + 1]
    posts.push(calculateWallPosts(length, a, b, maxPostInterval))
    planks.push(calculateWallPlanks(length, a, b, plankWidth))
  }

  return {
    posts, planks,
    totalPlanks: roundAndSumTotals(planks),
    totalPosts: roundAndSumTotals(posts),
  }
}

export function calculateWallPlanks(length: number, a: number, b: number, width: number = .2): TimberLengths {
  const result: number[] = []

  const max = Math.max(a, b)
  const min = Math.min(a, b)
  const delta = max - min
  const count = Math.ceil(max / width)

  for (let index = 0; index < count; index++) {
    const extra = Math.max(0, index * width - min)
    result.push(length - length * extra / delta)
  }

  return roundAndFilterTimberLengths(result)
}

export function calculateWallPosts(length: number, a: number, b: number, max: number = 1): WallPostsCalculation {
  const count = Math.ceil(length / max)
  const rise = (b - a) / count
  const heights = []
  for (let index = 0; index <= count; index++) {
    heights.push(2 * (a + index * rise))
  }
  return {
    ...roundAndFilterTimberLengths(heights),
    interval: round(length / count),
  }
}