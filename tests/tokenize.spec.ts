import { tokenize } from "../src/tokenize";

describe("tokenize", () => {
    it("parser tokens to ast", () => {
        const tokens = '2+3*4*5'

        const res = tokenize(tokens)
        const peek1 = res.peek()
        const peek2 = res.peek()
        const peek3 = res.peek()
        expect(peek1?.value).toEqual('2')
        expect(peek2?.value).toEqual('2')
        expect(peek3?.value).toEqual('2')
        const read1 = res.read()// 消耗一个
        expect(read1?.value).toEqual('2')
        const read2 = res.read()// 消耗一个
        expect(read2?.value).toEqual('+')



        // expect(res).toEqual([
        //     { type: 'MULTIPLY', value: '2' },
        //     { type: 'NUMBER', value: '+' },
        //     { type: 'MULTIPLY', value: '3' },
        //     { type: 'PLUS', value: '*' },
        //     { type: 'MULTIPLY', value: '4' }
        // ]);
    });
});
