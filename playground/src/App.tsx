import React, { useState } from 'react'
import './App.css'
// @ts-ignore
import { tokenizer as tsTokenizer } from '../lib/jsx-compilation'
// Rust tokenizer temporarily disabled until WASM integration is complete
// @ts-ignore
// import { tokenizer as rustTokenizer } from 'jsx-compilation-rs'

const jsxExample = `<h1 id="title" name="name"><span>hello</span>world</h1>`

type TokenizerType = 'typescript' | 'rust';

export default function App() {
  const [leftValue, setLeftValue] = useState('')
  const [rightValue, setRightValue] = useState('')
  const [tokenizerType, setTokenizerType] = useState<TokenizerType>('typescript')
  const [isProcessing, setIsProcessing] = useState(false)

  const fillJSXExample = () => {
    setLeftValue(jsxExample)
  }

  const transformSourceCode = async (sourceCode: string) => {
    if (!sourceCode.trim()) {
      setRightValue('请输入JSX表达式')
      return
    }

    setIsProcessing(true)
    setRightValue('处理中...')

    try {
      let tokens;
      let startTime = performance.now();

      if (tokenizerType === 'rust') {
        // Rust tokenizer temporarily disabled
        throw new Error('Rust tokenizer is temporarily disabled. WASM integration is in progress.')
      } else {
        // Use TypeScript tokenizer
        tokens = tsTokenizer(sourceCode)
      }

      let endTime = performance.now();
      let processingTime = (endTime - startTime).toFixed(2);

      const result = {
        tokenizer: tokenizerType,
        processingTime: `${processingTime}ms`,
        tokenCount: tokens.length,
        tokens: tokens
      }

      setRightValue(JSON.stringify(result, null, 2))
      console.log(`${tokenizerType} tokenizer processed in ${processingTime}ms:`, tokens)

    } catch (error: any) {
      console.error('Tokenization error:', error)
      setRightValue(`错误: ${error?.message || error}`)
    } finally {
      setIsProcessing(false)
    }
  }
  return (
    <div className='wrapper'>
      <h1>🍻 实现 JSX 语法转成 JS 语法的编译器 <span style={{ color: 'blue' }}>playground</span></h1>

      {/* Tokenizer Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '20px' }}>
          选择编译器:
        </label>
        <label style={{ marginRight: '20px' }}>
          <input
            type="radio"
            value="typescript"
            checked={tokenizerType === 'typescript'}
            onChange={(e) => setTokenizerType(e.target.value as TokenizerType)}
            style={{ marginRight: '5px' }}
          />
          TypeScript (原版)
        </label>
        <label>
          <input
            type="radio"
            value="rust"
            checked={tokenizerType === 'rust'}
            onChange={(e) => setTokenizerType(e.target.value as TokenizerType)}
            style={{ marginRight: '5px' }}
          />
          Rust (高性能版)
        </label>
      </div>

      <button className='fillJsxButton' onClick={() => fillJSXExample()}>点击即可快速填充jsx表达式</button>

      <div className="container">
        <textarea
          placeholder='请输入jsx表达式'
          className='leftArea'
          value={leftValue}
          onChange={(e) => {
            setLeftValue(e.target.value);
          }}></textarea>
        <button
          className='transformBtn'
          onClick={() => transformSourceCode(leftValue)}
          disabled={isProcessing}
        >
          {isProcessing ? '处理中...' : `使用${tokenizerType === 'rust' ? 'Rust' : 'TypeScript'}转换`}
        </button>
        <div className='rightArea'>
          {rightValue ? rightValue : '等待转换'}
        </div>
      </div>
    </div>
  )
}
