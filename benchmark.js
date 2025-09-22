import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

// Test cases of varying complexity
const testCases = [
  {
    name: 'Simple Element',
    jsx: '<div>Hello</div>',
  },
  {
    name: 'Element with Attributes',
    jsx: '<div class="container" id="main">Content</div>',
  },
  {
    name: 'Nested Elements',
    jsx: '<div><p><span>Nested</span> content</p></div>',
  },
  {
    name: 'Complex JSX',
    jsx: '<h1 id="title" name="name"><span>hello</span>world</h1>',
  },
  {
    name: 'Multiple Attributes',
    jsx: '<div class="test" id="main" data-value="123" onClick={handleClick}>content</div>',
  },
  {
    name: 'Large JSX',
    jsx: `
      <div class="app">
        <header class="header">
          <h1 id="title">My App</h1>
          <nav class="nav">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </header>
        <main class="main">
          <section class="hero">
            <h2>Welcome</h2>
            <p>This is a test paragraph with <strong>bold</strong> text.</p>
          </section>
          <section class="content">
            <article class="post">
              <h3>Post Title</h3>
              <p>Post content goes here...</p>
            </article>
          </section>
        </main>
        <footer class="footer">
          <p>Copyright 2024</p>
        </footer>
      </div>
    `.replace(/\s+/g, ' ').trim(),
  },
];

console.log('🚀 JSX Tokenizer Performance Benchmark\n');

// Build Rust binary if needed
try {
  console.log('🔧 Ensuring Rust binary is built...');
  execSync('cd jsx-compilation-rs && cargo build --release --bin compare', { stdio: 'pipe' });
  console.log('✅ Rust binary ready\n');
} catch (error) {
  console.error('❌ Failed to build Rust binary:', error.message);
  process.exit(1);
}

const rustBinaryPath = './jsx-compilation-rs/target/release/compare';

// Benchmark function for TypeScript
async function benchmarkTypeScript(jsx, iterations = 1000) {
  // Import fresh to avoid global state issues
  const { tokenizer } = await import(`./lib/jsx-compilation.js?t=${Date.now()}`);

  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    try {
      tokenizer(jsx);
    } catch (error) {
      // Handle errors but continue benchmarking
    }
  }

  const end = performance.now();
  return end - start;
}

// Benchmark function for Rust
function benchmarkRust(jsx, iterations = 1000) {
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    try {
      execSync(`"${rustBinaryPath}" "${jsx}"`, { stdio: 'pipe' });
    } catch (error) {
      // Handle errors but continue benchmarking
    }
  }
  
  const end = performance.now();
  return end - start;
}

// Run benchmarks
async function runBenchmarks() {
const results = [];

for (const testCase of testCases) {
  console.log(`📊 Benchmarking: ${testCase.name}`);
  console.log(`   Input: ${testCase.jsx.substring(0, 50)}${testCase.jsx.length > 50 ? '...' : ''}`);
  
  const iterations = testCase.jsx.length > 200 ? 100 : 1000; // Fewer iterations for large inputs
  
  // Warm up
  try {
    await benchmarkTypeScript(testCase.jsx, 10);
    benchmarkRust(testCase.jsx, 10);
  } catch (error) {
    console.log(`   ⚠️  Warm-up failed: ${error.message}`);
  }

  // TypeScript benchmark
  let tsTime = 0;
  let tsError = null;
  try {
    tsTime = await benchmarkTypeScript(testCase.jsx, iterations);
  } catch (error) {
    tsError = error.message;
  }
  
  // Rust benchmark
  let rustTime = 0;
  let rustError = null;
  try {
    rustTime = benchmarkRust(testCase.jsx, iterations);
  } catch (error) {
    rustError = error.message;
  }
  
  const result = {
    name: testCase.name,
    jsx: testCase.jsx,
    iterations,
    typescript: {
      time: tsTime,
      avgTime: tsTime / iterations,
      error: tsError,
    },
    rust: {
      time: rustTime,
      avgTime: rustTime / iterations,
      error: rustError,
    },
  };
  
  if (!tsError && !rustError) {
    result.speedup = tsTime / rustTime;
  }
  
  results.push(result);
  
  // Display results
  if (tsError) {
    console.log(`   ❌ TypeScript: Error - ${tsError}`);
  } else {
    console.log(`   📈 TypeScript: ${tsTime.toFixed(2)}ms total, ${(tsTime / iterations).toFixed(4)}ms avg`);
  }
  
  if (rustError) {
    console.log(`   ❌ Rust: Error - ${rustError}`);
  } else {
    console.log(`   🦀 Rust: ${rustTime.toFixed(2)}ms total, ${(rustTime / iterations).toFixed(4)}ms avg`);
  }
  
  if (result.speedup) {
    const speedupText = result.speedup > 1 ? 
      `${result.speedup.toFixed(2)}x faster` : 
      `${(1/result.speedup).toFixed(2)}x slower`;
    console.log(`   ⚡ Rust is ${speedupText} than TypeScript`);
  }
  
  console.log('');
}

// Summary
console.log('📋 BENCHMARK SUMMARY\n');
console.log('┌─────────────────────────┬──────────────┬──────────────┬─────────────┐');
console.log('│ Test Case               │ TypeScript   │ Rust         │ Speedup     │');
console.log('├─────────────────────────┼──────────────┼──────────────┼─────────────┤');

for (const result of results) {
  const name = result.name.padEnd(23);
  const tsAvg = result.typescript.error ? 'ERROR'.padEnd(12) : `${result.typescript.avgTime.toFixed(4)}ms`.padEnd(12);
  const rustAvg = result.rust.error ? 'ERROR'.padEnd(12) : `${result.rust.avgTime.toFixed(4)}ms`.padEnd(12);
  const speedup = result.speedup ? 
    (result.speedup > 1 ? `${result.speedup.toFixed(2)}x` : `0.${(1/result.speedup).toFixed(2)}x`).padEnd(11) :
    'N/A'.padEnd(11);
  
  console.log(`│ ${name} │ ${tsAvg} │ ${rustAvg} │ ${speedup} │`);
}

console.log('└─────────────────────────┴──────────────┴──────────────┴─────────────┘');

// Calculate overall performance
const validResults = results.filter(r => r.speedup);
if (validResults.length > 0) {
  const avgSpeedup = validResults.reduce((sum, r) => sum + r.speedup, 0) / validResults.length;
  console.log(`\n🎯 Overall: Rust is ${avgSpeedup.toFixed(2)}x faster on average`);
}

console.log('\n✅ Benchmark completed!');
}

// Run the benchmarks
runBenchmarks().catch(console.error);
