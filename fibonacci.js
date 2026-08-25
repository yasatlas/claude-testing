/**
 * Returns the nth Fibonacci number (0-indexed).
 * Uses an iterative approach for O(n) time and O(1) space.
 *
 * fibonacci(0) => 0
 * fibonacci(1) => 1
 * fibonacci(10) => 55
 */
function fibonacci(n) {
  if (n < 0) throw new RangeError("n must be a non-negative integer");
  if (n === 0) return 0;
  if (n === 1) return 1;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

module.exports = { fibonacci };
