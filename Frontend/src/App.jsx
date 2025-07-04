import { useState, useEffect } from 'react'
import axios from 'axios'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import { Menu, X } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'

function App() {
  const [code, setCode] = useState('function add(a, b) {\n  return a + b;\n}')
  const [review, setReview] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const language = 'javascript'

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const getReview = async () => {
    setLoading(true)
    toast.loading('🧠 Reviewing your code...')

    try {
      const response = await axios.post('https://bugsniper.onrender.com/ai/get-response', {
        code,
        language,
      })
      setReview(response.data)
      toast.dismiss()
      toast.success('✅ Review completed')
    } catch {
      setReview('⚠️ Error fetching review. Is the backend running?')
      toast.dismiss()
      toast.error('❌ Failed to fetch review')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.name.endsWith('.zip')) {
      toast.error('⚠️ .zip upload not supported yet.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setCode(event.target.result)
      toast.success(`✅ File "${file.name}" loaded successfully`)
    }
    reader.readAsText(file)
  }

  return (
    <>
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="w-full px-4 md:px-6 py-3 bg-zinc-900 text-white shadow">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-green-400 via-yellow-300 to-red-500 bg-clip-text text-transparent tracking-tight drop-shadow-md">
            🐞 Bug<span className="text-white">Sniper</span>
          </div>

          {/* Hamburger Icon (Mobile) */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`flex-col md:flex md:flex-row gap-2 mt-4 md:mt-0 transition-all duration-300 ease-in-out ${
            menuOpen ? 'flex opacity-100 scale-100' : 'hidden md:flex'
          } md:items-center md:justify-end`}
        >
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

      {/* Main Content */}
      <main
        className={`flex flex-col md:flex-row gap-4 p-4 md:p-6 xl:p-8 h-[calc(100vh-80px)] transition-colors duration-300 ${
          darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-black'
        }`}
      >
        {/* Code Editor */}
        <div
          className={`relative flex-1 rounded-xl overflow-hidden shadow min-h-[300px] md:min-h-[400px] ${
            darkMode ? 'bg-black' : 'bg-gray-100 border border-gray-300'
          }`}
        >
          <CodeMirror
            value={code}
            height="100%"
            theme={darkMode ? oneDark : 'light'}
            extensions={[javascript()]}
            onChange={(val) => setCode(val)}
            style={{ minHeight: '300px', maxHeight: '100%', overflowY: 'auto' }}
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

        {/* Review Output */}
        <div
          className={`flex-1 rounded-xl overflow-auto p-4 text-sm md:text-base shadow min-h-[300px] md:min-h-[400px] ${
            darkMode ? 'bg-zinc-700' : 'bg-zinc-100'
          }`}
        >
          {loading ? (
            '🧠 Reviewing your code...'
          ) : (
            <Markdown rehypePlugins={[rehypeRaw]}>{review}</Markdown>
          )}
        </div>
      </main>
    </>
  )
}

export default App
