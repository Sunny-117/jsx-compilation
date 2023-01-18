import { parser } from "../src/parser";
describe("parser", () => {
  it("parser tokens to ast", () => {
    const tokens = []
    const ast = {}
    expect(parser(tokens)).toEqual(ast);
  });
});
