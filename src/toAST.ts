import { ASTNode, NodeTypes } from "./ast";
import { TokenTypes } from "./tokenize";
import { TokenReader } from "./TokenReader";

/**
规则：

additive ->  multiple|multiple + additive
multiple -> NUMBER | NUMBER *  multiple

 */

export function toAST(tokenReader: TokenReader) {
    let rootNode = new ASTNode(NodeTypes.Program)

    // 推导,每一个规则都是一个函数

    let child = additive(tokenReader)
    if (child !== null) {
        rootNode.appendChild(child)
    }

    return rootNode
}


function additive(tokenReader: TokenReader) {
    let child1 = multiple(tokenReader)
    let node = child1
    let token = tokenReader.peek()//看看下一个符号是否是+
    if (child1 !== null && token !== null) {
        if (token.type === TokenTypes.PLUS) {
            // 匹配上了 multiple + additive
            token = tokenReader.read()//把+读出来并且消耗掉
            // 递归
            let child2 = additive(tokenReader)
            if (child2 !== null) {
                node = new ASTNode(NodeTypes.Additive)
                node.appendChild(child1)
                node.appendChild(child2)
            } else {
                throw new Error("非法的加法表达式,需要右半部分");
            }
        }
    }
    return node
}

function multiple(tokenReader: TokenReader): ASTNode | null {
    let child1 = number(tokenReader)//先匹配出来number，但是乘法规则还没有匹配结束，需要看下一个字符是否是*
    let node = child1
    let token = tokenReader.peek()// +
    if (child1 !== null && token !== null) {
        // 匹配上了第一个并且还剩余token
        if (token.type === TokenTypes.MULTIPLY) {
            token = tokenReader.read()//读取下一个token *
            let child2 = multiple(tokenReader)
            if (child2 !== null) {
                node = new ASTNode(NodeTypes.Multiplicative)
                node.appendChild(child1)
                node.appendChild(child2)
            } else {
                throw new Error("非法的加法表达式,需要右半部分");
            }
        }
    }
    return node
}

function number(tokenReader: TokenReader): ASTNode | null {
    let node: ASTNode | null = null
    let token = tokenReader.peek()// 看看当前这个token是啥
    if (token && TokenTypes.NUMBER) {// token类型为数字，则匹配上了
        token = tokenReader.read()//读取并且消耗掉这个token
        node = new ASTNode(NodeTypes.Numeric, token?.value)// 创建一个新的语法树节点
    }
    return node
}