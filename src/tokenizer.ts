
/**
 * 有限状态机
 */
export enum TokenTypes {
    LeftParentheses = 'LeftParentheses',
    JSXIdentifier = 'JSXIdentifier',
    AttributeKey = 'AttributeKey',
    AttributeStringValue = 'AttributeStringValue',
    RightParentheses = 'RightParentheses',
    JSXText = 'JSXText',
    BackSlash = 'BackSlash',
    AttributeExpressionValue = "AttributeExpressionValue"
}

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

function emit(token: Token) {
    // currentToken重置
    currentToken = {
        type: '',
        value: ''
    }
    tokens.push(token)
}

export function tokenizer(input: string) {
    let state: any = start
    // @ts-ignore
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
function foundLeftParentheses(char: string) {//当前的char为h1
    if (LETTERS.test(char)) {
        currentToken.type = TokenTypes.JSXIdentifier
        currentToken.value += char
        return jsxIdentifier// 继续收集标识符
    } else if (char === '/') {
        emit({
            type: TokenTypes.BackSlash,
            value: '/'
        })
        return foundLeftParentheses
    }
    throw new Error('Error')
}
function jsxIdentifier(char: string) {
    if (LETTERS.test(char)) {// 如果是小写字母或者数字
        currentToken.value += char;
        return jsxIdentifier
    } else if (char === ' ') {// 收集标识符过程中遇到了空格，说明标识符结束，接下来加属性
        emit(currentToken)
        return attribute
    } else if (char === '>') {
        // 此标签没有属性了，直接结束
        emit(currentToken)
        emit({
            type: TokenTypes.RightParentheses,
            value: '>'
        })
        return foundRightParentheses
    }
    throw new Error('Error')

}

function attribute(char: string) { // char=i    
    if (LETTERS.test(char)) {
        currentToken.type = TokenTypes.AttributeKey
        currentToken.value += char
        return attributeKey // 进入新状态：读attributeKey
    } else if (char === '=') {// 属性的key已经结束，后续是值
        emit(currentToken) // { type: 'JSXIdentifier', value: 'h1' }
        return attributeValue
    }
    throw new Error('Error')
}
function attributeKey(char) {
    if (LETTERS.test(char)) {//d
        currentToken.value += char;
        return attributeKey;
    } else if (char === '=') {//说明属性的key的名字已经结束了
        emit(currentToken);// { type: 'JSXIdentifier', value: 'h1' },
        return attributeValue;
    }
    throw new TypeError('Error');
}

function attributeValue(char: string) { // char="
    if (char === '"') {
        currentToken.type = TokenTypes.AttributeStringValue// 字符串格式的属性值
        currentToken.value = ''
        return attributeStringValue
    } else if (char === '{') {
        currentToken.type = TokenTypes.AttributeExpressionValue
        currentToken.value = ''
        return attributeExpressionValue
    }
    throw new TypeError('Error');
}
function attributeExpressionValue(char: string) {
    if (LETTERS.test(char)) {
        currentToken.value += char
        return attributeExpressionValue
    } else if (char === '}') {
        emit(currentToken)
        return tryLeaveAttribute
    }
}
function attributeStringValue(char: string) {
    if (LETTERS.test(char)) {
        currentToken.value += char
        return attributeStringValue
    } else if (char === '"') {// 字符串的值结束了
        emit(currentToken)
        // <h1 title="123" name="45"></h1> 考虑多个属性
        return tryLeaveAttribute
    }
}

function tryLeaveAttribute(char: string) {
    if (char === ' ') {
        // 新属性
        return attribute
    } else if (char === '>') {
        // 开始标签结束了
        emit({
            type: TokenTypes.RightParentheses,
            value: '>'
        })
        return foundRightParentheses // 左括号结束，去寻找右括号
    }
    throw new Error('Error')
}
function foundRightParentheses(char: string) {
    if (char === '<') {
        // 开启了一个新元素
        emit({
            type: TokenTypes.LeftParentheses,
            value: '<'
        })
        return foundLeftParentheses
    } else {
        currentToken.type = TokenTypes.JSXText
        currentToken.value += char
        return jsxText
    }
}

function jsxText(char: string) {
    if (char === '<') {
        // 说明标识符结束
        emit(currentToken)
        emit({
            type: TokenTypes.LeftParentheses,
            value: '<'
        })
        return foundLeftParentheses
    } else {
        currentToken.value += char
        return jsxText
    }
}