import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

/**
 * Vite plugin for JSX Compilation Rust tokenizer
 * 
 * This plugin provides a virtual module that exposes the Rust tokenizer
 * functionality to the frontend application.
 */
export function jsxCompilationRs(options = {}) {
  const {
    rustProjectPath = './jsx-compilation-rs',
    buildOnStart = true,
    useWasm = true, // Force WASM for browser compatibility
  } = options;

  let rustBinaryPath;
  let wasmModule;

  return {
    name: 'jsx-compilation-rs',
    
    async buildStart() {
      if (buildOnStart) {
        console.log('🦀 Building Rust JSX tokenizer...');

        if (useWasm) {
          // Build WASM version
          try {
            execSync('./build-wasm.sh', {
              cwd: rustProjectPath,
              stdio: 'inherit'
            });
            console.log('✅ WASM build completed');
          } catch (error) {
            console.error('❌ WASM build failed:', error.message);
            throw error;
          }
        } else {
          // Build native binary (only for development server)
          try {
            execSync('cargo build --release --bin compare', {
              cwd: rustProjectPath,
              stdio: 'inherit'
            });
            rustBinaryPath = path.join(rustProjectPath, 'target/release/compare');
            console.log('✅ Rust binary build completed');
          } catch (error) {
            console.error('❌ Rust build failed:', error.message);
            throw error;
          }
        }
      }
    },

    resolveId(id) {
      if (id === 'jsx-compilation-rs') {
        return id;
      }
    },

    load(id) {
      if (id === 'jsx-compilation-rs') {
        if (useWasm) {
          // Return WASM module loader
          return `
import init, { tokenizer, tokenize_to_json, is_valid_jsx } from '${rustProjectPath}/pkg/jsx_compilation_rs.js';

let wasmInitialized = false;

async function ensureWasmInit() {
  if (!wasmInitialized) {
    await init();
    wasmInitialized = true;
  }
}

export async function tokenizerRust(input) {
  await ensureWasmInit();
  try {
    const tokens = tokenizer(input);
    // Convert JS Array to regular array
    const result = [];
    for (let i = 0; i < tokens.length; i++) {
      result.push(tokens[i]);
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function tokenizeToJsonRust(input) {
  await ensureWasmInit();
  return tokenize_to_json(input);
}

export async function isValidJsxRust(input) {
  await ensureWasmInit();
  return is_valid_jsx(input);
}

export async function getVersionRust() {
  await ensureWasmInit();
  return '0.1.0';
}

export { tokenizerRust as tokenizer };
`;
        } else {
          // For production builds, always use WASM to avoid Node.js dependencies
          return `
// Fallback to WASM for production builds
import init, { tokenizer, tokenize_to_json, is_valid_jsx } from '${rustProjectPath}/pkg/jsx_compilation_rs.js';

let wasmInitialized = false;

async function ensureWasmInit() {
  if (!wasmInitialized) {
    await init();
    wasmInitialized = true;
  }
}

export async function tokenizerRust(input) {
  await ensureWasmInit();
  try {
    const tokens = tokenizer(input);
    const result = [];
    for (let i = 0; i < tokens.length; i++) {
      result.push(tokens[i]);
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function tokenizeToJsonRust(input) {
  await ensureWasmInit();
  return tokenize_to_json(input);
}

export async function isValidJsxRust(input) {
  await ensureWasmInit();
  return is_valid_jsx(input);
}

export async function getVersionRust() {
  return '0.1.0';
}

export { tokenizerRust as tokenizer };
`;
        }
      }
    },

    configureServer(server) {
      // Add middleware for development
      server.middlewares.use('/api/jsx-tokenize', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { jsx } = JSON.parse(body);
              const output = execSync(`"${rustBinaryPath}" "${jsx}"`, { 
                encoding: 'utf8',
                stdio: 'pipe'
              });
              
              const lines = output.trim().split('\n');
              const countLine = lines.find(line => line.startsWith('TOKENS_COUNT:'));
              const count = parseInt(countLine.split(':')[1]);
              
              const tokens = [];
              for (const line of lines) {
                if (line.startsWith('TOKEN_')) {
                  const parts = line.split(':');
                  const type = parts[1];
                  const value = parts.slice(2).join(':');
                  tokens.push({ type, value });
                }
              }
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ tokens, count }));
            } catch (error) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: error.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}
