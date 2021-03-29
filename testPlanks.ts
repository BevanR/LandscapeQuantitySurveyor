
import { calculateWallPlanks, TimberLengths } from './calculators.ts'

function testCalculatePlanks(args: [number, number, number, number?], expect: TimberLengths) {
  const result = calculateWallPlanks(...args)
  const actual = JSON.stringify(result)
  const expected = JSON.stringify(expect)
  console.assert(actual === expected, result)
}

function runCalculatePlanksTests() {
  testCalculatePlanks([3, 1, .6], {
    lengths: [3, 3, 3, 3, 1.5],
    count: 5,
  })
}

runCalculatePlanksTests()
