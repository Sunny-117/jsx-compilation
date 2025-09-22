# JSX Compilation Rust

🦀 A high-performance Rust implementation of JSX tokenization, compatible with the TypeScript reference implementation.

## Features

- **🚀 Fast & Safe**: Written in Rust for memory safety and performance
- **🔄 Compatible**: Produces identical token output to the TypeScript version
- **📦 Multiple Targets**: Supports native binary, WASM, and library usage
- **🛠️ Comprehensive**: Handles JSX elements, attributes, text content, and expressions
- **⚡ Error Handling**: Proper error reporting for invalid JSX syntax
- **🧪 Well Tested**: Extensive unit tests ensuring correctness

## Quick Start

### As a Rust Library

Add to your `Cargo.toml`:

```toml
[dependencies]
jsx-compilation-rs = "0.1.0"
```

```rust
use jsx_compilation_rs::tokenizer;

fn main() {
    let jsx = r#"<h1 id="title">Hello World</h1>"#;
    let tokens = tokenizer(jsx).unwrap();
    
    for token in tokens {
        println!("{:?}: {}", token.token_type, token.value);
    }
}
```

### As a Command Line Tool

```bash
# Build the binary
cargo build --release --bin compare

# Use it
./target/release/compare '<div>Hello</div>'
```

### As WASM Module

```bash
# Build WASM package
./build-wasm.sh

# Use in JavaScript
import init, { tokenizer } from './pkg/jsx_compilation_rs.js';

await init();
const tokens = tokenizer('<div>Hello</div>');
console.log(tokens);
```

## Token Types

The tokenizer recognizes these token types:

| Token Type | Description | Example |
|------------|-------------|---------|
| `LeftParentheses` | Opening angle bracket | `<` |
| `RightParentheses` | Closing angle bracket | `>` |
| `JSXIdentifier` | Element names | `div`, `span`, `h1` |
| `AttributeKey` | Attribute names | `id`, `class`, `onClick` |
| `AttributeStringValue` | String attribute values | `"title"` |
| `AttributeExpressionValue` | Expression attribute values | `{value}` |
| `JSXText` | Text content between elements | `Hello World` |
| `BackSlash` | Forward slash for closing tags | `/` |

## API Reference

### `tokenizer(input: &str) -> Result<Vec<Token>, TokenizerError>`

Tokenizes JSX input and returns a vector of tokens.

**Parameters:**
- `input`: JSX string to tokenize

**Returns:**
- `Ok(Vec<Token>)`: Successfully parsed tokens
- `Err(TokenizerError)`: Parse error with details

**Example:**
```rust
let tokens = tokenizer("<div>Hello</div>")?;
assert_eq!(tokens.len(), 8);
```

### `tokenize_to_json(input: &str) -> Result<String, Box<dyn std::error::Error>>`

Convenience function that returns JSON string of tokens.

**Example:**
```rust
let json = tokenize_to_json("<div>Hello</div>")?;
println!("{}", json);
```

### `is_valid_jsx(input: &str) -> bool`

Checks if JSX syntax is valid without returning tokens.

**Example:**
```rust
assert!(is_valid_jsx("<div>Hello</div>"));
assert!(!is_valid_jsx("invalid"));
```

## Integration with Vite

Use the provided Vite plugin for seamless integration:

```javascript
// vite.config.js
import { jsxCompilationRs } from './vite-plugin-jsx-compilation-rs.js';

export default {
  plugins: [
    jsxCompilationRs({
      rustProjectPath: './jsx-compilation-rs',
      buildOnStart: true,
      useWasm: false, // Set to true for WASM
    })
  ]
};
```

Then in your code:
```javascript
import { tokenizer } from 'jsx-compilation-rs';

const tokens = await tokenizer('<div>Hello</div>');
```

## Performance

### Native Binary vs TypeScript

The native binary approach has process overhead but provides:
- ✅ Memory safety
- ✅ No global state issues
- ✅ Consistent performance
- ❌ Process startup overhead (~3ms per call)

### WASM vs TypeScript

WASM provides the best of both worlds:
- ✅ Near-native performance
- ✅ No process overhead
- ✅ Memory safety
- ✅ Runs in the same process

## Building

### Prerequisites

- Rust 1.70+ 
- `wasm-pack` (for WASM builds)

### Build Commands

```bash
# Build library and binaries
cargo build --release

# Build WASM package
./build-wasm.sh

# Run tests
cargo test

# Run benchmarks
node benchmark.js
```

## Testing

The project includes comprehensive tests:

```bash
# Run Rust tests
cargo test

# Run integration tests with TypeScript
node compare-implementations.js
```

## Error Handling

The tokenizer provides detailed error information:

```rust
match tokenizer("invalid jsx") {
    Ok(tokens) => println!("Success: {} tokens", tokens.len()),
    Err(e) => match e {
        TokenizerError::InvalidFirstCharacter => {
            println!("Must start with '<'");
        }
        TokenizerError::UnexpectedCharacter(ch) => {
            println!("Unexpected character: {}", ch);
        }
        TokenizerError::UnexpectedEndOfInput => {
            println!("Incomplete JSX");
        }
    }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Compatibility

This implementation is designed to be 100% compatible with the TypeScript reference implementation, producing identical token streams for valid JSX input.
