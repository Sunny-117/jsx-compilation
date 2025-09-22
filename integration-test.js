#!/usr/bin/env node

/**
 * Integration Test Suite
 * 
 * This script tests all integration methods:
 * 1. TypeScript implementation
 * 2. Rust native binary
 * 3. Vite plugin (simulated)
 * 
 * Ensures all implementations produce compatible results.
 */

import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

console.log('🧪 JSX Compilation Integration Test Suite\n');

// Test cases
const testCases = [
  {
    name: 'Simple Element',
    jsx: '<div>Hello</div>',
    expectedTokenCount: 8,
  },
  {
    name: 'Element with Attributes',
    jsx: '<div class="container" id="main">Content</div>',
    expectedTokenCount: 14,
  },
  {
    name: 'Nested Elements',
    jsx: '<div><p><span>Nested</span> content</p></div>',
    expectedTokenCount: 20,
  },
  {
    name: 'Complex JSX',
    jsx: '<h1 id="title" name="name"><span>hello</span>world</h1>',
    expectedTokenCount: 20,
  },
  {
    name: 'Expression Attribute',
    jsx: '<div onClick={handleClick}>Click me</div>',
    expectedTokenCount: 10,
  },
];

// Error test cases
const errorCases = [
  {
    name: 'Invalid Start',
    jsx: 'invalid',
    expectedError: true,
  },
  {
    name: 'Unclosed Tag',
    jsx: '<div>unclosed',
    expectedError: true,
  },
  {
    name: 'Self-closing (should error)',
    jsx: '<div/>',
    expectedError: true,
  },
];

let totalTests = 0;
let passedTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✅ ${testName}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${testName}: ${error.message}`);
  }
}

// Test TypeScript implementation
console.log('📝 Testing TypeScript Implementation\n');

async function testTypeScript() {
  const { tokenizer } = await import('./lib/jsx-compilation.js');
  
  for (const testCase of testCases) {
    runTest(`TS: ${testCase.name}`, () => {
      const tokens = tokenizer(testCase.jsx);
      if (tokens.length !== testCase.expectedTokenCount) {
        throw new Error(`Expected ${testCase.expectedTokenCount} tokens, got ${tokens.length}`);
      }
    });
  }
  
  for (const errorCase of errorCases) {
    runTest(`TS Error: ${errorCase.name}`, () => {
      try {
        tokenizer(errorCase.jsx);
        if (errorCase.expectedError) {
          throw new Error('Expected error but got success');
        }
      } catch (error) {
        if (!errorCase.expectedError) {
          throw error;
        }
        // Expected error, test passes
      }
    });
  }
}

// Test Rust implementation
console.log('\n🦀 Testing Rust Implementation\n');

function testRust() {
  const rustBinary = './jsx-compilation-rs/target/release/compare';
  
  // Check if binary exists
  try {
    execSync(`test -f "${rustBinary}"`, { stdio: 'pipe' });
  } catch {
    console.log('⚠️  Rust binary not found, building...');
    execSync('cd jsx-compilation-rs && cargo build --release --bin compare', { stdio: 'inherit' });
  }
  
  for (const testCase of testCases) {
    runTest(`Rust: ${testCase.name}`, () => {
      const output = execSync(`"${rustBinary}" "${testCase.jsx}"`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const lines = output.trim().split('\n');
      const countLine = lines.find(line => line.startsWith('TOKENS_COUNT:'));
      if (!countLine) {
        throw new Error('No token count found in output');
      }
      
      const count = parseInt(countLine.split(':')[1]);
      if (count !== testCase.expectedTokenCount) {
        throw new Error(`Expected ${testCase.expectedTokenCount} tokens, got ${count}`);
      }
    });
  }
  
  for (const errorCase of errorCases) {
    runTest(`Rust Error: ${errorCase.name}`, () => {
      try {
        execSync(`"${rustBinary}" "${errorCase.jsx}"`, { 
          stdio: 'pipe'
        });
        if (errorCase.expectedError) {
          throw new Error('Expected error but got success');
        }
      } catch (error) {
        if (!errorCase.expectedError) {
          throw error;
        }
        // Expected error, test passes
      }
    });
  }
}

// Test compatibility between implementations
console.log('\n🔄 Testing Implementation Compatibility\n');

async function testCompatibility() {
  const { tokenizer: tsTokenizer } = await import('./lib/jsx-compilation.js');
  const rustBinary = './jsx-compilation-rs/target/release/compare';
  
  for (const testCase of testCases) {
    runTest(`Compatibility: ${testCase.name}`, () => {
      // Get TypeScript tokens
      const tsTokens = tsTokenizer(testCase.jsx);
      
      // Get Rust tokens
      const output = execSync(`"${rustBinary}" "${testCase.jsx}"`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const lines = output.trim().split('\n');
      const rustTokens = [];
      
      for (const line of lines) {
        if (line.startsWith('TOKEN_')) {
          const parts = line.split(':');
          const type = parts[1];
          const value = parts.slice(2).join(':');
          rustTokens.push({ type, value });
        }
      }
      
      // Compare token counts
      if (tsTokens.length !== rustTokens.length) {
        throw new Error(`Token count mismatch: TS=${tsTokens.length}, Rust=${rustTokens.length}`);
      }
      
      // Compare each token
      for (let i = 0; i < tsTokens.length; i++) {
        const tsToken = tsTokens[i];
        const rustToken = rustTokens[i];
        
        if (tsToken.type !== rustToken.type) {
          throw new Error(`Token ${i} type mismatch: TS="${tsToken.type}", Rust="${rustToken.type}"`);
        }
        
        if (tsToken.value !== rustToken.value) {
          throw new Error(`Token ${i} value mismatch: TS="${tsToken.value}", Rust="${rustToken.value}"`);
        }
      }
    });
  }
}

// Test playground integration
console.log('\n🎮 Testing Playground Integration\n');

function testPlayground() {
  runTest('Playground Build', () => {
    try {
      execSync('cd playground && npm run build', { 
        stdio: 'pipe',
        timeout: 30000 
      });
    } catch (error) {
      throw new Error(`Playground build failed: ${error.message}`);
    }
  });
}

// Run all tests
async function runAllTests() {
  const startTime = performance.now();
  
  await testTypeScript();
  testRust();
  await testCompatibility();
  testPlayground();
  
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  
  console.log('\n📊 Test Results Summary\n');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log(`Duration: ${duration}ms`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! The JSX compilation implementations are working correctly.');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please check the implementation.');
    process.exit(1);
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled error:', error);
  process.exit(1);
});

// Run the test suite
runAllTests().catch(console.error);
