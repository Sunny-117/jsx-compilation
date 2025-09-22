# JSX Compilation

🍻 实现 JSX 语法转成 JS 语法的编译器 / JSX to JavaScript Compiler Implementation

A comprehensive JSX tokenization project with both TypeScript and Rust implementations, featuring a live playground for testing and comparison.

## 🌟 Features

- **📝 TypeScript Implementation**: Original finite state machine tokenizer
- **🦀 Rust Implementation**: High-performance, memory-safe alternative
- **🌐 Live Playground**: Interactive web interface for testing both implementations
- **⚡ Performance Comparison**: Benchmarking tools to compare implementations
- **🔧 Multiple Integration Options**: WASM, Vite plugin, and native binary support
- **🧪 Comprehensive Testing**: Unit tests and integration tests ensuring compatibility

## 🚀 Quick Start

### Playground

Try it online: https://sunny-117.github.io/jsx-compilation

Or run locally:
```bash
cd playground
npm install
npm run dev
```

### TypeScript Usage

```javascript
import { tokenizer } from './lib/jsx-compilation.js';

const jsx = '<h1 id="title">Hello World</h1>';
const tokens = tokenizer(jsx);
console.log(tokens);
```

### Rust Usage

```rust
use jsx_compilation_rs::tokenizer;

let jsx = r#"<h1 id="title">Hello World</h1>"#;
let tokens = tokenizer(jsx).unwrap();
println!("{:?}", tokens);
```

## 📁 Project Structure

```
jsx-compilation/
├── src/                    # TypeScript implementation
│   ├── tokenizer.ts       # Main tokenizer logic
│   ├── ast.ts            # AST node definitions
│   └── ...
├── jsx-compilation-rs/    # Rust implementation
│   ├── src/
│   │   ├── tokenizer.rs  # Rust tokenizer
│   │   ├── wasm.rs       # WASM bindings
│   │   └── lib.rs        # Library interface
│   └── Cargo.toml
├── playground/            # Interactive web playground
│   ├── src/
│   │   └── App.tsx       # React playground app
│   └── vite.config.ts
├── tests/                 # Test suites
├── lib/                   # Built JavaScript library
└── vite-plugin-jsx-compilation-rs.js  # Vite plugin
```

## 🔧 Implementation Details

### Token Types

Both implementations recognize these JSX token types:

- `LeftParentheses`: `<`
- `RightParentheses`: `>`
- `JSXIdentifier`: Element names (div, span, h1)
- `AttributeKey`: Attribute names (id, class, onClick)
- `AttributeStringValue`: String values ("title")
- `AttributeExpressionValue`: Expression values ({value})
- `JSXText`: Text content between elements
- `BackSlash`: `/` for closing tags

### Finite State Machine

The tokenizer uses a finite state machine with these states:

1. **Start**: Expects `<`
2. **FoundLeftParentheses**: After `<`, expects identifier or `/`
3. **JSXIdentifier**: Collecting element name
4. **Attribute**: Looking for attribute key
5. **AttributeKey**: Collecting attribute name
6. **AttributeValue**: Expecting attribute value
7. **AttributeStringValue**: Inside string value
8. **AttributeExpressionValue**: Inside expression value
9. **TryLeaveAttribute**: After attribute value
10. **FoundRightParentheses**: After `>`, expecting text or new element
11. **JSXText**: Collecting text content

## 🎯 Integration Options

### 1. Vite Plugin (Recommended)

```javascript
// vite.config.js
import { jsxCompilationRs } from './vite-plugin-jsx-compilation-rs.js';

export default {
  plugins: [
    jsxCompilationRs({
      rustProjectPath: './jsx-compilation-rs',
      useWasm: false, // or true for WASM
    })
  ]
};
```

### 2. WASM Module

```bash
cd jsx-compilation-rs
./build-wasm.sh
```

```javascript
import init, { tokenizer } from './jsx-compilation-rs/pkg/jsx_compilation_rs.js';

await init();
const tokens = tokenizer('<div>Hello</div>');
```

### 3. Native Binary

```bash
cd jsx-compilation-rs
cargo build --release --bin compare
./target/release/compare '<div>Hello</div>'
```

## 📊 Performance

Performance characteristics vary by integration method:

| Method | Pros | Cons | Use Case |
|--------|------|------|----------|
| TypeScript | Fast in-process execution | Global state issues | Development, simple use |
| Rust Binary | Memory safe, no global state | Process overhead (~3ms) | CLI tools, isolation |
| WASM | Near-native speed, no overhead | Build complexity | Production web apps |

Run benchmarks:
```bash
node benchmark.js
```

## 🧪 Testing

### Run All Tests

```bash
# TypeScript tests
npm test

# Rust tests
cd jsx-compilation-rs
cargo test

# Integration tests
node compare-implementations.js
```

### Test Coverage

- ✅ Basic JSX elements
- ✅ Nested elements
- ✅ String attributes
- ✅ Expression attributes
- ✅ Multiple attributes
- ✅ Error cases
- ✅ Edge cases
- ✅ State isolation

## 🛠️ Development

### Prerequisites

- Node.js 16+
- Rust 1.70+
- wasm-pack (for WASM builds)

### Setup

```bash
# Install dependencies
npm install
cd playground && npm install

# Build TypeScript
npm run build

# Build Rust
cd jsx-compilation-rs
cargo build --release

# Build WASM
./build-wasm.sh
```

### Development Workflow

1. Make changes to TypeScript or Rust implementation
2. Run tests to ensure compatibility
3. Test in playground
4. Run benchmarks if performance-critical
5. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Ensure both implementations remain compatible
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Original TypeScript implementation for reference
- Rust community for excellent tooling
- React team for JSX specification

