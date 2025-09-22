#!/usr/bin/env node

/**
 * Test WASM integration directly
 */

import { tokenizer, tokenize_to_json, is_valid_jsx } from './jsx-compilation-rs/pkg/jsx_compilation_rs.js';

console.log('🧪 Testing WASM JSX Tokenizer\n');

const testCases = [
  '<div>Hello</div>',
  '<h1 id="title">World</h1>',
  '<div class="test">Content</div>',
];

for (const jsx of testCases) {
  console.log(`📝 Testing: ${jsx}`);
  
  try {
    // Test tokenizer function
    const tokens = tokenizer(jsx);
    console.log(`✅ Tokens (${tokens.length}):`, tokens);
    
    // Test JSON function
    const json = tokenize_to_json(jsx);
    console.log(`✅ JSON:`, json);
    
    // Test validation function
    const isValid = is_valid_jsx(jsx);
    console.log(`✅ Valid: ${isValid}`);
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('');
}

console.log('🎉 WASM test completed!');
