import { calculateWallQuantities } from './calculators.ts'

const wallMeasures = [
  0,
  4.2 + .125,
  .75,
  5.85,
  .95,
  3.5 + .125,
  .42,
]
console.log(calculateWallQuantities(wallMeasures, [1.8, 2.4], [3.6, 4.2, 6], 1.1))

