
import { calculateWallPosts, WallPostsCalculation } from './calculators.ts'

function testCalculatePosts(args: [number, number, number, number?], expect: WallPostsCalculation) {
  const result = calculateWallPosts(...args)
  const actual = JSON.stringify(result)
  const expected = JSON.stringify(expect)
  console.assert(actual === expected, result)
}

function runCalculatePostsTests() {
  testCalculatePosts([3, 4, 1], {
    lengths: [4, 3, 2, 1],
    count: 4,
    interval: 1,
  })
  testCalculatePosts([3, 1, 4], {
    lengths: [1, 2, 3, 4],
    count: 4,
    interval: 1,
  })
  testCalculatePosts([2.7, 1, 4], {
    lengths: [1, 2, 3, 4],
    count: 4,
    interval: .9,
  })
  testCalculatePosts([4.25, 1, 3, 1], {
    lengths: [1, 1.4, 1.8, 2.2, 2.6, 3],
    count: 6,
    interval: .85,
  })
}

runCalculatePostsTests()
