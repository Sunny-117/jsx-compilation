#[cfg(test)]
mod tests {
    use crate::tokenizer::{tokenizer, Token, TokenType};

    #[test]
    fn test_full_call_expression_with_string_attributes() {
        let source_code = r#"<h1 id="title" name="name"><span>hello</span>world</h1>"#;
        let result = tokenizer(source_code).unwrap();
        
        let expected = vec![
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "h1".to_string()),
            Token::new(TokenType::AttributeKey, "id".to_string()),
            Token::new(TokenType::AttributeStringValue, "title".to_string()),
            Token::new(TokenType::AttributeKey, "name".to_string()),
            Token::new(TokenType::AttributeStringValue, "name".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "span".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "hello".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "span".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "world".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "h1".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
        ];

        assert_eq!(result, expected);
    }

    #[test]
    fn test_full_call_expression_with_expression_attribute() {
        let source_code = r#"<h1 id="title" name={name}><span>hello</span>world</h1>"#;
        let result = tokenizer(source_code).unwrap();
        
        let expected = vec![
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "h1".to_string()),
            Token::new(TokenType::AttributeKey, "id".to_string()),
            Token::new(TokenType::AttributeStringValue, "title".to_string()),
            Token::new(TokenType::AttributeKey, "name".to_string()),
            Token::new(TokenType::AttributeExpressionValue, "name".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "span".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "hello".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "span".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "world".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "h1".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
        ];

        assert_eq!(result, expected);
    }

    #[test]
    fn test_simple_element_no_attributes() {
        let source_code = "<div>content</div>";
        let result = tokenizer(source_code).unwrap();
        
        let expected = vec![
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "content".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
        ];

        assert_eq!(result, expected);
    }

    #[test]
    fn test_self_closing_element_should_error() {
        // The TypeScript implementation doesn't support self-closing tags
        // and throws an error, so our Rust implementation should do the same
        let source_code = "<img/>";
        let result = tokenizer(source_code);
        assert!(result.is_err());
    }

    #[test]
    fn test_element_with_single_attribute() {
        let source_code = r#"<div class="container">content</div>"#;
        let result = tokenizer(source_code).unwrap();
        
        let expected = vec![
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::AttributeKey, "class".to_string()),
            Token::new(TokenType::AttributeStringValue, "container".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "content".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
        ];

        assert_eq!(result, expected);
    }

    #[test]
    fn test_nested_elements() {
        let source_code = "<div><p>text</p></div>";
        let result = tokenizer(source_code).unwrap();
        
        let expected = vec![
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "p".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "text".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "p".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
        ];

        assert_eq!(result, expected);
    }

    #[test]
    fn test_error_invalid_first_character() {
        let source_code = "invalid";
        let result = tokenizer(source_code);
        assert!(result.is_err());
    }

    #[test]
    fn test_error_unexpected_character() {
        let source_code = "<div@>";
        let result = tokenizer(source_code);
        assert!(result.is_err());
    }

    #[test]
    fn test_multiple_attributes() {
        let source_code = r#"<div class="test" id="main">content</div>"#;
        let result = tokenizer(source_code).unwrap();

        let expected = vec![
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::AttributeKey, "class".to_string()),
            Token::new(TokenType::AttributeStringValue, "test".to_string()),
            Token::new(TokenType::AttributeKey, "id".to_string()),
            Token::new(TokenType::AttributeStringValue, "main".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "content".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
        ];

        assert_eq!(result, expected);
    }

    #[test]
    fn test_mixed_attribute_types() {
        let source_code = r#"<div class="test" onClick={handleClick}>content</div>"#;
        let result = tokenizer(source_code).unwrap();

        let expected = vec![
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::AttributeKey, "class".to_string()),
            Token::new(TokenType::AttributeStringValue, "test".to_string()),
            Token::new(TokenType::AttributeKey, "onClick".to_string()),
            Token::new(TokenType::AttributeExpressionValue, "handleClick".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "content".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "div".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
        ];

        assert_eq!(result, expected);
    }

    #[test]
    fn test_empty_fragment_should_error() {
        let source_code = "<>";
        let result = tokenizer(source_code);
        assert!(result.is_err());
    }

    #[test]
    fn test_hyphenated_tag_should_error() {
        let source_code = "<div-test>";
        let result = tokenizer(source_code);
        assert!(result.is_err());
    }

    #[test]
    fn test_numeric_tag() {
        let source_code = "<h1>content</h1>";
        let result = tokenizer(source_code).unwrap();

        let expected = vec![
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::JSXIdentifier, "h1".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
            Token::new(TokenType::JSXText, "content".to_string()),
            Token::new(TokenType::LeftParentheses, "<".to_string()),
            Token::new(TokenType::BackSlash, "/".to_string()),
            Token::new(TokenType::JSXIdentifier, "h1".to_string()),
            Token::new(TokenType::RightParentheses, ">".to_string()),
        ];

        assert_eq!(result, expected);
    }

    #[test]
    fn test_tokenizer_state_isolation() {
        // Test that multiple calls to tokenizer don't interfere with each other
        let jsx1 = "<div>test1</div>";
        let jsx2 = "<span>test2</span>";

        let result1 = tokenizer(jsx1).unwrap();
        let result2 = tokenizer(jsx2).unwrap();

        // Verify first result
        assert_eq!(result1[1].value, "div");
        assert_eq!(result1[3].value, "test1");

        // Verify second result
        assert_eq!(result2[1].value, "span");
        assert_eq!(result2[3].value, "test2");

        // Verify they have the expected lengths
        assert_eq!(result1.len(), 8);
        assert_eq!(result2.len(), 8);
    }
}
