use wasm_bindgen::prelude::*;
use crate::tokenizer::{tokenizer as rust_tokenizer, Token, TokenType, TokenizerError};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Export Token and TokenType for JavaScript
#[wasm_bindgen]
#[derive(Clone)]
pub struct WasmToken {
    token_type: String,
    value: String,
}

#[wasm_bindgen]
impl WasmToken {
    #[wasm_bindgen(getter)]
    pub fn token_type(&self) -> String {
        self.token_type.clone()
    }

    #[wasm_bindgen(getter, js_name = "type")]
    pub fn type_field(&self) -> String {
        self.token_type.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn value(&self) -> String {
        self.value.clone()
    }
}

impl From<Token> for WasmToken {
    fn from(token: Token) -> Self {
        WasmToken {
            token_type: token.token_type.to_string(),
            value: token.value,
        }
    }
}

/// Tokenize JSX input and return tokens as JavaScript objects
#[wasm_bindgen]
pub fn tokenizer(input: &str) -> Result<js_sys::Array, JsValue> {
    // Set panic hook for better error messages
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();

    match rust_tokenizer(input) {
        Ok(tokens) => {
            let js_array = js_sys::Array::new();
            for token in tokens {
                let js_object = js_sys::Object::new();
                js_sys::Reflect::set(
                    &js_object,
                    &JsValue::from_str("type"),
                    &JsValue::from_str(&token.token_type.to_string()),
                )?;
                js_sys::Reflect::set(
                    &js_object,
                    &JsValue::from_str("value"),
                    &JsValue::from_str(&token.value),
                )?;
                js_array.push(&js_object);
            }
            Ok(js_array)
        }
        Err(e) => Err(JsValue::from_str(&e.to_string())),
    }
}

/// Tokenize JSX input and return JSON string
#[wasm_bindgen]
pub fn tokenize_to_json(input: &str) -> Result<String, JsValue> {
    match rust_tokenizer(input) {
        Ok(tokens) => {
            match serde_json::to_string(&tokens) {
                Ok(json) => Ok(json),
                Err(e) => Err(JsValue::from_str(&e.to_string())),
            }
        }
        Err(e) => Err(JsValue::from_str(&e.to_string())),
    }
}

/// Check if JSX syntax is valid
#[wasm_bindgen]
pub fn is_valid_jsx(input: &str) -> bool {
    rust_tokenizer(input).is_ok()
}

/// Get version information
#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn main() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}
