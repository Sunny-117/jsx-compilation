import React, { useState } from 'react'
import './App.css'
import { tokenizer } from '../../src/tokenizer'
const jsxExample = `<h1 id="title" name="name"><span>hello</span>world</h1>`


export default function App() {
  const [leftValue, setLeftValue] = useState('')
  const [rightValue, setRightValue] = useState('')
  const fillJSXExample = () => {
    setLeftValue(jsxExample)
  }
  const transformSourceCode = (sourceCode: string) => {
    console.log('[ rightValue ] >', rightValue)
    // if (rightValue) {
    setRightValue('')
    // }
    console.log('%c [ rightValue ]: ', 'color: #bf2c9f; background: pink; font-size: 13px;', 'rightValue')
    const resToken = tokenizer(sourceCode)
    setRightValue(JSON.stringify(resToken))
  }
  return (
    <div className='wrapper'>
      <h1>🍻 实现 JSX 语法转成 JS 语法的编译器 <span style={{ color: 'blue' }}>playground</span></h1>
      <button className='fillJsxButton' onClick={() => fillJSXExample()}>点击即可快速填充jsx表达式</button>
      <div className="container">
        <textarea
          placeholder='请输入jsx表达式'
          className='leftArea'
          value={leftValue}
          onChange={(e) => {
            setLeftValue(e.target.value);
          }}></textarea>
        <button className='transformBtn' onClick={() => transformSourceCode(leftValue)}>点击转换</button>
        <div className='rightArea'>
          {rightValue ? rightValue : '等待转换'}
        </div>
      </div>
    </div>
  )
}
