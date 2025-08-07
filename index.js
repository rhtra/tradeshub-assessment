const express = require('express');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Utils
function fibonacciUpTo(n, a = 0, b = 1) {
  if (n < 0) return [];

  const sequence = [a, b];
  while (true) {
    const next = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    if (next > n) break;
    sequence.push(next);
  }

  return n >= 1 ? sequence : [0];
}

function maxNonAdjacentSum(nums) {
  if (!nums || nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let include = nums[0];
  let exclude = 0;

  for (let i = 1; i < nums.length; i++) {
    const newInclude = exclude + nums[i];
    const newExclude = Math.max(include, exclude);
    include = newInclude;
    exclude = newExclude;
  }

  return Math.max(include, exclude);
}

// --- Routes ---

// GET /fibonacci?n=10
// GET /fibonacci?n=10&a=2&b=4 - optional for a and b for initial sequence
// GET /fibonacci?n=10&a=3 - optional for a and b for initial sequence
// GET /fibonacci?n=10&b=4 - optional for a and b for initial sequence
app.get('/fibonacci', (req, res) => {
  const n = parseInt(req.query.n, 10);
  const a = req.query.a !== undefined ? parseInt(req.query.a, 10) : 0;
  const b = req.query.b !== undefined ? parseInt(req.query.b, 10) : 1;

  if (isNaN(n) || isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Invalid input(s). Ensure a, b, and n are numbers.' });
  }

  const result = fibonacciUpTo(n, a, b);
  res.json({ input: { a, b, n }, sequence: result });
});


// GET /max-sum?nums=2,4,6,2,5
app.get('/max-sum', (req, res) => {
  const nums = req.query.nums?.split(',').map(Number);
  if (!nums || nums.some(isNaN)) return res.status(400).json({ error: 'Invalid nums array' });

  const result = maxNonAdjacentSum(nums);
  res.json({ input: nums, maxSum: result });
});

// Start server
app.listen(PORT, async () => {
  console.log(fibonacciUpTo(10));
  console.log(fibonacciUpTo(25, 6, 3));
  console.log(maxNonAdjacentSum([2, 4, 6, 2, 5]));
  console.log(maxNonAdjacentSum([5, 1, 1, 5])); 
  console.log(`Server running at http://localhost:${PORT}`);
});
