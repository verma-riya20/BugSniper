import { useState,useEffect, use } from 'react'
import 'prismjs/themes/prism-tomorrow.css'
import prism from 'prismjs'
import Editor from 'react-simple-code-editor'
import rehypeHightligh from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css'
//to maintain format
import Markdown from 'react-markdown' 
//connect backend
import axios from 'axios'

import './App.css'

function App() {
  const [code, setCode] = useState('function add(a, b) {\n  return a + b;\n}')
  const [review, setReview] = useState('')
  
useEffect(()=>{
  prism.highlightAll()
}
,[])

//backend connection
async function getreview(){
  const response = await axios.post('http://localhost:3000/ai/get-response', { code })
  console.log(response.data)
  setReview(response.data)
} 
  return (
    <>
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => prism.highlight(code, prism.languages.javascript, 'javascript')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 15,
              height: '100%',
              width: '100%',
              
              borderRadius: 5,
            }}
          />
        </div>
        <div 
        onClick={getreview}
        className="review">Review</div>
      </div>
      <div className="right"><Markdown
      rehypePlugins={[rehypeHightligh]}
      >{review}</Markdown></div>
    </main>
    </>
  )
}

export default App
