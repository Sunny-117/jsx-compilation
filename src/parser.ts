/**
 * 
 * @param tokens 
 * @returns ast
 */

import { toAST } from "./toAST"
import { tokenize } from "./tokenize"
import { TokenReader } from "./TokenReader"



export function parser(script) {
    let tokenReader: TokenReader = tokenize(script)
    let AST = toAST(tokenReader)
    return AST
    // return {
    //     "type": "Program",
    //     "children": [
    //         {
    //             "type": "Additive",
    //             "children": [
    //                 {
    //                     "type": "Numeric",
    //                     "value": "2"
    //                 },
    //                 {
    //                     "type": "Multiplicative",
    //                     "children": [
    //                         {
    //                             "type": "Numeric",
    //                             "value": "3"
    //                         },
    //                         {
    //                             "type": "Numeric",
    //                             "value": "4"
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }

}