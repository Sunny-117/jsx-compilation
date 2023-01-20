export class ASTNode {
    public type: string;
    public value?: string;
    public children: ASTNode[] | undefined
    constructor(type: string, value?: string | undefined) {
        this.type = type
        if (value) {
            this.value = value
        }
    }
    appendChild(childNode) {
        if (!this.children) {
            this.children = []
        }
        this.children.push(childNode)
    }
}

export enum NodeTypes {
    Program = 'Program',// 语法树根节点
    Numeric = 'Numeric',//数字 
    Additive = 'Additive',// 加法运算
    Multiplicative = 'Multiplicative'// 乘法运算
}