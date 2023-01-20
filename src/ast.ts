export class ASTNode {
    public type: string;
    public value: string;
    public children: string[] | undefined
    constructor(type, value?) {
        this.type = type
        this.value = value ? value : null
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