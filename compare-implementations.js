import { execSync } from 'child_process';

// Test cases from the playground
const testCases = [
    '<h1 id="title" name="name"><span>hello</span>world</h1>',
    '<div>content</div>',
    '<span>text</span>',
    '<h1>hello</h1>',
    '<div class="container">content</div>',
    '<div><p>nested</p></div>',
];

console.log('🔍 Comparing TypeScript and Rust JSX Tokenizer Implementations\n');

// Build the Rust comparison binary
try {
    console.log('Building Rust comparison tool...');
    execSync('cd jsx-compilation-rs && cargo build --bin compare', { stdio: 'pipe' });
    console.log('✅ Rust binary built successfully\n');
} catch (error) {
    console.error('❌ Failed to build Rust binary:', error.message);
    process.exit(1);
}

let allTestsPassed = true;

for (let i = 0; i < testCases.length; i++) {
    const jsx = testCases[i];
    console.log(`Test ${i + 1}: ${jsx}`);

    // Get TypeScript result
    let tsResult;
    try {
        // Import fresh to avoid global state issues
        const { tokenizer } = await import(`./lib/jsx-compilation.js?t=${Date.now()}`);
        const tokens = tokenizer(jsx);
        tsResult = {
            success: true,
            count: tokens.length,
            tokens: tokens
        };
        console.log(`  ✅ TypeScript: ${tokens.length} tokens`);
    } catch (error) {
        tsResult = {
            success: false,
            error: error.message
        };
        console.log(`  ❌ TypeScript: Error - ${error.message}`);
    }

    // Get Rust result
    let rustResult;
    try {
        const output = execSync(`cd jsx-compilation-rs && ./target/debug/compare "${jsx}"`,
                               { encoding: 'utf8', stdio: 'pipe' });

        const lines = output.trim().split('\n');
        const countLine = lines.find(line => line.startsWith('TOKENS_COUNT:'));
        const count = parseInt(countLine.split(':')[1]);

        const tokens = [];
        for (const line of lines) {
            if (line.startsWith('TOKEN_')) {
                const parts = line.split(':');
                const index = parseInt(parts[0].replace('TOKEN_', ''));
                const type = parts[1];
                const value = parts.slice(2).join(':'); // Handle values with colons
                tokens.push({ type, value });
            }
        }

        rustResult = {
            success: true,
            count: count,
            tokens: tokens
        };
        console.log(`  ✅ Rust: ${count} tokens`);

    } catch (error) {
        rustResult = {
            success: false,
            error: error.message
        };
        console.log(`  ❌ Rust: Error - ${error.message}`);
    }

    // Compare results
    if (tsResult.success && rustResult.success) {
        if (tsResult.count === rustResult.count) {
            let tokensMatch = true;
            for (let j = 0; j < tsResult.count; j++) {
                if (tsResult.tokens[j].type !== rustResult.tokens[j].type ||
                    tsResult.tokens[j].value !== rustResult.tokens[j].value) {
                    tokensMatch = false;
                    console.log(`    ❌ Token ${j} mismatch:`);
                    console.log(`      TS: ${tsResult.tokens[j].type} = "${tsResult.tokens[j].value}"`);
                    console.log(`      RS: ${rustResult.tokens[j].type} = "${rustResult.tokens[j].value}"`);
                    break;
                }
            }
            if (tokensMatch) {
                console.log(`  ✅ Results match perfectly!`);
            } else {
                allTestsPassed = false;
            }
        } else {
            console.log(`  ❌ Token count mismatch: TS=${tsResult.count}, Rust=${rustResult.count}`);
            allTestsPassed = false;
        }
    } else if (!tsResult.success && !rustResult.success) {
        console.log(`  ✅ Both implementations failed as expected`);
    } else {
        console.log(`  ❌ One implementation succeeded while the other failed`);
        allTestsPassed = false;
    }

    console.log('');
}

console.log(allTestsPassed ?
    '🎉 All tests passed! Rust implementation is compatible with TypeScript.' :
    '❌ Some tests failed. There are compatibility issues.');
