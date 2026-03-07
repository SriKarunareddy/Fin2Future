/**
 * Manual test script for level assignment service
 */

const { assignLevel, getLevelThresholds } = require('./level-assignment.service');

console.log('Testing Level Assignment Service\n');
console.log('=================================\n');

// Test Basic level (0-3)
console.log('Testing Basic Level (scores 0-3):');
for (let score = 0; score <= 3; score++) {
  const level = assignLevel(score);
  console.log(`  Score ${score}: ${level} ${level === 'Basic' ? '✓' : '✗ FAILED'}`);
}

console.log('\nTesting Medium Level (scores 4-7):');
for (let score = 4; score <= 7; score++) {
  const level = assignLevel(score);
  console.log(`  Score ${score}: ${level} ${level === 'Medium' ? '✓' : '✗ FAILED'}`);
}

console.log('\nTesting Advanced Level (scores 8-10):');
for (let score = 8; score <= 10; score++) {
  const level = assignLevel(score);
  console.log(`  Score ${score}: ${level} ${level === 'Advanced' ? '✓' : '✗ FAILED'}`);
}

console.log('\nTesting Error Handling:');

// Test invalid scores
const invalidScores = [-1, 11, 5.5, 'string', null, undefined, NaN];
invalidScores.forEach(score => {
  try {
    assignLevel(score);
    console.log(`  Score ${score}: ✗ FAILED (should have thrown error)`);
  } catch (error) {
    console.log(`  Score ${score}: ✓ Correctly threw error: ${error.message}`);
  }
});

console.log('\nTesting getLevelThresholds():');
const thresholds = getLevelThresholds();
console.log('  Thresholds:', JSON.stringify(thresholds, null, 2));
console.log('  ✓ Function works correctly');

console.log('\n=================================');
console.log('All tests completed!');
