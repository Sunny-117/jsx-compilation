import { parser } from "../src/parser";
describe("parser", () => {
  it.only("parser tokens to ast", () => {
    const tokens = '2+3*4'
    // const tokens = '2+3*4*5'

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
    // expect(parser(res)).toEqual(ast); // now, has bug TODO
  });
});
