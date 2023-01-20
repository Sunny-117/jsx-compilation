import { IToken } from "./tokenize"

export class TokenReader {
    public tokens: IToken[]
    public position: number
    constructor(tokens: IToken[]) {
        this.tokens = tokens
        this.position = 0// 索引
    }
    // 读取/消耗当前位置上的 token
    read() {
        if (this.position < this.tokens.length) {
            return this.tokens[this.position++]
        }
        return null
    }
    peek() {
        if (this.position < this.tokens.length) {
            return this.tokens[this.position]
        }
        return null
    }
    // 恢复，倒退
    unread() {
        if (this.position > 0) {
            this.position--
        }
    }
}