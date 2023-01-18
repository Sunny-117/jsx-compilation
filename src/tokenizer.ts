export enum TokenTypes {
    LeftParentheses = 'LeftParentheses',
    JSXIdentifier = 'JSXIdentifier',
    AttributeKey = 'AttributeKey',
    AttributeStringValue = 'AttributeStringValue',
    RightParentheses = 'RightParentheses',
    JSXText = 'JSXText',
    BackSlash = 'BackSlash',
}

// return [
//     { type: 'LeftParentheses', value: '<' },
//     { type: 'JSXIdentifier', value: 'h1' },
//     { type: 'AttributeKey', value: 'id' },
//     { type: 'AttributeStringValue', value: 'title' },
//     { type: 'RightParentheses', value: '>' },
//     { type: 'LeftParentheses', value: '<' },
//     { type: 'JSXIdentifier', value: 'span' },
//     { type: 'RightParentheses', value: '>' },
//     { type: 'JSXText', value: 'hello' },
//     { type: 'LeftParentheses', value: '<' },
//     { type: 'BackSlash', value: '/' },
//     { type: 'JSXIdentifier', value: 'span' },
//     { type: 'RightParentheses', value: '>' },
//     { type: 'JSXText', value: 'world' },
//     { type: 'LeftParentheses', value: '<' },
//     { type: 'BackSlash', value: '/' },
//     { type: 'JSXIdentifier', value: 'h1' },
//     { type: 'RightParentheses', value: '>' }
// ]

export interface Token {
    type: TokenTypes | '';
    value: string;
}

let currentToken: Token = {
    type: '',
    value: ''
}

const LETTERS = /[a-z0-9]/
let tokens: Token[] = []

function emit(token) {
    // currentToken重置
    currentToken = {
        type: '',
        value: ''
    }
    tokens.push(token)
}

export function tokenizer(input: string) {
    let state: any = start
    for (const char of input) {
        if (state) {
            state = state(char)
        }
    }
    return tokens

}
function start(char: string) {
    if (char === '<') {
        emit({
            type: TokenTypes.LeftParentheses,
            value: '<'
        })
        return foundLeftParentheses
    }
    throw new Error("第一个字符必须是<")
}
function endNoFile() {
    if (currentToken.value.length > 0) {
        emit(currentToken)
    }
}
function foundLeftParentheses(char: string) {//当前的char为h1
    if (LETTERS.test(char)) {
        currentToken.type = TokenTypes.JSXIdentifier
        currentToken.value += char
        return jsxIdentifier// 继续收集标识符
    }
}
function jsxIdentifier(char: string) {
    if (LETTERS.test(char)) {// 如果是小写字母或者数字
        currentToken.value += char;
        return jsxIdentifier
    } else if (char === ' ') {// 收集标识符过程中遇到了空格，说明收集完毕
        emit(currentToken)
        return endNoFile
    }
    return endNoFile
}



