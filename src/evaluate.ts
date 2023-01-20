import { NodeTypes } from "./ast";

export function evaluate(node) {
    let result = 0;
    switch (node.type) {
        case NodeTypes.Program:
            for (let child of node.children) {
                result = evaluate(child);
            }
            break;
        case NodeTypes.Additive:
            result = evaluate(node.children[0]) + evaluate(node.children[1]);
            break;
        case NodeTypes.Multiplicative:
            result = evaluate(node.children[0]) * evaluate(node.children[1]);
            break;
        case NodeTypes.Numeric:
            result = parseFloat(node.value);
            break;
    }
    return result
}