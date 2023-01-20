export class ASTNode {
    public type: string;
    public value: string;
    public children: string[] | undefined
    constructor(type, value) {
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