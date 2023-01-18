import { tokenizer } from "../src/tokenizer";

describe("tokenizer", () => {
    it("full call expression", () => {
        let sourceCode = '<h1 id="title" name="name"><span>hello</span>world</h1>'
        const res1 = tokenizer(sourceCode)
        const res2 = [
            { type: 'LeftParentheses', value: '<' },
            { type: 'JSXIdentifier', value: 'h1' },
            { type: 'AttributeKey', value: 'id' },
            { type: 'AttributeStringValue', value: 'title' },
            { type: 'AttributeKey', value: 'name' },
            { type: 'AttributeStringValue', value: 'name' },
            { type: 'RightParentheses', value: '>' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'JSXIdentifier', value: 'span' },
            { type: 'RightParentheses', value: '>' },
            { type: 'JSXText', value: 'hello' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'BackSlash', value: '/' },
            { type: 'JSXIdentifier', value: 'span' },
            { type: 'RightParentheses', value: '>' },
            { type: 'JSXText', value: 'world' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'BackSlash', value: '/' },
            { type: 'JSXIdentifier', value: 'h1' },
            { type: 'RightParentheses', value: '>' }
        ]
        expect(res1).toEqual(res2);
    });


    it("full call expression", () => {
        let sourceCode = '<h1 id="title" name={name}><span>hello</span>world</h1>'
        const res1 = tokenizer(sourceCode)
        const res2 = [
            { type: 'LeftParentheses', value: '<' },
            { type: 'JSXIdentifier', value: 'h1' },
            { type: 'AttributeKey', value: 'id' },
            { type: 'AttributeStringValue', value: 'title' },
            { type: 'AttributeKey', value: 'name' },
            { type: 'AttributeStringValue', value: 'name' },
            { type: 'RightParentheses', value: '>' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'JSXIdentifier', value: 'span' },
            { type: 'RightParentheses', value: '>' },
            { type: 'JSXText', value: 'hello' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'BackSlash', value: '/' },
            { type: 'JSXIdentifier', value: 'span' },
            { type: 'RightParentheses', value: '>' },
            { type: 'JSXText', value: 'world' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'BackSlash', value: '/' },
            { type: 'JSXIdentifier', value: 'h1' },
            { type: 'RightParentheses', value: '>' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'JSXIdentifier', value: 'h1' },
            { type: 'AttributeKey', value: 'id' },
            { type: 'AttributeStringValue', value: 'title' },
            { type: 'AttributeKey', value: 'name' },
            { type: 'AttributeExpressionValue', value: 'name' },
            { type: 'RightParentheses', value: '>' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'JSXIdentifier', value: 'span' },
            { type: 'RightParentheses', value: '>' },
            { type: 'JSXText', value: 'hello' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'BackSlash', value: '/' },
            { type: 'JSXIdentifier', value: 'span' },
            { type: 'RightParentheses', value: '>' },
            { type: 'JSXText', value: 'world' },
            { type: 'LeftParentheses', value: '<' },
            { type: 'BackSlash', value: '/' },
            { type: 'JSXIdentifier', value: 'h1' },
            { type: 'RightParentheses', value: '>' }
        ]

        expect(res1).toEqual(res2);
    });
});


