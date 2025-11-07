'use client'

import CodeEditor from './CodeEditor'

interface CodeViewerProps {
  code: string
  language: string
}

export default function CodeViewer({ code, language }: CodeViewerProps) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 flex items-center justify-between">
        <span className="capitalize">{language}</span>
        <button 
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-gray-400 hover:text-white text-xs"
        >
          Copy
        </button>
      </div>
      <CodeEditor
        value={code}
        onChange={() => {}}
        language={language}
        readOnly={true}
      />
    </div>
  )
}