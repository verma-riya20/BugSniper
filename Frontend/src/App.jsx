import { useState, useEffect } from 'react'
import axios from 'axios'
import Markdown from 'react-markdown'

import rehypeRaw from 'rehype-raw'


import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

function App() {
  const [code, setCode] = useState('function add(a, b) {\n  return a + b;\n}')
  const [review, setReview] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [loading, setLoading] = useState(false)

  const language = 'javascript' // Fixed

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const getReview = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/ai/get-response', {
        code,
        language,
      })
      setReview(response.data)
    } catch {
      setReview('⚠️ Error fetching review. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.name.endsWith('.zip')) {
      alert('⚠️ .zip upload not yet supported.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => setCode(event.target.result)
    reader.readAsText(file)
  }

  return (
    <>
      <header className="w-full px-6 py-4 flex justify-between items-center bg-zinc-900 text-white text-xl font-semibold shadow">
        🧠 BugSniper - AI Code Reviewer
        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept=".js,.txt,.zip"
            onChange={handleFileUpload}
            className="text-white text-sm px-2 py-1 border border-zinc-600 rounded bg-zinc-800 cursor-pointer"
          />
          <button
            className="px-2 py-1 text-sm bg-zinc-700 text-white rounded border border-zinc-600 hover:bg-zinc-600"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '🌞 Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <main
        className={`flex flex-col lg:flex-row gap-4 p-4 h-[calc(100vh-80px)] transition-colors duration-300 ${
          darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-black'
        }`}
      >
        {/* Code Editor */}
        <div
          className={`relative flex-1 rounded-xl overflow-hidden shadow ${
            darkMode ? 'bg-black' : 'bg-gray-100 border border-gray-300'
          }`}
        >
          <CodeMirror
            value={code}
            height="100%"
            theme={darkMode ? oneDark : 'light'}
            extensions={[javascript()]}
            onChange={(val) => setCode(val)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              foldGutter: true,
              autocompletion: true,
            }}
          />
          <button
            onClick={getReview}
            className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Review
          </button>
        </div>

        {/* AI Review Output */}
        <div
          className={`flex-1 rounded-xl overflow-auto p-4 text-base shadow ${
            darkMode ? 'bg-zinc-700' : 'bg-zinc-100'
          }`}
        >
          {loading ? '🧠 Reviewing your code...' : <Markdown rehypePlugins={[rehypeRaw]}>
  {review}
</Markdown>
}
        </div>
      </main>
    </>
  )
}

export default App
