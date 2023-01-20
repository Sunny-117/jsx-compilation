import { evaluate } from "../src/evaluate"


describe("evaluate", () => {
    it("full call expression", () => {
        const ast = {
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
        let result = evaluate(ast)
        expect(result).toBe(14)
    })
})