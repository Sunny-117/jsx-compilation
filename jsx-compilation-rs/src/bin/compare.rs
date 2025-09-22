use jsx_compilation_rs::{tokenizer, tokenize_to_json};
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    
    if args.len() != 2 {
        eprintln!("Usage: {} <jsx_string>", args[0]);
        std::process::exit(1);
    }
    
    let jsx = &args[1];
    
    match tokenizer(jsx) {
        Ok(tokens) => {
            // Print in a format that's easy to compare
            println!("TOKENS_COUNT:{}", tokens.len());
            for (i, token) in tokens.iter().enumerate() {
                println!("TOKEN_{}:{}:{}", i, token.token_type, token.value);
            }
        }
        Err(e) => {
            println!("ERROR:{}", e);
            std::process::exit(1);
        }
    }
}
