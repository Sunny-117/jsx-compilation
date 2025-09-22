//! # JSX Compilation Library in Rust
//!
//! This library provides JSX tokenization functionality, converting JSX syntax
//! into a stream of tokens that can be further processed for compilation.
//!
//! ## Features
//!
//! - **Fast and Safe**: Written in Rust for memory safety and performance
//! - **Compatible**: Produces the same token output as the TypeScript reference implementation
//! - **Comprehensive**: Handles JSX elements, attributes, text content, and expressions
//! - **Error Handling**: Proper error reporting for invalid JSX syntax
//!
//! ## Quick Start
//!
//! ```rust
//! use jsx_compilation_rs::{tokenizer, TokenType};
//!
//! let jsx = r#"<h1 id="title">Hello World</h1>"#;
//! let tokens = tokenizer(jsx).unwrap();
//!
//! // Print all tokens
//! for token in &tokens {
//!     println!("{:?}: {}", token.token_type, token.value);
//! }
//!
//! // Check specific tokens
//! assert_eq!(tokens[0].token_type, TokenType::LeftParentheses);
//! assert_eq!(tokens[1].token_type, TokenType::JSXIdentifier);
//! assert_eq!(tokens[1].value, "h1");
//! ```
//!
//! ## Token Types
//!
//! The tokenizer recognizes the following token types:
//!
//! - `LeftParentheses`: `<`
//! - `RightParentheses`: `>`
//! - `JSXIdentifier`: Element names like `div`, `span`, `h1`
//! - `AttributeKey`: Attribute names like `id`, `class`, `onClick`
//! - `AttributeStringValue`: String attribute values like `"title"`
//! - `AttributeExpressionValue`: Expression attribute values like `{value}`
//! - `JSXText`: Text content between elements
//! - `BackSlash`: `/` for closing tags
//!
//! ## Error Handling
//!
//! The tokenizer returns a `Result<Vec<Token>, TokenizerError>`. Common errors include:
//!
//! - `InvalidFirstCharacter`: Input doesn't start with `<`
//! - `UnexpectedCharacter`: Invalid character in the current context
//! - `UnexpectedEndOfInput`: Incomplete JSX structure

pub mod tokenizer;

#[cfg(target_arch = "wasm32")]
pub mod wasm;

#[cfg(test)]
mod tests;

pub use tokenizer::{tokenizer, Token, TokenType, TokenizerError};

/// Convenience function to tokenize JSX and return JSON string
///
/// This function tokenizes the input JSX and serializes the result to JSON,
/// making it easy to interop with other languages or systems.
///
/// # Example
///
/// ```rust
/// use jsx_compilation_rs::tokenize_to_json;
///
/// let jsx = r#"<div>Hello</div>"#;
/// let json = tokenize_to_json(jsx).unwrap();
/// println!("{}", json);
/// ```
pub fn tokenize_to_json(input: &str) -> Result<String, Box<dyn std::error::Error>> {
    let tokens = tokenizer(input)?;
    let json = serde_json::to_string_pretty(&tokens)?;
    Ok(json)
}

/// Convenience function to check if JSX syntax is valid
///
/// Returns `true` if the JSX can be tokenized without errors, `false` otherwise.
///
/// # Example
///
/// ```rust
/// use jsx_compilation_rs::is_valid_jsx;
///
/// assert!(is_valid_jsx(r#"<div>Hello</div>"#));
/// assert!(!is_valid_jsx(r#"invalid"#)); // Doesn't start with <
/// ```
pub fn is_valid_jsx(input: &str) -> bool {
    tokenizer(input).is_ok()
}
