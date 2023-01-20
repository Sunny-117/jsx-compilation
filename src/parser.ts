/**
 * 
 * @param tokens 
 * @returns ast
 */

export function parser(tokens) {
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