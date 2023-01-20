
/**
 * 分词，正则
 */

import { TokenReader } from "./TokenReader";

let RegExpObject = /([0-9]+)|(\+)|(\*)/g;

export enum TokenTypes {
    NUMBER = 'NUMBER',
    PLUS = "PLUS",
    MULTIPLY = 'MULTIPLY'
}

export interface IToken {
    type: TokenTypes | ''
    value: string
}
let tokenNames = [TokenTypes.MULTIPLY, TokenTypes.NUMBER, TokenTypes.PLUS]

function* tokenizer(script) {
    let result = null
    while (true) {
        // @ts-ignore
        result = RegExpObject.exec(script)
        if (!result) break
        // @ts-ignore
        let index = result.findIndex((item, index) => index > 0 && !!item)// 匹配项的索引
        // @ts-ignore
        let token: any = { type: null, value: null };
        token.type = tokenNames[index - 1]
        token.value = result[0]
        yield token
    }
}


export function tokenize(script) {
    let tokens: IToken[] = []
    for (const token of tokenizer(script)) {
        tokens.push(token)
    }
    return new TokenReader(tokens);
}
