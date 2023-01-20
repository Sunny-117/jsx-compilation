import { ASTNode, NodeTypes } from "./ast";

/**
规则：

add ->  multiple|multiple + add
multiple -> NUMBER | NUMBER *  multiple

 */

export function toAST(tokenReader) {
    let rootNode = new ASTNode(NodeTypes.Program)

    // 推导,每一个规则都是一个函数

    let child = additive(tokenReader)
    if (child) {
        rootNode.children?.push(child)
    }

    return rootNode
}