import { parser } from "../src/parser";
describe("parser", () => {
  it("parser tokens to ast", () => {
    const tokens = [
      { type: 'NUMBER', value: '2' },
      { type: 'PLUS', value: '+' },
      { type: 'NUMBER', value: '3' },
      { type: 'MULTIPLY', value: '*' },
      { type: 'NUMBER', value: '4' }
    ]

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
    const res = parser(tokens)
    expect(parser(res)).toEqual(ast);
  });
});
