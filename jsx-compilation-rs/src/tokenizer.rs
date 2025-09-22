use serde::{Deserialize, Serialize};

/// Token types that can be recognized in JSX
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum TokenType {
    LeftParentheses,
    JSXIdentifier,
    AttributeKey,
    AttributeStringValue,
    RightParentheses,
    JSXText,
    BackSlash,
    AttributeExpressionValue,
}

impl std::fmt::Display for TokenType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let name = match self {
            TokenType::LeftParentheses => "LeftParentheses",
            TokenType::JSXIdentifier => "JSXIdentifier",
            TokenType::AttributeKey => "AttributeKey",
            TokenType::AttributeStringValue => "AttributeStringValue",
            TokenType::RightParentheses => "RightParentheses",
            TokenType::JSXText => "JSXText",
            TokenType::BackSlash => "BackSlash",
            TokenType::AttributeExpressionValue => "AttributeExpressionValue",
        };
        write!(f, "{}", name)
    }
}

/// A token with its type and value
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Token {
    #[serde(rename = "type")]
    pub token_type: TokenType,
    pub value: String,
}

impl Token {
    pub fn new(token_type: TokenType, value: String) -> Self {
        Self { token_type, value }
    }
}

/// Error types for tokenization
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum TokenizerError {
    InvalidFirstCharacter,
    UnexpectedCharacter(char),
    UnexpectedEndOfInput,
}

impl std::fmt::Display for TokenizerError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            TokenizerError::InvalidFirstCharacter => write!(f, "第一个字符必须是<"),
            TokenizerError::UnexpectedCharacter(ch) => write!(f, "Unexpected character: {}", ch),
            TokenizerError::UnexpectedEndOfInput => write!(f, "Unexpected end of input"),
        }
    }
}

impl std::error::Error for TokenizerError {}

/// State enum for the finite state machine
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum State {
    Start,
    FoundLeftParentheses,
    JSXIdentifier,
    Attribute,
    AttributeKey,
    AttributeValue,
    AttributeStringValue,
    AttributeExpressionValue,
    TryLeaveAttribute,
    FoundRightParentheses,
    JSXText,
}

/// JSX Tokenizer using finite state machine
pub struct Tokenizer {
    tokens: Vec<Token>,
    current_token: Token,
    state: State,
}

impl Tokenizer {
    pub fn new() -> Self {
        Self {
            tokens: Vec::new(),
            current_token: Token::new(TokenType::JSXText, String::new()),
            state: State::Start,
        }
    }

    /// Emit a token and reset current token
    fn emit(&mut self, token: Token) {
        self.current_token = Token::new(TokenType::JSXText, String::new());
        self.tokens.push(token);
    }

    /// Check if character is a letter or digit
    fn is_letter_or_digit(ch: char) -> bool {
        ch.is_ascii_alphanumeric()
    }

    /// Process a character in the current state
    fn process_char(&mut self, ch: char) -> Result<(), TokenizerError> {
        self.state = match self.state {
            State::Start => self.handle_start(ch)?,
            State::FoundLeftParentheses => self.handle_found_left_parentheses(ch)?,
            State::JSXIdentifier => self.handle_jsx_identifier(ch)?,
            State::Attribute => self.handle_attribute(ch)?,
            State::AttributeKey => self.handle_attribute_key(ch)?,
            State::AttributeValue => self.handle_attribute_value(ch)?,
            State::AttributeStringValue => self.handle_attribute_string_value(ch)?,
            State::AttributeExpressionValue => self.handle_attribute_expression_value(ch)?,
            State::TryLeaveAttribute => self.handle_try_leave_attribute(ch)?,
            State::FoundRightParentheses => self.handle_found_right_parentheses(ch)?,
            State::JSXText => self.handle_jsx_text(ch)?,
        };
        Ok(())
    }

    /// Tokenize the input string
    pub fn tokenize(input: &str) -> Result<Vec<Token>, TokenizerError> {
        let mut tokenizer = Tokenizer::new();

        for ch in input.chars() {
            tokenizer.process_char(ch)?;
        }

        Ok(tokenizer.tokens)
    }

    /// Initial state - expects '<'
    fn handle_start(&mut self, ch: char) -> Result<State, TokenizerError> {
        if ch == '<' {
            self.emit(Token::new(TokenType::LeftParentheses, "<".to_string()));
            Ok(State::FoundLeftParentheses)
        } else {
            Err(TokenizerError::InvalidFirstCharacter)
        }
    }

    /// After finding '<', expect identifier or '/'
    fn handle_found_left_parentheses(&mut self, ch: char) -> Result<State, TokenizerError> {
        if Self::is_letter_or_digit(ch) {
            self.current_token.token_type = TokenType::JSXIdentifier;
            self.current_token.value.push(ch);
            Ok(State::JSXIdentifier)
        } else if ch == '/' {
            self.emit(Token::new(TokenType::BackSlash, "/".to_string()));
            Ok(State::FoundLeftParentheses)
        } else {
            Err(TokenizerError::UnexpectedCharacter(ch))
        }
    }

    /// Collecting JSX identifier characters
    fn handle_jsx_identifier(&mut self, ch: char) -> Result<State, TokenizerError> {
        if Self::is_letter_or_digit(ch) {
            self.current_token.value.push(ch);
            Ok(State::JSXIdentifier)
        } else if ch == ' ' {
            let token = self.current_token.clone();
            self.emit(token);
            Ok(State::Attribute)
        } else if ch == '>' {
            let token = self.current_token.clone();
            self.emit(token);
            self.emit(Token::new(TokenType::RightParentheses, ">".to_string()));
            Ok(State::FoundRightParentheses)
        } else {
            Err(TokenizerError::UnexpectedCharacter(ch))
        }
    }

    /// Looking for attribute key
    fn handle_attribute(&mut self, ch: char) -> Result<State, TokenizerError> {
        if Self::is_letter_or_digit(ch) {
            self.current_token.token_type = TokenType::AttributeKey;
            self.current_token.value.push(ch);
            Ok(State::AttributeKey)
        } else if ch == '=' {
            let token = self.current_token.clone();
            self.emit(token);
            Ok(State::AttributeValue)
        } else {
            Err(TokenizerError::UnexpectedCharacter(ch))
        }
    }

    /// Collecting attribute key characters
    fn handle_attribute_key(&mut self, ch: char) -> Result<State, TokenizerError> {
        if Self::is_letter_or_digit(ch) {
            self.current_token.value.push(ch);
            Ok(State::AttributeKey)
        } else if ch == '=' {
            let token = self.current_token.clone();
            self.emit(token);
            Ok(State::AttributeValue)
        } else {
            Err(TokenizerError::UnexpectedCharacter(ch))
        }
    }

    /// Expecting attribute value (string or expression)
    fn handle_attribute_value(&mut self, ch: char) -> Result<State, TokenizerError> {
        if ch == '"' {
            self.current_token.token_type = TokenType::AttributeStringValue;
            self.current_token.value.clear();
            Ok(State::AttributeStringValue)
        } else if ch == '{' {
            self.current_token.token_type = TokenType::AttributeExpressionValue;
            self.current_token.value.clear();
            Ok(State::AttributeExpressionValue)
        } else {
            Err(TokenizerError::UnexpectedCharacter(ch))
        }
    }

    /// Collecting string attribute value
    fn handle_attribute_string_value(&mut self, ch: char) -> Result<State, TokenizerError> {
        if Self::is_letter_or_digit(ch) {
            self.current_token.value.push(ch);
            Ok(State::AttributeStringValue)
        } else if ch == '"' {
            let token = self.current_token.clone();
            self.emit(token);
            Ok(State::TryLeaveAttribute)
        } else {
            Err(TokenizerError::UnexpectedCharacter(ch))
        }
    }

    /// Collecting expression attribute value
    fn handle_attribute_expression_value(&mut self, ch: char) -> Result<State, TokenizerError> {
        if Self::is_letter_or_digit(ch) {
            self.current_token.value.push(ch);
            Ok(State::AttributeExpressionValue)
        } else if ch == '}' {
            let token = self.current_token.clone();
            self.emit(token);
            Ok(State::TryLeaveAttribute)
        } else {
            Err(TokenizerError::UnexpectedCharacter(ch))
        }
    }

    /// After attribute value, decide next state
    fn handle_try_leave_attribute(&mut self, ch: char) -> Result<State, TokenizerError> {
        if ch == ' ' {
            Ok(State::Attribute)
        } else if ch == '>' {
            self.emit(Token::new(TokenType::RightParentheses, ">".to_string()));
            Ok(State::FoundRightParentheses)
        } else {
            Err(TokenizerError::UnexpectedCharacter(ch))
        }
    }

    /// After '>', expect text or new element
    fn handle_found_right_parentheses(&mut self, ch: char) -> Result<State, TokenizerError> {
        if ch == '<' {
            self.emit(Token::new(TokenType::LeftParentheses, "<".to_string()));
            Ok(State::FoundLeftParentheses)
        } else {
            self.current_token.token_type = TokenType::JSXText;
            self.current_token.value.push(ch);
            Ok(State::JSXText)
        }
    }

    /// Collecting JSX text content
    fn handle_jsx_text(&mut self, ch: char) -> Result<State, TokenizerError> {
        if ch == '<' {
            let token = self.current_token.clone();
            self.emit(token);
            self.emit(Token::new(TokenType::LeftParentheses, "<".to_string()));
            Ok(State::FoundLeftParentheses)
        } else {
            self.current_token.value.push(ch);
            Ok(State::JSXText)
        }
    }
}

/// Public tokenizer function that matches the TypeScript API
pub fn tokenizer(input: &str) -> Result<Vec<Token>, TokenizerError> {
    Tokenizer::tokenize(input)
}
