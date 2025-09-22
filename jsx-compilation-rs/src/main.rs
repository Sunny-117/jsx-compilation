use jsx_compilation_rs::{tokenizer, tokenize_to_json, is_valid_jsx};

fn main() {
    // Example usage
    let jsx_input = r#"<h1 id="title" name="name"><span>hello</span>world</h1>"#;

    println!("Input JSX: {}", jsx_input);
    println!("Is valid: {}", is_valid_jsx(jsx_input));

    match tokenizer(jsx_input) {
        Ok(tokens) => {
            println!("\nTokenized successfully ({} tokens):", tokens.len());
            for (i, token) in tokens.iter().enumerate() {
                println!("  {}: {} = \"{}\"", i, token.token_type, token.value);
            }
        }
        Err(e) => {
            eprintln!("Tokenization error: {}", e);
        }
    }

    // Test JSON output
    println!("\nJSON output:");
    match tokenize_to_json(jsx_input) {
        Ok(json) => println!("{}", json),
        Err(e) => eprintln!("JSON error: {}", e),
    }

    // Test error case
    println!("\nTesting invalid JSX:");
    let invalid_jsx = "invalid";
    println!("Input: {}", invalid_jsx);
    println!("Is valid: {}", is_valid_jsx(invalid_jsx));
}
