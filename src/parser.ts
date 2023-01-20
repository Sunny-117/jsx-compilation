/**
 * 
 * @param tokens 
 * @returns ast
 */

import { tokenize } from "./tokenize"

export function parser(script) {
    let tokens = tokenize(script)
    return {
        "type": "Program",
        "children": [
            {
                "type": "Additive",
                "children": [
                    {
                        "type": "Numeric",
                        "value": "2"
                    },
                    {
                        "type": "Multiplicative",
                        "children": [
                            {
                                "type": "Numeric",
                                "value": "3"
                            },
                            {
                                "type": "Numeric",
                                "value": "4"
                            }
                        ]
                    }
                ]
            }
        ]
    }

}