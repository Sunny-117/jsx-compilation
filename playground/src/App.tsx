import React, { useState } from 'react'
import './App.css'
// @ts-ignore
import { tokenizer as tsTokenizer } from '../lib/jsx-compilation'
// Import WASM module - will be loaded dynamically
let wasmTokenizer: any = null;

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

  // WASM module is automatically initialized, no need for manual init

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
        try {
          // Load WASM module dynamically
          if (!wasmTokenizer) {
            const wasmModule = await import('../../jsx-compilation-rs/pkg/jsx_compilation_rs.js');
            wasmTokenizer = wasmModule.tokenizer;
          }

          // Use Rust WASM tokenizer
          const wasmTokens = wasmTokenizer(sourceCode);
          // Convert WASM result to regular array
          tokens = [];
          for (let i = 0; i < wasmTokens.length; i++) {
            tokens.push(wasmTokens[i]);
          }
        } catch (error) {
          // Fallback to TypeScript if WASM fails
          console.warn('WASM tokenizer failed, falling back to TypeScript:', error);
          tokens = tsTokenizer(sourceCode);
        }
      } else {
        // Use TypeScript tokenizer
        tokens = tsTokenizer(sourceCode)
      }

      let endTime = performance.now();
      let processingTime = (endTime - startTime).toFixed(2);

      // Determine actual tokenizer used
      let actualTokenizer: string = tokenizerType;
      if (tokenizerType === 'rust' && !wasmTokenizer) {
        actualTokenizer = 'typescript (fallback)';
      }

      const result = {
        tokenizer: actualTokenizer,
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
