// Simple test to verify WASM module works
console.log('Testing WASM module...');

try {
  // This should work in the browser environment
  import('../../jsx-compilation-rs/pkg/jsx_compilation_rs.js')
    .then(module => {
      console.log('WASM module loaded successfully:', module);
      
      const jsx = '<div>Hello</div>';
      const tokens = module.tokenizer(jsx);
      console.log('Tokenization result:', tokens);
      
      // Add result to page
      const result = document.createElement('div');
      result.innerHTML = `
        <h3>WASM Test Result</h3>
        <p><strong>Input:</strong> ${jsx}</p>
        <p><strong>Tokens:</strong> ${JSON.stringify(tokens, null, 2)}</p>
      `;
      document.body.appendChild(result);
    })
    .catch(error => {
      console.error('Failed to load WASM module:', error);
      
      const result = document.createElement('div');
      result.innerHTML = `
        <h3>WASM Test Failed</h3>
        <p><strong>Error:</strong> ${error.message}</p>
      `;
      document.body.appendChild(result);
    });
} catch (error) {
  console.error('Error in test:', error);
}
